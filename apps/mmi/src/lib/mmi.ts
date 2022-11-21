import { utils } from 'ethers'
export const sign = async (address: string, msg: string): Promise<string> => {
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
        apiUrl: `${process.env.REACT_APP_MMI_BACKEND_BASE_URL}/api`,
        feature: 'custodian',
        service: 'JSONRPC',
        environment: process.env.REACT_APP_MMI_ENVIRONMENT,
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
