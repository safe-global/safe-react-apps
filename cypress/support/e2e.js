import '@testing-library/cypress/add-commands'
import './iframe'
import './commands'

export const INFO_MODAL_KEY = 'SAFE_v2__SafeApps__infoModal'
export const BROWSER_PERMISSIONS_KEY = 'SAFE_v2__SafeApps__browserPermissions'

const chains = [1, 5, 10, 56, 100, 137, 42161, 43114, 73799, 1313161554]

let warningCheckedCustomApps = []
const drainSafeUrl = Cypress.env('DRAIN_SAFE_URL')

// TODO: Remove this once all the safe apps are deployed on the same domain in each environment
if (drainSafeUrl && drainSafeUrl.includes('safereactapps.review-react-hr.5afe.dev')) {
  warningCheckedCustomApps.push(new URL(drainSafeUrl).origin)
} else {
  warningCheckedCustomApps = [
    'https://safe-apps.dev.5afe.dev',
    'https://apps-portal.safe.global',
  ]
}

Cypress.Commands.add('visitSafeApp', (visitUrl, appUrl) => {
  if (appUrl) {
    cy.intercept('GET', `${appUrl}/manifest.json`, {
      name: 'App',
      description: 'The App',
      iconPath: 'logo.svg',
      safe_apps_permissions: [],
    })
  }

  cy.on('window:before:load', async window => {
    // Avoid to show the disclaimer and unknown apps warning
    window.localStorage.setItem(
      INFO_MODAL_KEY,
      JSON.stringify({
        ...chains.reduce(
          (acc, chainId) => ({
            ...acc,
            [`${chainId}`]: {
              consentsAccepted: true,
              warningCheckedCustomApps,
            },
          }),
          {},
        ),
      }),
    )

    window.localStorage.setItem('SAFE_v2__lastWallet', JSON.stringify('E2E Wallet'))
  })

  cy.visit(visitUrl, { failOnStatusCode: false })

  cy.wait(500)
})
