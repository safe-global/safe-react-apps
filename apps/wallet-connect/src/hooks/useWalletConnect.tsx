import { useState, useCallback, useEffect } from 'react';
import WalletConnect from '@walletconnect/client';
import { IClientMeta } from '@walletconnect/types';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { isMetaTxArray } from '../utils/transactions';
import { areStringsEqual } from '../utils/strings';

export const LOCAL_STORAGE_URI_KEY = 'safeAppWcUri';

const rejectWithMessage = (connector: WalletConnect, id: number | undefined, message: string) => {
  connector.rejectRequest({ id, error: { message } });
};

const useWalletConnect = () => {
  const { safe, sdk } = useSafeAppsSDK();
  const [wcClientData, setWcClientData] = useState<IClientMeta | null>(null);
  const [connector, setConnector] = useState<WalletConnect | undefined>();

  const wcDisconnect = useCallback(async () => {
    connector?.killSession();
    localStorage.removeItem(LOCAL_STORAGE_URI_KEY);
    setConnector(undefined);
    setWcClientData(null);
  }, [connector]);

  const wcConnect = useCallback(
    async (uri: string) => {
      const wcConnector = new WalletConnect({ uri });
      setConnector(wcConnector);
      setWcClientData(wcConnector.peerMeta);
      localStorage.setItem(LOCAL_STORAGE_URI_KEY, uri);

      wcConnector.on('session_request', (error, payload) => {
        if (error) {
          throw error;
        }

        wcConnector.approveSession({
          accounts: [safe.safeAddress],
          chainId: safe.chainId,
        });

        setWcClientData(payload.params[0].peerMeta);
      });

      wcConnector.on('call_request', async (error, payload) => {
        if (error) {
          throw error;
        }

        try {
          let result = '0x';

          switch (payload.method) {
            case 'eth_sendTransaction': {
              const txInfo = payload.params[0];
              const { safeTxHash } = await sdk.txs.send({
                txs: [
                  {
                    to: txInfo.to,
                    value: txInfo.value || '0x0',
                    data: txInfo.data || '0x',
                  },
                ],
              });

              result = safeTxHash;
              break;
            }
            case 'gs_multi_send': {
              const txs = payload.params;

              if (!isMetaTxArray(txs)) {
                throw new Error('INVALID_TRANSACTIONS_PROVIDED');
              }

              const { safeTxHash } = await sdk.txs.send({
                txs: txs.map((txInfo) => ({
                  to: txInfo.to,
                  value: (txInfo.value || '0x0').toString(),
                  data: txInfo.data || '0x',
                })),
              });

              result = safeTxHash;
              break;
            }

            case 'personal_sign': {
              const [message, address] = payload.params;

              if (!areStringsEqual(address, safe.safeAddress)) {
                throw new Error('The address or message hash is invalid');
              }

              await sdk.txs.signMessage(message);

              return '0x';
            }

            case 'eth_sign': {
              const [address, messageHash] = payload.params;

              if (!areStringsEqual(address, safe.safeAddress) || !messageHash.startsWith('0x')) {
                throw new Error('The address or message hash is invalid');
              }

              await sdk.txs.signMessage(messageHash);

              return '0x';
            }
            default: {
              rejectWithMessage(wcConnector, payload.id, 'METHOD_NOT_SUPPORTED');
              break;
            }
          }

          wcConnector.approveRequest({
            id: payload.id,
            result,
          });
        } catch (err) {
          rejectWithMessage(wcConnector, payload.id, err.message);
        }
      });

      wcConnector.on('disconnect', (error, payload) => {
        if (error) {
          throw error;
        }
        wcDisconnect();
      });
    },
    [safe, sdk, wcDisconnect],
  );

  useEffect(() => {
    if (!connector) {
      const uri = localStorage.getItem(LOCAL_STORAGE_URI_KEY);
      if (uri) wcConnect(uri);
    }
  }, [connector, wcConnect]);

  return { wcClientData, wcConnect, wcDisconnect };
};

export default useWalletConnect;
