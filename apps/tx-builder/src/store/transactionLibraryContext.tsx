import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useTransactions } from './transactionsContext'
import StorageManager from '../lib/storage'
import { Batch, BatchFile, BatchTransaction, ProposedTransaction } from '../typings/models'
import { ChainInfo, SafeInfo } from '@safe-global/safe-apps-sdk'
import { encodeToHexData } from '../utils'
import { toChecksumAddress } from 'web3-utils'
import { addChecksum, validateChecksum } from '../lib/checksum'
import { useNetwork } from './networkContext'

const packageJson = require('../../package.json')

type TransactionLibraryContextProps = {
  batches: Batch[]
  batch?: Batch
  saveBatch: (name: string, transactions: ProposedTransaction[]) => void
  removeBatch: (batchId: string | number) => void
  renameBatch: (batchId: string | number, newName: string) => void
  updateBatch: (batchId: string | number, name: string, transactions: ProposedTransaction[]) => void
  downloadBatch: (name: string, transactions: ProposedTransaction[]) => void
  executeBatch: (batch: Batch) => void
  importBatch: (file: File) => Promise<BatchFile | undefined>
  hasChecksumWarning: boolean
  setHasChecksumWarning: (hasChecksumWarning: boolean) => void
  errorMessage?: string
  setErrorMessage: (errorMessage: string) => void
}

// Currently it only checks that none the transaction values are encoded as a number
// We don't want numbers because the maximum number in JS is 2^53 - 1 but the maximum number
// in Solidity is 2^256 - 1
const validateTransactionsInBatch = (batch: BatchFile) => {
  const { transactions } = batch

  return transactions.every(tx => {
    const valueEncodedAsString = typeof tx.value === 'string'
    const contractInputsEncodingValid =
      tx.contractInputsValues === null ||
      Object.values(tx.contractInputsValues || {}).every(input => typeof input !== 'number')

    return valueEncodedAsString && contractInputsEncodingValid
  })
}

export const TransactionLibraryContext = createContext<TransactionLibraryContextProps | null>(null)

