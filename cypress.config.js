import { defineConfig } from 'cypress'

const axios = require('axios')
const { sendSlackMessage } = require('./cypress/lib/slack')

require('dotenv').config()

export default defineConfig({
  projectId: 'okn21k',
  chromeWebSecurity: false,
  modifyObstructiveCode: false,
  video: true,
  retries: {
    runMode: 2,
    openMode: 2,
  },
  env: {
    SAFE_APPS_BASE_URL: process.env.CYPRESS_SAFE_APPS_BASE_URL,
    CHAIN_ID: process.env.CYPRESS_CHAIN_ID,
    NETWORK_PREFIX: process.env.CYPRESS_NETWORK_PREFIX,
    TESTING_SAFE_ADDRESS: process.env.CYPRESS_TESTING_SAFE_ADDRESS,
    DRAIN_SAFE_URL: process.env.CYPRESS_DRAIN_SAFE_URL,
    TX_BUILDER_URL: process.env.CYPRESS_TX_BUILDER_URL,
  },
  e2e: {
    baseUrl: process.env.CYPRESS_WEB_BASE_URL,
    async setupNodeEvents(on, config) {
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
          }/safe-apps?client_url=${encodeURIComponent(process.env.CYPRESS_WEB_BASE_URL)}`,
        )
      } catch (e) {
        console.log('Unable to fetch the default list: ', e)
      }

      config.env.SAFE_APPS_LIST = safeAppsList.data

      return config
    },
  },
})
