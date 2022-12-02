import useAsync, { type AsyncResult } from "src/hooks/useAsync"
import { useSafeSnapshotSpace } from "./useSnapshotSpace"

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
  state: "active" | "closed" | "pending"
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

const getSafeSnapshot = (
  amount: number,
  space: string
): Promise<SnapshotProposal[]> => {
  return getSnapshot({
    space,
    first: amount,
    skip: 0,
    orderBy: "created",
    orderDirection: "desc",
  })
}

const useSafeSnapshot = (amount: number): AsyncResult<SnapshotProposal[]> => {
  const snapshotSpace = useSafeSnapshotSpace()
  return useAsync(() => getSafeSnapshot(amount, snapshotSpace), [snapshotSpace])
}

export default useSafeSnapshot
