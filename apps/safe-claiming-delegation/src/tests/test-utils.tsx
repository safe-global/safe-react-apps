import SafeProvider from '@gnosis.pm/safe-apps-react-sdk'
import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import type { RenderHookOptions } from '@testing-library/react-hooks'
import type { ReactNode } from 'react'

// Add in any providers here if necessary
const getProviders: () => React.FC<{ children?: ReactNode }> = () =>
  function ProviderComponent({ children }) {
    const { getQueryClient } = require('@/services/QueryClient') // Require dynamically to reset the cache

    const queryClient = getQueryClient()

    return (
      <QueryClientProvider client={queryClient}>
        <SafeProvider>{children}</SafeProvider>
      </QueryClientProvider>
    )
  }

const customRender = (ui: React.ReactElement) => {
  return render(ui, { wrapper: getProviders() })
}

const customRenderHook = <TProps, TResult>(
  render: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps>,
) => {
  const Providers = getProviders()

  return renderHook(render, {
    wrapper: ({ children }) => <Providers>{children}</Providers>,
    ...options,
  })
}

// Re-export everything
export * from '@testing-library/react'

// Override render methods
export { customRender as render }
export { customRenderHook as renderHook }
