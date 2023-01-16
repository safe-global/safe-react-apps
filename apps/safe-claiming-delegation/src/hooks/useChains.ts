import { getChainsConfig } from '@safe-global/safe-gateway-typescript-sdk'
import { useQuery } from '@tanstack/react-query'

export const useChains = () => {
  const QUERY_KEY = 'chains'

  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => getChainsConfig(),
  })
}
