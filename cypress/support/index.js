import '@testing-library/cypress/add-commands'
import './iframe'
import './commands'

Cypress.Commands.add('connectE2EWallet', () => {
  cy.on('window:before:load', window => {
    window.localStorage.setItem(
      'SAFE__lastUsedProvider',
      JSON.stringify({ value: 'E2E Wallet', expiry: new Date().getTime() + 3600 * 1000 * 24 }),
    )
  })
})

// const goToLastStep = () => {
//   cy.findByText(/continue/i).then($btn => {
//     cy.findByRole('progressbar').then($progress => {
//       if ($progress.length && $progress[0].ariaValueNow !== '100') {
//         $btn.click()
//         cy.wait(800)
//       } else {
//         return
//       }

//       goToLastStep()
//     })
//   })
// }

Cypress.Commands.add('acceptSecurityFeedbackModal', () => {
  cy.findByText('Accept all').click({ force: true })
  cy.findByText('Confirm').click({ force: true })

  // TODO: When SecurityFeedback Modal in develop use this
  // goToLastStep()
  // cy.findByText(/continue/i).click()
})
