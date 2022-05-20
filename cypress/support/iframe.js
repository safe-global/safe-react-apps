import '@testing-library/cypress/add-commands'

const DEFAULT_OPTS = {
  log: true,
  timeout: 30000,
}

const DEFAULT_IFRAME_SELECTOR = 'iframe'

function sleep(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

Cypress.Commands.add('frameLoaded', (selector, opts) => {
  if (selector === undefined) {
    selector = DEFAULT_IFRAME_SELECTOR
  } else if (typeof selector === 'object') {
    opts = selector
    selector = DEFAULT_IFRAME_SELECTOR
  }

  const fullOpts = {
    ...DEFAULT_OPTS,
    ...opts,
  }
  const log = fullOpts.log
    ? Cypress.log({
        name: 'frame loaded',
        displayName: 'frame loaded',
        message: [selector],
      }).snapshot()
    : null
  return cy.get(selector, { log: false }).then({ timeout: fullOpts.timeout }, async $frame => {
    log?.set('$el', $frame)
    if ($frame.length !== 1) {
      throw new Error(
        `cypress-iframe commands can only be applied to exactly one iframe at a time.  Instead found ${$frame.length}`,
      )
    }

    const contentWindow = $frame.prop('contentWindow')
    const hasNavigated = fullOpts.url
      ? () =>
          typeof fullOpts.url === 'string'
            ? contentWindow.location.toString().includes(fullOpts.url)
            : fullOpts.url?.test(contentWindow.location.toString())
      : () => contentWindow.location.toString() !== 'about:blank'

    while (!hasNavigated()) {
      await sleep(100)
    }

    if (contentWindow.document.readyState === 'complete') {
      return $frame
    }

    const loadLog = Cypress.log({
      name: 'Frame Load',
      message: [contentWindow.location.toString()],
      event: true,
    }).snapshot()
    await new Promise(resolve => {
      Cypress.$(contentWindow).on('load', resolve)
    })
    loadLog.end()
    log?.finish()
    return $frame
  })
})

Cypress.Commands.add('iframe', (selector, opts) => {
  if (selector === undefined) {
    selector = DEFAULT_IFRAME_SELECTOR
  } else if (typeof selector === 'object') {
    opts = selector
    selector = DEFAULT_IFRAME_SELECTOR
  }

  const fullOpts = {
    ...DEFAULT_OPTS,
    ...opts,
  }
  const log = fullOpts.log
    ? Cypress.log({
        name: 'iframe',
        displayName: 'iframe',
        message: [selector],
      }).snapshot()
    : null
  return cy.frameLoaded(selector, { ...fullOpts, log: false }).then($frame => {
    log?.set('$el', $frame).end()
    const contentWindow = $frame.prop('contentWindow')
    return Cypress.$(contentWindow.document.body)
  })
})

Cypress.Commands.add('enter', (selector, opts) => {
  if (selector === undefined) {
    selector = DEFAULT_IFRAME_SELECTOR
  } else if (typeof selector === 'object') {
    opts = selector
    selector = DEFAULT_IFRAME_SELECTOR
  }

  const fullOpts = {
    ...DEFAULT_OPTS,
    ...opts,
  }

  const log = fullOpts.log
    ? Cypress.log({
        name: 'enter',
        displayName: 'enter',
        message: [selector],
      }).snapshot()
    : null

  return cy.iframe(selector, { ...fullOpts, log: false }).then($body => {
    log?.set('$el', $body).end()
    return () => cy.wrap($body, { log: false })
  })
})
