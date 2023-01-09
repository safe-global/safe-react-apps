const axios = require('axios')

export const sendSlackMessage = async results => {
  if (results && results.totalPassed !== results.totalTests) {
    try {
      const url = process.env.SLACK_WEBHOOK_URL
      if (!url) {
        return
      }

      if (!results.runs[0].spec.name.includes('safe-apps-check.spec.cy.js')) {
        return
      }

      await axios.post(process.env.SLACK_WEBHOOK_URL, buildSlackMessage(results))
    } catch (error) {
      console.error(error)
    }
  }
}

const buildSlackMessage = results => {
  const failedTests = results.runs[0].tests
    .filter(test => test.state === 'failed')
    .map(test => test.title[1])

  const title = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '*Liveness tests*',
    },
  }

  const executionEnvironment = {
    type: 'section',
    fields: [
      {
        type: 'mrkdwn',
        text: `*Domain:*\n${process.env.CYPRESS_WEB_BASE_URL}`,
      },
      {
        type: 'mrkdwn',
        text: `*Network:*\n${process.env.CYPRESS_NETWORK_PREFIX}`,
      },
      {
        type: 'mrkdwn',
        text: `*Safe Address:*\n${process.env.CYPRESS_TESTING_SAFE_ADDRESS}`,
      },
      {
        type: 'mrkdwn',
        text: `*Config Service:*\n${process.env.CYPRESS_CLIENT_GATEWAY_BASE_URL}`,
      },
    ],
  }

  const safeUrl = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Safe URL:*\n${process.env.CYPRESS_WEB_BASE_URL}/${process.env.CYPRESS_NETWORK_PREFIX}:${process.env.CYPRESS_TESTING_SAFE_ADDRESS}/apps`,
    },
  }

  const executionResult = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Execution results:*\n${results.totalPassed} out of ${results.totalTests}, passed`,
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

  const blocks = [title, executionEnvironment, safeUrl, executionResult]

  if (failedTests.length > 0) {
    blocks.push(failingApps)
  }
  blocks.push(action)

  return {
    blocks,
  }
}
