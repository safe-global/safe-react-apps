const axios = require('axios')

export const sendSlackMessage = async results => {
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
      url: 'https://github.com/safe-global/safe-react-apps/actions/workflows/safe-apps-check.yml',
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
