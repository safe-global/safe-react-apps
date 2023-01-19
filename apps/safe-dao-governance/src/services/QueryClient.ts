import { QueryClient } from '@tanstack/react-query'

const _queryClient = new QueryClient()

export const getQueryClient = () => {
  return _queryClient
}

export const invalidateCache = (queryKey: string) => {
  _queryClient.invalidateQueries({ queryKey: [queryKey] })
}
