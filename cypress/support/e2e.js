import '@testing-library/cypress/add-commands'
import './iframe'
import './commands'

export const INFO_MODAL_KEY = 'SAFE_v2__SafeApps__infoModal'
export const BROWSER_PERMISSIONS_KEY = 'SAFE_v2__SafeApps__browserPermissions'

const warningCheckedCustomApps = ['http://localhost:3001', 'http://localhost:3002']

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

  cy.visit(appUrl)

  cy.wait(500)
})
