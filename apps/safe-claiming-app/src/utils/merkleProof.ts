import { ethers, BigNumber } from "ethers"

export const EMPTY_HASH = ethers.utils.keccak256(ethers.utils.hexlify("0x"))

export const combineAndHash = (leaf1: string, leaf2: string): string => {
  const combined = ethers.utils.defaultAbiCoder.encode(
    ["bytes32", "bytes32"],
    [leaf1, leaf2]
  )
  return ethers.utils.keccak256(combined)
}

const generate = (
  input: string[],
  element?: string
): { root: string; proof: string[] } => {
  const proof: string[] = []
  const elements = [...input]
  let count = elements.length
  while (count > 1) {
    for (let i = 0; i < count; i += 2) {
      const leaf1 = elements[i]
      const leaf2 = i + 1 >= count ? EMPTY_HASH : elements[i + 1]
      if (leaf1 === element) {
        proof.push(leaf2)
        elements[i / 2] = element
      } else if (leaf2 === element) {
        proof.push(leaf1)
        elements[i / 2] = element
      } else {
        if (BigNumber.from(leaf1).lt(BigNumber.from(leaf2))) {
          elements[i / 2] = combineAndHash(leaf1, leaf2)
        } else {
          elements[i / 2] = combineAndHash(leaf2, leaf1)
        }
      }
    }
    count = Math.ceil(count / 2)
  }
  return { proof, root: elements[0] }
}

export const generateRoot = (elements: string[]): string => {
  const { root } = generate(elements)
  return root
}

export const generateProof = (
  elements: string[],
  element: string
): string[] => {
  const { proof } = generate(elements, element)
  return proof
}
