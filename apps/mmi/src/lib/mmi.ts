import { utils } from 'ethers'
export const sign = async (address: string): Promise<string> => {
  const msg = `Safe-mmi-auth - ${Math.floor(Math.round(new Date().getTime() / 1000) / 300)}`

  const checksumAddress = utils.getAddress(address)

  try {
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [checksumAddress, msg],
    })

    return signature
  } catch (error) {
    throw error
  }
}

export const authenticate = async (refreshToken: string) => {
  try {
    await window.ethereum.request({
      method: 'metamaskinstitutional_authenticate',
      params: {
        token: refreshToken,
        apiUrl: 'https://safe-mmi.staging.5afe.dev/api',
        feature: 'custodian',
        service: 'JSONRPC',
        environment: 'gnosis-safe-staging',
        labels: [
          {
            key: 'token',
            value: 'Token',
          },
        ],
      },
    })
  } catch (err) {
    console.error(err)
  }
}
