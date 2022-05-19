const safeAppsList = Cypress.env('safeAppsList')

describe('Safe Apps List', () => {
  before(() => {
    expect(safeAppsList).to.be.an('array').and.to.have.length.greaterThan(0)
  })

  safeAppsList.slice(0, 10).forEach(safeApp => {
    it(`${safeApp.name} - (${safeApp.url})`, () => {
      cy.visit(
        `/${Cypress.env('NETWORK_PREFIX')}:${Cypress.env('TESTING_SAFE_ADDRESS')}/apps?appUrl=${
          safeApp.url
        }`,
      )
      const iframeSelector = `iframe[id="iframe-${safeApp.url}"]`
      cy.findByText('Accept all').click({ force: true })
      cy.findByText('Confirm').click({ force: true })
      cy.frameLoaded(iframeSelector)
      cy.iframe(iframeSelector).get('#root,#app,.app,main,#__next,app-root,#___gatsby')
    })
  })
})
