const axios = require('axios')
const { sendSlackMessage } = require('../lib/slack')

require('dotenv').config()

module.exports = async (on, config) => {
  on('after:run', sendSlackMessage)
  on('task', {
    log(message) {
      console.log(message)
      return null
    },
  })

  let safeAppsList

  try {
    safeAppsList = await axios.get(
      `${process.env.CYPRESS_CLIENT_GATEWAY_BASE_URL}/v1/chains/${
        process.env.CYPRESS_CHAIN_ID
      }/safe-apps?client_url=${encodeURIComponent(process.env.CYPRESS_BASE_URL)}`,
    )
  } catch (e) {
    console.log('Unable to fetch the default list: ', e)
  }

  config.baseUrl = process.env.CYPRESS_BASE_URL
  config.env.SAFE_APPS_BASE_URL = process.env.CYPRESS_SAFE_APPS_BASE_URL
  config.env.SAFE_APPS_LIST = safeAppsList.data
  config.env.CHAIN_ID = process.env.CYPRESS_CHAIN_ID
  config.env.NETWORK_PREFIX = process.env.CYPRESS_NETWORK_PREFIX
  config.env.TESTING_SAFE_ADDRESS = process.env.CYPRESS_TESTING_SAFE_ADDRESS
  config.env.CYPRESS_MNEMONIC = process.env.CYPRESS_MNEMONIC

  return config
}
