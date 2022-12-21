import '@testing-library/cypress/add-commands'
import './iframe'
import './commands'

export const INFO_MODAL_KEY = 'SAFE_v2__SafeApps__infoModal'
export const BROWSER_PERMISSIONS_KEY = 'SAFE_v2__SafeApps__browserPermissions'

const warningCheckedCustomApps = [Cypress.env('DRAIN_SAFE_URL'), Cypress.env('TX_BUILDER_URL')]

Cypress.Commands.add('visitSafeApp', appUrl => {
  cy.on('window:before:load', window => {
    window.localStorage.setItem(
      INFO_MODAL_KEY,
      JSON.stringify({
        1: {
          consentsAccepted: true,
          warningCheckedCustomApps,
        },
        5: {
          consentsAccepted: true,
          warningCheckedCustomApps,
        },
      }),
    )

    window.localStorage.setItem(
      BROWSER_PERMISSIONS_KEY,
      JSON.stringify({
        [`${Cypress.env('SAFE_APPS_BASE_URL')}/wallet-connect`]: [
          { feature: 'camera', status: 'granted' },
        ],
      }),
    )

    window.localStorage.setItem('SAFE_v2__lastWallet', JSON.stringify('E2E Wallet'))
  })

  cy.visit(appUrl, { failOnStatusCode: false })

  cy.wait(500)
})
