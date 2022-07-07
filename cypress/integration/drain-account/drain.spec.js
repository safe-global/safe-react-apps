describe('Testing Drain Account safe app', () => {
  // TODO use an ENV parameter for appUrl so we can configure different environments or PRs
  const appUrl = `${Cypress.env('SAFE_APPS_BASE_URL')}/drain-safe`
  const iframeSelector = `iframe[id="iframe-${appUrl}"]`

  beforeEach(() => {
    // Navigate to Safe App in TESTING SAFE
    cy.visit(
      `${Cypress.env('BASE_URL')}/${Cypress.env('NETWORK_PREFIX')}:${Cypress.env(
        'TESTING_SAFE_ADDRESS',
      )}/apps?appUrl=${encodeURIComponent(appUrl)}`,
    )

    // Accept cookies
    cy.findByText('Accept all').click({ force: true })
    cy.findByText('Confirm').click({ force: true })
    cy.frameLoaded(iframeSelector)
  })

  it('should allow to perform a drain', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/recipient/i)
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26A6')
      getBody().findAllByText('Transfer everything').click()
    })
    cy.findByText(/drain account/i).should('be.visible')
    cy.findAllByText('transfer').should('have.length', 2)
  })

  it('should not allow to perform a drain when no assets are selected', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/Select All Rows checkbox/i)
        .click()
      getBody()
        .findByLabelText(/recipient/i)
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26A6')
      getBody().findAllByText('No tokens selected').should('be.visible')
    })
  })

  it('should allow to perform a partial drain', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/Select All Rows checkbox/i)
        .click()
      getBody()
        .findAllByLabelText(/Select Row checkbox/i)
        .eq(1)
        .click()
      getBody()
        .findAllByLabelText(/Select Row checkbox/i)
        .eq(2)
        .click()
      getBody()
        .findByLabelText(/recipient/i)
        .clear()
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26A6')
      getBody().findAllByText('Transfer 2 assets').click()
    })
    cy.findByText(/drain account/i).should('be.visible')
    cy.findAllByText('transfer').should('have.length', 2)
  })
})
