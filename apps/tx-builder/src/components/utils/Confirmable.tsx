import ReactDOM from 'react-dom'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { theme } from '@gnosis.pm/safe-react-components'

type ConfirmationProps = {
  proceed: (value: boolean) => void
  show: boolean
}

type Confirmable = {
  resolve: (value: boolean) => void
}

const confirmable =
  <ComponentProps extends ConfirmationProps>(
    Component: React.FC<ComponentProps>,
  ): React.FC<Confirmable & Omit<ComponentProps, keyof ConfirmationProps>> =>
  props => {
    const [show, setShow] = React.useState(true)
    const { resolve, ...rest } = props

    const proceed = (value: boolean) => {
      setShow(false)
      resolve(value)
    }

    if (show) {
      // @ts-ignore
      return <Component proceed={proceed} show={show} {...rest} />
    } else {
      return null
    }
  }

const createConfirmation =
  <ComponentProps extends Confirmable>(
    Component: React.FC<ComponentProps>,
    unmountDelay = 1000,
    mountingNode = document.body,
  ) =>
  (props: Omit<ComponentProps, keyof Confirmable>) => {
    const wrapper = mountingNode.appendChild(document.createElement('div'))

    const promise = new Promise<boolean>(resolve => {
      try {
        ReactDOM.render(
          <ThemeProvider theme={theme}>
            {/* @ts-ignore */}
            <Component resolve={resolve} {...props} />
          </ThemeProvider>,
          wrapper,
        )
      } catch (e) {
        console.error(e)
        throw e
      }
    })

    function dispose() {
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(wrapper)
        setTimeout(() => {
          if (wrapper && wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper)
          }
        })
      }, 1000)
    }

    return promise.then((result: boolean) => {
      dispose()
      return result
    })
  }

export type { ConfirmationProps }
export { confirmable, createConfirmation }
