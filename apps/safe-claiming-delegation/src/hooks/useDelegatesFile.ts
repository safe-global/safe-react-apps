import { useQuery } from '@tanstack/react-query'

import { GUARDIANS_URL } from '@/config/constants'

export type FileDelegate = {
  name: string
  address: string
  ens: string | null
  image: string
  reason: string
  contribution: string
}

const shuffleArray = <T extends unknown[]>(array: T): T => {
  return array.sort(() => Math.random() - 0.5)
}

const parseFile = async (signal?: AbortSignal): Promise<FileDelegate[]> => {
  return await fetch(GUARDIANS_URL, {
    signal,
  })
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response.json() as Promise<FileDelegate[]>
    })
    .then(shuffleArray)
}

export const useDelegatesFile = () => {
  const QUERY_KEY = 'delegatesFile'

  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: ({ signal }) => parseFile(signal),
    // Cache is populated in _app and we don't want to refetch on mount
    // because it otherwise shuffles the data again
    refetchOnMount: false,
  })
}
