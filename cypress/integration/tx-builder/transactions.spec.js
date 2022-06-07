describe('Testing transactions', () => {
  it('should allow to send transactions', () => {
    // cy.connectWallet()

    cy.visit(
      `${Cypress.env('BASE_URL')}/${Cypress.env('NETWORK_PREFIX')}:${Cypress.env(
        'TESTING_SAFE_ADDRESS',
      )}/apps?appUrl=https%3A%2F%2Fapps.gnosis-safe.io%2Ftx-builder`,
    )

    const iframeSelector = `iframe[id="iframe-https://apps.gnosis-safe.io/tx-builder"]`

    cy.findByText('Accept all').click({ force: true })
    cy.findByText('Confirm').click({ force: true })
    cy.frameLoaded(iframeSelector)

    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26A6')
      getBody()
        .findByLabelText(/paramAddress/i)
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26A6')
      getBody()
        .findByText(/add transaction/i)
        .click()
      getBody()
        .findByText(/create batch/i)
        .click()
      getBody()
        .findByText(/send batch/i)
        .click()
    })

    cy.findByText(/transaction builder/i).should('be.visible')
    cy.findByText(/contract interaction/i).click()
    cy.findByText(/paramAddress/i).should('be.visible')
    cy.findAllByText('0x49d4450977E2c95362C13D3a31a09311E0Ea26A6').should('have.length', 2)

    // cy.findByText(/submit/i).click()
    // cy.iframe(iframeSelector)
    //   .findByText(/success!/i)
    //   .should('be.visible')
  })

  it('should not allow to create batch given invalid address', () => {
    cy.visit(
      `${Cypress.env('BASE_URL')}/${Cypress.env('NETWORK_PREFIX')}:${Cypress.env(
        'TESTING_SAFE_ADDRESS',
      )}/apps?appUrl=https%3A%2F%2Fapps.gnosis-safe.io%2Ftx-builder`,
    )

    const iframeSelector = `iframe[id="iframe-https://apps.gnosis-safe.io/tx-builder"]`

    cy.findByText('Accept all').click({ force: true })
    cy.findByText('Confirm').click({ force: true })
    cy.frameLoaded(iframeSelector)

    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26AA')
      getBody()
        .findAllByText('The address is not valid')
        .should('have.css', 'color', 'rgb(244, 67, 54)')
    })
  })

  it('should allow to upload a batch, save it to my library & then remove it', () => {
    cy.visit(
      `${Cypress.env('BASE_URL')}/${Cypress.env('NETWORK_PREFIX')}:${Cypress.env(
        'TESTING_SAFE_ADDRESS',
      )}/apps?appUrl=https%3A%2F%2Fapps.gnosis-safe.io%2Ftx-builder`,
    )

    const iframeSelector = `iframe[id="iframe-https://apps.gnosis-safe.io/tx-builder"]`

    cy.findByText('Accept all').click({ force: true })
    cy.findByText('Confirm').click({ force: true })
    cy.frameLoaded(iframeSelector)

    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findAllByText('choose a file')
        .attachFile('test-batch.json', { subjectType: 'drag-n-drop' })
      getBody()
        .findAllByText('uploaded')
        .wait(300)
      getBody()
        .find('button[title="Save to Library"]')
        .click()
      getBody()
        .findByLabelText(/Batch name/i)
        .type('E2E test')
      getBody()
        .findAllByText('Create')
        .should('not.be.disabled').click()        
      getBody()
        .findByText(/Your transaction library/i)
        .click()
      getBody()
        .find('button[title="Delete Batch"]')
        .click()
      getBody()
        .findAllByText('Yes, delete').should('not.be.disabled')
        .click()
      getBody()
        .findByText(/You don't have any saved batches./i)
        .should('be.visible')
      getBody()
        .findByText(/Back to Transaction Creation/i)
        .should('be.visible')
    })
  })
})
