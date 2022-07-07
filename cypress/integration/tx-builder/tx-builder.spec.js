describe('Testing Tx-builder safe app', () => {
  // TODO use an ENV parameter for appUrl so we can configure different environments or PRs
  const appUrl = `${Cypress.env('SAFE_APPS_BASE_URL')}/tx-builder`
  const iframeSelector = `iframe[id="iframe-${appUrl}"]`
  const visitUrl = `${Cypress.env('NETWORK_PREFIX')}:${Cypress.env(
    'TESTING_SAFE_ADDRESS',
  )}/apps?appUrl=${encodeURIComponent(appUrl)}`

  before(() => {
    cy.task('log', visitUrl)
  })

  beforeEach(() => {
    // Navigate to Safe App in TESTING SAFE
    cy.visit(visitUrl)

    // Accept cookies
    cy.findByText('Accept all').click({ force: true })
    cy.findByText('Confirm').click({ force: true })
    cy.frameLoaded(iframeSelector)
  })

  it('should allow to create and send a batch', () => {
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
  })

  it('should allow to create and send a batch to an ENS name', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('jago-test.eth')
      getBody()
        .findByLabelText(/ETH value/i)
        .type('0')
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
    cy.findAllByText('0xc6b82bA149CFA113f8f48d5E3b1F78e933e16DfD').should('be.visible')
  })

  it('should allow to a create and send a batch from an ABI', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/Enter ABI/i)
        .type(
          '[{{}"inputs":[{{}"internalType":"address","name":"_singleton","type":"address"{}}],"stateMutability":"nonpayable","type":"constructor"{}},{{}"stateMutability":"payable","type":"fallback"{}}]',
        )
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('0x3bc83f41490BfD25bBB44eBCAc3761DFF4Ae50DA')
      getBody()
        .findByLabelText(/ETH value/i)
        .type('0')
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
    cy.findAllByText('0x3bc83f41490BfD25bBB44eBCAc3761DFF4Ae50DA').should('be.visible')
  })

  it('should allow to create and send a batch using custom data', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody().find('input[type="checkbox"]').click()
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('0xc6b82bA149CFA113f8f48d5E3b1F78e933e16DfD')
      getBody()
        .findByLabelText(/ETH value/i)
        .type('0')
      getBody().findByLabelText(/Data/i).type('0x')
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
  })

  it('should not allow to create a batch given invalid address', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('0x49d4450977E2c95362C13D3a31a09311E0Ea26AA')
      getBody()
        .findAllByText('The address is not valid')
        .should('have.css', 'color', 'rgb(244, 67, 54)')
    })
  })

  it('should allow to upload a batch, save it to the library, download it & remove it', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findAllByText('choose a file')
        .attachFile('test-batch.json', { subjectType: 'drag-n-drop' })
      getBody().findAllByText('uploaded').wait(300)
      getBody().find('button[title="Save to Library"]').click()
      getBody()
        .findByLabelText(/Batch name/i)
        .type('E2E test')
      getBody().findAllByText('Create').should('not.be.disabled').click()
      getBody()
        .findByText(/Your transaction library/i)
        .click()
      getBody().find('button[title="Download batch"]').click()
      getBody().find('button[title="Delete Batch"]').click()
      getBody().findAllByText('Yes, delete').should('not.be.disabled').click()
      getBody()
        .findByText(/You don't have any saved batches./i)
        .should('be.visible')
      getBody()
        .findByText(/Back to Transaction Creation/i)
        .should('be.visible')
    })
    cy.readFile('cypress/downloads/E2E test.json').should('exist')
  })

  it('should simulate a valid batch as successful', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('0xc6b82bA149CFA113f8f48d5E3b1F78e933e16DfD')
      getBody()
        .findByLabelText(/ETH value/i)
        .type('0')
      getBody()
        .findByText(/add transaction/i)
        .click()
      getBody()
        .findByText(/create batch/i)
        .click()
      getBody()
        .findByText(/Simulate/i)
        .click()
      getBody().findByText('Transfer').should('be.visible')
      getBody().findByText('Success').should('be.visible')
    })
  })

  it('should simulate an invalid batch as failed', () => {
    cy.enter(iframeSelector).then(getBody => {
      getBody()
        .findByLabelText(/enter address or ens name/i)
        .type('rin:0x91dB860c37E83dab0A4A005E209577E64c61EEfA')
      getBody()
        .findByLabelText(/ETH value/i)
        .type('100')
      getBody()
        .findByText(/add transaction/i)
        .click()
      getBody()
        .findByText(/create batch/i)
        .click()
      getBody()
        .findByText(/Simulate/i)
        .click()
      getBody().findByText('fallback').should('be.visible')
      getBody().findByText('Failed').should('be.visible')
    })
  })
})
