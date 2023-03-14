const safeAppsList = Cypress.env('SAFE_APPS_LIST') || []

describe('Safe Apps List', () => {
  before(() => {
    expect(safeAppsList).to.be.an('array').and.to.have.length.greaterThan(0)
  })

  safeAppsList.forEach(safeApp => {
    it(safeApp.name, () => {
      cy.visitSafeApp(
        `/apps/open?safe=${Cypress.env('NETWORK_PREFIX')}:${Cypress.env(
          'TESTING_SAFE_ADDRESS',
        )}&appUrl=${safeApp.url}`,
        safeApp.url,
      )
      const iframeSelector = `iframe[id="iframe-${safeApp.url}"]`
      cy.frameLoaded(iframeSelector)
      cy.iframe(iframeSelector).get('#root,#app,.app,main,#__next,app-root,#___gatsby')
    })
  })
})
