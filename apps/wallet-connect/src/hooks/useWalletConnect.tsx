import { useState, useCallback, useEffect } from 'react';
import WalletConnect from '@walletconnect/client';
import { IClientMeta } from '@walletconnect/types';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { chainIdByNetwork, gnosisUrlByNetwork } from '../utils/networks';
import { encodeSignMessageCall } from '../utils/signatures';
import { isMetaTxArray } from '../utils/transactions';

export const LOCAL_STORAGE_URI_KEY = 'safeAppWcUri';

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
      const network = safe.network;

      const wcConnector = new WalletConnect({ uri });
      setConnector(wcConnector);
      setWcClientData(wcConnector.peerMeta);
      localStorage.setItem(LOCAL_STORAGE_URI_KEY, uri);

      const rejectWithMessage = (id: number | undefined, message: string) => {
        wcConnector.rejectRequest({ id, error: { message } });
      };

      wcConnector.on('session_request', (error, payload) => {
        if (error) {
          throw error;
        }

        wcConnector.approveSession({
          accounts: [safe.safeAddress],
          chainId: chainIdByNetwork[network],
        });

        setWcClientData(payload.params[0].peerMeta);
      });

      wcConnector.on('call_request', async (error, payload) => {
        if (error) {
          throw error;
        }

        switch (payload.method) {
          case 'eth_sendTransaction': {
            const txInfo = payload.params[0];
            try {
              const { safeTxHash } = await sdk.txs.send({
                txs: [
                  {
                    to: txInfo.to,
                    value: txInfo.value || '0x0',
                    data: txInfo.data || '0x',
                  },
                ],
              });

              wcConnector.approveRequest({
                id: payload.id,
                result: safeTxHash,
              });
            } catch (err) {
              wcConnector.rejectRequest({
                id: payload.id,
                error: {
                  message: err.message,
                },
              });
            }
            break;
          }
          case 'gs_multi_send': {
            const txs = payload.params;
            if (isMetaTxArray(txs)) {
              sdk.txs.send({
                txs: txs.map((txInfo) => ({
                  to: txInfo.to,
                  value: (txInfo.value || '0x0').toString(),
                  data: txInfo.data || '0x',
                })),
              });
            } else {
              rejectWithMessage(payload.id, 'INVALID_TRANSACTIONS_PROVIDED');
            }
            break;
          }

          case 'eth_sign': {
            const [address, messageHash] = payload.params;

            if (address !== safe.safeAddress || !messageHash.startsWith('0x')) {
              wcConnector.rejectRequest({
                id: payload.id,
                error: {
                  message: 'The address or message hash is invalid',
                },
              });
            }

            const callData = encodeSignMessageCall(messageHash);
            try {
              await sdk.txs.send({
                txs: [
                  {
                    to: safe.safeAddress,
                    value: '0x0',
                    data: callData,
                  },
                ],
              });

              wcConnector.approveRequest({
                id: payload.id,
                result: '0x',
              });
            } catch (err) {
              wcConnector.rejectRequest({
                id: payload.id,
                error: {
                  message: err.message,
                },
              });
            }
            break;
          }
          default: {
            rejectWithMessage(payload.id, 'METHOD_NOT_SUPPORTED');
            break;
          }
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
