import '@testing-library/cypress/add-commands'
import './iframe'
import './commands'

export const INFO_MODAL_KEY = 'SAFE_v2__SafeApps__infoModal'
export const BROWSER_PERMISSIONS_KEY = 'SAFE_v2__SafeApps__browserPermissions'

Cypress.Commands.add('visitSafeApp', appUrl => {
  cy.on('window:before:load', window => {
    window.localStorage.setItem(
      INFO_MODAL_KEY,
      JSON.stringify({
        1: { consentsAccepted: true },
        5: { consentsAccepted: true },
      }),
    )

    window.localStorage.setItem(
      BROWSER_PERMISSIONS_KEY,
      JSON.stringify({
        'https://apps.gnosis-safe.io/wallet-connect': [{ feature: 'camera', status: 'granted' }],
      }),
    )

    window.localStorage.setItem('SAFE_v2__lastWallet', JSON.stringify('E2E Wallet'))
  })

  cy.visit(appUrl)

  cy.wait(500)
})
