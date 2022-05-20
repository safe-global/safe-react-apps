const axios = require('axios')
require('dotenv').config()

module.exports = async (on, config) => {
  on('after:run', async results => {
    if (results) {
      try {
        const url = process.env.SLACK_WEBHOOK_URL
        if (!url) {
          return
        }

        await axios.post(process.env.SLACK_WEBHOOK_URL, buildSlackMessage(results))
      } catch (error) {
        console.error(error)
      }
    }
  })

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

const buildSlackMessage = results => {
  const failedTests = results.runs[0].tests
    .filter(test => test.state === 'failed')
    .map(test => test.title[1])

  const title = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '*Safe Apps e2e results*',
    },
  }

  const executionResult = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${results.totalPassed} out of ${results.totalTests}, passed`,
    },
  }

  const failingApps = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Failing Apps:* _${failedTests.toString()}_`,
    },
  }

  const action = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: 'Want to take a look to the execution ?',
    },
    accessory: {
      type: 'button',
      text: {
        type: 'plain_text',
        text: 'Take me there !',
        emoji: true,
      },
      value: 'click_me_123',
      url: 'https://github.com/safe-global/safe-react-apps/actions',
      action_id: 'button-action',
    },
  }

  const blocks = [title, executionResult]

  if (failedTests.length > 0) {
    blocks.push(failingApps)
  }
  blocks.push(action)

  return {
    blocks,
  }
}
