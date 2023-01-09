import '@testing-library/cypress/add-commands'
import './iframe'
import './commands'

export const INFO_MODAL_KEY = 'SAFE_v2__SafeApps__infoModal'
export const BROWSER_PERMISSIONS_KEY = 'SAFE_v2__SafeApps__browserPermissions'

let warningCheckedCustomApps = []
const drainSafeUrl = Cypress.env('DRAIN_SAFE_URL')

if (drainSafeUrl) {
  warningCheckedCustomApps.push(new URL().origin)
}

Cypress.Commands.add('visitSafeApp', (visitUrl, appUrl) => {
  cy.on('window:before:load', async window => {
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

    try {
      console.log('APP URL: ', appUrl)
      const response = await fetch(`${appUrl}/manifest.json`)
      const manifest = await response.json()
      const { safe_apps_permissions } = manifest
      console.log('MANIFEST: ', manifest)

      if (safe_apps_permissions) {
        console.log(
          'PERMISSIONS: ',
          safe_apps_permissions.map(permission => ({
            feature: permission,
            status: 'granted',
          })),
        )

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