const TransactionLibraryProvider: React.FC = ({ children }) => {
  const [batches, setBatches] = useState<Batch[]>([])
  const [batch, setBatch] = useState<Batch>()
  const [hasChecksumWarning, setHasChecksumWarning] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const { resetTransactions } = useTransactions()
  const { chainInfo, safe } = useNetwork()

  const loadBatches = useCallback(async (): Promise<Batch[]> => {
    if (chainInfo) {
      const batchesRecords = await StorageManager.getBatches()
      const batches: Batch[] = Object.keys(batchesRecords)
        .filter(key => batchesRecords[key].chainId === chainInfo.chainId) // batches filtered by chain
        .reduce((batches: Batch[], key: string) => {
          const batchFile = batchesRecords[key]
          const batch = {
            id: key,
            name: batchFile.meta.name,
            transactions: convertToProposedTransactions(batchFile, chainInfo),
          }

          return [...batches, batch]
        }, [])

      setBatches(batches)

      return batches
    }
    return []
  }, [chainInfo])

  // on App init we load stored batches
  useEffect(() => {
    loadBatches()
  }, [loadBatches])

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>

    if (hasChecksumWarning) {
      id = setTimeout(() => setHasChecksumWarning(false), 5000)
    }

    return () => clearTimeout(id)
  }, [hasChecksumWarning])

  const saveBatch = useCallback(
    async (name, transactions) => {
      const { id: batchId } = await StorageManager.saveBatch(
        addChecksum(
          generateBatchFile({
            name,
            description: '',
            transactions,
            chainInfo,
            safe,
          }),
        ),
      )
      const batches = await loadBatches()
      const batch = batches.find(batch => batch.id === batchId)
      setBatch(batch)
    },
    [chainInfo, safe, loadBatches],
  )

  const updateBatch = useCallback(
    async (batchId: string | number, name: string, transactions: ProposedTransaction[]) => {
      const batch = await StorageManager.getBatch(String(batchId))
      if (batch) {
        await StorageManager.updateBatch(
          String(batchId),
          addChecksum(
            generateBatchFile({
              name,
              description: '',
              transactions,
              chainInfo,
              safe,
            }),
          ),
        )
      }
      const batches = await loadBatches()
      setBatch(batches.find(batch => batch.id === batchId))
    },
    [loadBatches, chainInfo, safe],
  )

  const removeBatch = useCallback(
    async (batchId: string | number) => {
      await StorageManager.removeBatch(String(batchId))
      await loadBatches()
      setBatch(undefined)
    },
    [loadBatches],
  )

  const renameBatch = useCallback(
    async (batchId: string | number, newName: string) => {
      const batch = await StorageManager.getBatch(String(batchId))
      const trimmedName = newName.trim()
      if (batch && trimmedName) {
        batch.meta.name = trimmedName
        await StorageManager.updateBatch(String(batchId), batch)
      }
      const batches = await loadBatches()
      setBatch(batches.find(batch => batch.id === batchId))
    },
    [loadBatches],
  )

  const downloadBatch = useCallback(
    async (name, transactions) => {
      await StorageManager.downloadBatch(
        addChecksum(
          generateBatchFile({
            name,
            description: '',
            transactions,
            chainInfo,
            safe,
          }),
        ),
      )
    },
    [chainInfo, safe],
  )

  const initializeBatch = useCallback(
    (batchFile: BatchFile) => {
      setErrorMessage(undefined)
      if (chainInfo) {
        if (!validateTransactionsInBatch(batchFile)) {
          setErrorMessage(
            'Invalid transaction in the batch file. Make sure all numbers are encoded as strings.',
          )
          return
        }

        if (validateChecksum(batchFile)) {
          console.info('[Checksum check] - Checksum validation success', batchFile)
        } else {
          setHasChecksumWarning(true)
          console.error(
            '[Checksum check] - This file was modified since it was generated',
            batchFile,
          )
        }
        resetTransactions(convertToProposedTransactions(batchFile, chainInfo))
      }
      return batchFile
    },
    [chainInfo, resetTransactions],
  )

  const executeBatch = useCallback(
    async (batch: Batch) => {
      setBatch(batch)
      const batchFile = await StorageManager.getBatch(batch.id as string)

      if (batchFile) {
        initializeBatch(batchFile)
      }
    },
    [initializeBatch],
  )

  const importBatch: TransactionLibraryContextProps['importBatch'] = useCallback(
    async file => {
      const batchFile = await initializeBatch(await StorageManager.importBatch(file))

      return batchFile
    },
    [initializeBatch],
  )

  return (
    <TransactionLibraryContext.Provider
      value={{
        batches,
        batch,
        saveBatch,
        updateBatch,
        removeBatch,
        renameBatch,
        downloadBatch,
        executeBatch,
        importBatch,
        hasChecksumWarning,
        setHasChecksumWarning,
        errorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </TransactionLibraryContext.Provider>
  )
}

export const useTransactionLibrary = () => {
  const contextValue = useContext(TransactionLibraryContext)
  if (contextValue === null) {
    throw new Error('Component must be wrapped with <TransactionLibraryProvider>')
  }

  return contextValue
}

const generateBatchFile = ({
  name,
  description,
  transactions,
  chainInfo,
  safe,
}: {
  name: string
  description: string
  transactions: ProposedTransaction[]
  chainInfo: ChainInfo | undefined
  safe: SafeInfo
}): BatchFile => {
  return {
    version: '1.0',
    chainId: chainInfo?.chainId || '',
    createdAt: Date.now(),
    meta: {
      name,
      description,
      txBuilderVersion: packageJson.version,
      createdFromSafeAddress: safe.safeAddress,
      createdFromOwnerAddress: '',
    },
    transactions: convertToBatchTransactions(transactions),
  }
}

const convertToBatchTransactions = (transactions: ProposedTransaction[]): BatchTransaction[] => {
  return transactions.map(
    ({ description }: ProposedTransaction): BatchTransaction => ({
      to: description.to,
      value: description.value,
      data: description.customTransactionData,
      contractMethod: description.contractMethod,
      contractInputsValues: description.contractFieldsValues,
    }),
  )
}

const convertToProposedTransactions = (
  batchFile: BatchFile,
  chainInfo: ChainInfo,
): ProposedTransaction[] => {
  return batchFile.transactions.map((transaction, index) => {
    if (transaction.data) {
      return {
        id: index,
        contractInterface: null,
        description: {
          to: transaction.to,
          value: transaction.value,
          customTransactionData: transaction.data,
          nativeCurrencySymbol: chainInfo.nativeCurrency.symbol,
          networkPrefix: chainInfo.shortName,
        },
        raw: {
          to: transaction.to,
          value: transaction.value,
          data: transaction.data || '',
        },
      }
    }

    return {
      id: index,
      contractInterface: !!transaction.contractMethod
        ? { methods: [transaction.contractMethod] }
        : null,
      description: {
        to: transaction.to,
        value: transaction.value,
        contractMethod: transaction.contractMethod,
        contractMethodIndex: '0',
        contractFieldsValues: transaction.contractInputsValues,
        nativeCurrencySymbol: chainInfo.nativeCurrency.symbol,
        networkPrefix: chainInfo.shortName,
      },
      raw: {
        to: toChecksumAddress(transaction.to),
        value: transaction.value,
        data:
          transaction.data ||
          encodeToHexData(transaction.contractMethod, transaction.contractInputsValues) ||
          '0x',
      },
    }
  })
}

export default TransactionLibraryProvider
