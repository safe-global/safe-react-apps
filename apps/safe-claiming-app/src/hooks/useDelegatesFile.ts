import { useEffect, useState } from "react"
import { GUARDIANS_URL } from "src/config/constants"

export type DelegateEntry = {
  name?: string
  address: string
  ens?: string | null
  image?: string | null
  reason?: string
  contribution?: string
}

const shuffleArray = <T>(array: T[]): T[] =>
  array.sort(() => Math.random() - 0.5)

export const useDelegatesFile = (): [
  DelegateEntry[],
  boolean,
  string | undefined
] => {
  const [delegates, setDelegates] = useState<DelegateEntry[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    let isMounted = true

    const parseFile = async () => {
      try {
        setLoading(true)

        const guardians = await fetch(GUARDIANS_URL).then((response) => {
          if (!response.ok) {
            throw Error(`Error fetching guardians: ${response.statusText}`)
          }
          return response.json() as Promise<DelegateEntry[]>
        })

        isMounted && setDelegates(shuffleArray(guardians))
      } catch (err) {
        console.error(err)
        isMounted && setLoading(false)
        isMounted && setError("Fetching delegates csv file failed.")
      }
    }

    parseFile()

    return () => {
      isMounted = false
    }
  }, [])
  return [delegates, loading, error]
}
