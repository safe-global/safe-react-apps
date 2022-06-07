import '@testing-library/cypress/add-commands'
import './iframe'
import './commands';

Cypress.Commands.add('connectWallet', () => {
  cy.on('window:before:load', window => {
    window.cypressConfig = {
      connected: true,
    }
  })
})

Cypress.Commands.add('createSafe', () => {
  cy.connectWallet()

  cy.visit(`${Cypress.env('BASE_URL')}`)

  cy.contains('a', 'Accept all').click()
  cy.get('p').contains('Rinkeby').click()
  cy.get('[data-testid=connected-wallet]').should('contain', 'e2e-wallet')
  cy.contains('Create new Safe').click()
  cy.contains('Continue').click()
  cy.get('[data-testid=create-safe-name-field]').type('Test Safe')
  cy.contains('button', 'Continue').click({ force: true })
  cy.contains('button', 'Continue').click({ force: true })

  cy.wait(500) // Not sure why without this ends with "Transaction underpriced"
  cy.contains('button', 'Create').click()
  cy.contains('Your Safe was created successfully', { timeout: 60000 })
})
