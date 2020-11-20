import { useState, useCallback, useEffect } from "react";
import WalletConnect from "@walletconnect/client";
import { IClientMeta } from "@walletconnect/types";
import { useSafe } from "@rmeissner/safe-apps-react-sdk";
import { chainIdByNetwork, isMetaTxArray } from "../utils";

export const LOCAL_STORAGE_URI_KEY = "safeAppWcUri";

const useWalletConnect = () => {
  const safe = useSafe();
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
      const network = safe.getSafeInfo().network;

      const wcConnector = new WalletConnect({ uri });
      setConnector(wcConnector);
      setWcClientData(wcConnector.peerMeta);
      localStorage.setItem(LOCAL_STORAGE_URI_KEY, uri);

      const rejectWithMessage = (id: number | undefined, message: string) => {
        wcConnector.rejectRequest({ id, error: { message } });
      }

      wcConnector.on("session_request", (error, payload) => {
        if (error) {
          throw error;
        }

        wcConnector.approveSession({
          accounts: [safe.getSafeInfo().safeAddress],
          chainId: chainIdByNetwork[network],
        });

        setWcClientData(payload.params[0].peerMeta);
      });

      wcConnector.on("call_request", (error, payload) => {
        if (error) {
          throw error;
        }

        switch (payload.method) {
          case "eth_sendTransaction": {
            const txInfo = payload.params[0];
            safe.sendTransactions([
              {
                to: txInfo.to,
                value: txInfo.value || "0x0",
                data: txInfo.data || "0x",
              },
            ]);
            break;
          }
          case "gs_multi_send": {
            const txs = payload.params;
            if (isMetaTxArray(txs)) {
              safe.sendTransactions(
                txs.map((txInfo) => ({ to: txInfo.to, value: (txInfo.value || "0x0").toString(), data: txInfo.data || "0x" }))
              );
            } else {
              rejectWithMessage(payload.id, "INVALID_TRANSACTIONS_PROVIDED")
            }
            break;
          }
          default: {
            rejectWithMessage(payload.id, "METHOD_NOT_SUPPORTED")
            break;
          }
        }
      });

      wcConnector.on("disconnect", (error, payload) => {
        if (error) {
          throw error;
        }
        wcDisconnect();
      });
    },
    [safe, wcDisconnect]
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
