import { useEffect, useState } from "react"
import { TransactionStatus } from "@gnosis.pm/safe-react-gateway-sdk"
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk"

const POLL_INTERVAL = 10_000

export const usePendingTx = (safeTxHash?: string) => {
  const { sdk } = useSafeAppsSDK()
  const [status, setStatus] = useState<TransactionStatus>()

  useEffect(() => {
    let isCurrent = true

    const getTxStatus = async () => {
      if (!safeTxHash) return

      try {
        const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash)
        isCurrent && setStatus(safeTx.txStatus)
      } catch (error) {
        console.error(error)
      }
    }

    const timer = setInterval(getTxStatus, POLL_INTERVAL)

    return () => {
      isCurrent = false
      clearInterval(timer)
    }
  }, [sdk, safeTxHash])

  return status
}
