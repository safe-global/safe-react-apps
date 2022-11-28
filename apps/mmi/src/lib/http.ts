export const MMI_BASE_URL = `${process.env.REACT_APP_MMI_BACKEND_BASE_URL}/api/v1`

export const getRefreshToken = async (address: string, signature: string): Promise<string> => {
  try {
    const response = await fetch(`${MMI_BASE_URL}/oauth/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        signature,
      }),
    })

    const data = await response.json()

    return data.refresh_token
  } catch (error) {
    throw error
  }
}
