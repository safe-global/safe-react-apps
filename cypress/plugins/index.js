const axios = require('axios')
const { sendSlackMessage } = require('../lib/slack')

require('dotenv').config()

module.exports = async (on, config) => {
  on('after:run', sendSlackMessage)

  let safeAppsList

  try {
    safeAppsList = await axios.get(
      `${
        process.env.CYPRESS_CONFIG_SERVICE_BASE_URL
      }/v1/chains/1/safe-apps?client_url=${encodeURIComponent(process.env.BASE_URL)}`,
    )
  } catch (e) {
    console.log('Unable to fetch the default list: ', e)
  }

  config.env.BASE_URL = process.env.CYPRESS_BASE_URL
  config.env.SAFE_APPS_LIST = safeAppsList.data
  config.env.NETWORK_PREFIX = process.env.CYPRESS_NETWORK_PREFIX
  config.env.TESTING_SAFE_ADDRESS = process.env.CYPRESS_TESTING_SAFE_ADDRESS

  return config
}
