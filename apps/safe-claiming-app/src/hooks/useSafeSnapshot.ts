import { useEffect, useState } from "react"

type ShapshotProposalVars = {
  space: string
  first: number
  skip: number
  orderBy: "created"
  orderDirection: "desc" | "asc"
}

export type SnapshotProposal = {
  id: string
  title: string
  state: "active" | "closed"
  author: string
}

type GqlResponse = {
  data: {
    proposals: SnapshotProposal[]
  }
  errors?: Error[]
}

const getSnapshot = async (
  variables: ShapshotProposalVars
): Promise<SnapshotProposal[]> => {
  const SNAPSHOT_GQL_ENDPOINT = "https://hub.snapshot.org/graphql"

  const query = `
        query ($first: Int, $skip: Int, $space: String, $orderBy: String, $orderDirection: OrderDirection) {
            proposals(
                first: $first,
                skip: $skip,
                orderBy: $orderBy,
                orderDirection: $orderDirection
                where: { space_in: [$space] },
            ) {
                id
                title
                state
                author
            }
        }
    `

  const { data, errors } = (await fetch(SNAPSHOT_GQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((res) => res.json())) as GqlResponse

  // GraphQL returns an array of errors in res.errors
  if (errors) {
    throw errors[0]
  }

  return data.proposals
}

const getSafeSnapshot = (amount: number): Promise<SnapshotProposal[]> => {
  const SNAPSHOT_SPACE = "safe.eth"

  return getSnapshot({
    space: SNAPSHOT_SPACE,
    first: amount,
    skip: 0,
    orderBy: "created",
    orderDirection: "desc",
  })
}

const useSafeSnapshot = (amount: number): [SnapshotProposal[], boolean] => {
  // return useAsync(() => getSafeSnapshot(amount), [])
  const [proposals, setProposals] = useState<SnapshotProposal[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true

    const fetchProposals = async () => {
      try {
        setLoading(true)

        const newProposals = await getSafeSnapshot(amount)

        isMounted && setProposals(newProposals)
      } catch (error) {
        console.error(error)
      } finally {
        isMounted && setLoading(false)
      }
    }
    fetchProposals()
    return () => {
      isMounted = false
    }
  }, [amount])

  return [proposals, loading]
}

export default useSafeSnapshot
