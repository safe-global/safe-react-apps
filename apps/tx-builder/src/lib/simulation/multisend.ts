import Web3 from 'web3'
import { BaseTransaction } from '@safe-global/safe-apps-sdk'
import { getMultiSendCallOnlyDeployment } from '@safe-global/safe-deployments'

const getMultiSendCallOnlyAddress = (chainId: string): string => {
  const deployment = getMultiSendCallOnlyDeployment({ network: chainId })

  if (!deployment) {
    throw new Error('MultiSendCallOnly deployment not found')
  }

  return deployment.networkAddresses[chainId]
}

const encodeMultiSendCall = (txs: BaseTransaction[]): string => {
  const web3 = new Web3()

  const joinedTxs = txs
    .map(tx =>
      [
        web3.eth.abi.encodeParameter('uint8', 0).slice(-2),
        web3.eth.abi.encodeParameter('address', tx.to).slice(-40),
        // if you pass wei as number, it will overflow
        web3.eth.abi.encodeParameter('uint256', tx.value.toString()).slice(-64),
        web3.eth.abi.encodeParameter('uint256', web3.utils.hexToBytes(tx.data).length).slice(-64),
        tx.data.replace(/^0x/, ''),
      ].join(''),
    )
    .join('')

  const encodedMultiSendCallData = web3.eth.abi.encodeFunctionCall(
    {
      name: 'multiSend',
      type: 'function',
      inputs: [
        {
          type: 'bytes',
          name: 'transactions',
        },
      ],
    },
    [`0x${joinedTxs}`],
  )

  return encodedMultiSendCallData
}

export { encodeMultiSendCall, getMultiSendCallOnlyAddress }
