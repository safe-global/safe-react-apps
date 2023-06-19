describe('Testing Drain Account safe app', { defaultCommandTimeout: 12000 }, () => {
  const appUrl = Cypress.env('DRAIN_SAFE_URL')
  const iframeSelector = `iframe[id="iframe-${appUrl}"]`
  const visitUrl = `/apps/open?safe=${Cypress.env('NETWORK_PREFIX')}:${Cypress.env(
    'TESTING_SAFE_ADDRESS',
  )}&appUrl=${encodeURIComponent(appUrl)}`

  before(() => {
    cy.task('log', visitUrl)
  })

  beforeEach(() => {
    cy.intercept('**//v1/chains/5/safes/0x168ca275d1103cb0a30980813140053c7566932F/balances/**', {
      fixture: 'balances.json',
    })

    // Navigate to Safe App in TESTING SAFE
    cy.visitSafeApp(visitUrl)

    cy.frameLoaded(iframeSelector)

    cy.findByRole('button', { name: /accept selection/i }).click()
  })

  it('should allow to perform a drain', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/recipient/i)
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26A6')
      getBody().findAllByText('Transfer everything').click()
    })
    cy.findByRole('button', { name: 'Action 1 transfer' })
    cy.findByRole('button', { name: 'Action 2' })
    cy.findByRole('button', { name: 'Action 3 transfer' })
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
    cy.findByRole('button', { name: 'Action 1' })
    cy.findByRole('button', { name: 'Action 2 transfer' })
  })

  it('should allow to perform a drain when a ENS is specified', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/recipient/i)
        .type('goerli-test-safe.eth')
        .wait(2000)
      getBody().findAllByText('Transfer everything').click()
    })
    cy.findByRole('button', { name: 'Action 1 transfer' })
    cy.findByRole('button', { name: 'Action 2' })
    cy.findByRole('button', { name: 'Action 3 transfer' })
  })

  it('should keep previous data when drain is cancelled', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/recipient/i)
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26A6')
      getBody().findAllByText('Transfer everything').click()
    })
    cy.findByRole('button', { name: 'Cancel' }).click()
    cy.enter(iframeSelector).then(getBody => {
      getBody().findAllByText('Transfer everything').should('be.visible')
    })
  })

  it('should not allow to perform a drain when no recipient is selected', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody().findAllByText('Transfer everything').click()
      getBody().findByText(/please enter a valid recipient address/i)
    })
  })

  it('should not allow to perform a drain when an invalid recipient is selected', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/recipient/i)
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26A')
      getBody().findAllByText('Transfer everything').click()
      getBody().findByText(/please enter a valid recipient address/i)
    })
  })

  it('should not allow to perform a drain when no assets are selected', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/select all rows checkbox/i)
        .click()
      getBody()
        .findByLabelText(/recipient/i)
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26A6')
      getBody().findAllByText('No tokens selected').should('be.visible')
    })
  })

  it('should not allow to perform a drain when no assets and recipient are selected', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/select all rows checkbox/i)
        .click()
      getBody().findAllByText('No tokens selected').should('be.visible')
    })
  })
})
