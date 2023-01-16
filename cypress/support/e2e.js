import '@testing-library/cypress/add-commands'
import './iframe'
import './commands'

export const INFO_MODAL_KEY = 'SAFE_v2__SafeApps__infoModal'
export const BROWSER_PERMISSIONS_KEY = 'SAFE_v2__SafeApps__browserPermissions'

const chains = [1, 5, 10, 56, 100, 137, 42161, 43114, 73799, 1313161554]

let warningCheckedCustomApps = []
const drainSafeUrl = Cypress.env('DRAIN_SAFE_URL')

if (drainSafeUrl) {
  warningCheckedCustomApps.push(new URL(drainSafeUrl).origin)
}

Cypress.Commands.add('visitSafeApp', (visitUrl, appUrl) => {
  cy.on('window:before:load', async window => {
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

    try {
      const response = await fetch(`${appUrl}/manifest.json`)
      const manifest = await response.json()
      const { safe_apps_permissions } = manifest

      if (safe_apps_permissions) {
        window.localStorage.setItem(
          BROWSER_PERMISSIONS_KEY,
          JSON.stringify({
            [new URL(appUrl).origin]: safe_apps_permissions.map(permission => ({
              feature: permission,
              status: 'granted',
            })),
          }),
        )
      }
    } catch {
      console.error(`Error retrieving manifest for ${appUrl}`)
    }

    window.localStorage.setItem('SAFE_v2__lastWallet', JSON.stringify('E2E Wallet'))
  })

  cy.visit(visitUrl, { failOnStatusCode: false })

  cy.wait(500)
})
