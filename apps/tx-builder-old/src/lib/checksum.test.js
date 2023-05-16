import { addChecksum, validateChecksum } from './checksum'

const batchFileObject = {
  version: '1.0',
  chainId: '4',
  createdAt: 1646321521061,
  meta: {
    name: 'test batch file',
    txBuilderVersion: '1.4.0',
    checksum: '',
    createdFromSafeAddress: '0xDF8a1Ce35c9a6ACE153B4e0767942f1E2291a1Aa',
    createdFromOwnerAddress: '0x49d4450977E2c95362C13D3a31a09311E0Ea26A6',
  },
  transactions: [
    {
      to: '0x49d4450977E2c95362C13D3a31a09311E0Ea26A6',
      value: '0',
      contractMethod: {
        inputs: [
          {
            internalType: 'address',
            name: 'paramAddress',
            type: 'address',
          },
        ],
        name: 'testAddress',
        payable: false,
      },
      contractInputsValues: {
        paramAddress: '0x49d4450977E2c95362C13D3a31a09311E0Ea26A6',
      },
    },
    {
      to: '0x49d4450977E2c95362C13D3a31a09311E0Ea26A6',
      value: '0',
      contractMethod: {
        inputs: [
          {
            internalType: 'bool',
            name: 'paramBool',
            type: 'bool',
          },
        ],
        name: 'testBool',
        payable: false,
      },
      contractInputsValues: {
        paramAddress: '',
        paramBool: 'false',
      },
    },
    {
      to: '0x49d4450977E2c95362C13D3a31a09311E0Ea26A6',
      value: '2000000000000000000',
      data: '0x42f4579000000000000000000000000049d4450977e2c95362c13d3a31a09311e0ea26a6',
    },
  ],
}

test('Add checksum to BatchFile', () => {
  const batchFileWithChecksum = addChecksum(batchFileObject)
  expect(batchFileWithChecksum.meta.checksum).toBe(
    '0x4ecbfd364aa6759983915644e73f8bd411e85a2dc306f252a387c2728c4db64c',
  )
})

test('Validate checksum in BatchFile', () => {
  const batchFileWithChecksum = addChecksum(batchFileObject)
  expect(
    validateChecksum(
      batchFileWithChecksum,
      '0x832ecdb6653751ed00b79dede73864163e46e71815b72e11e506d6399bedffc9',
    ),
  )
})

test('Checksum should remain the same when the properties order is not equal', () => {
  const batchFileWithChecksum = addChecksum(reverseBatchFileProps(batchFileObject))
  expect(batchFileWithChecksum.meta.checksum).toBe(
    '0x4ecbfd364aa6759983915644e73f8bd411e85a2dc306f252a387c2728c4db64c',
  )
})

const reverseBatchFileProps = () => {
  const reversedProps = {}

  Object.keys(batchFileObject)
    .reverse()
    .forEach(key => {
      if (key === 'meta') {
        const metaObject = {}
        Object.keys(batchFileObject[key])
          .reverse()
          .forEach(metaObjectKey => {
            metaObject[metaObjectKey] = batchFileObject[key][metaObjectKey]
          })
        return (reversedProps[key] = metaObject)
      }

      reversedProps[key] = batchFileObject[key]
    })

  return reversedProps
}

test('Validation should fail if we change transaction order', () => {
  const batchFileWithChecksum = addChecksum(batchFileObject)
  const batchFileObjectCopy = { ...batchFileObject }
  batchFileObjectCopy.transactions.reverse()
  const batchFileCopyWithChecksumAndTransactionsReversed = addChecksum(batchFileObjectCopy)
  expect(batchFileWithChecksum.meta.checksum).not.toBe(
    batchFileCopyWithChecksumAndTransactionsReversed.meta.checksum,
  )
})
