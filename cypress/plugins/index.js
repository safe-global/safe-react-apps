const axios = require('axios')

module.exports = async (on, config) => {
  let safeAppsList

  try {
    safeAppsList = await axios.get(
      'https://safe-client.gnosis.io/v1/chains/1/safe-apps?client_url=https%3A%2F%2Fgnosis-safe.io',
    )

    console.log('Fetched Safe Apps List')
  } catch (e) {
    console.log('Unable to fetch the default list: ', e)
  }

  config.env.safeAppsList = safeAppsList.data

  return config
}
