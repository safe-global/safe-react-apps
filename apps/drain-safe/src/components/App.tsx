import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Title, Text } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk'
import web3Utils from 'web3-utils'
import { BigNumber } from 'bignumber.js'

import useBalances, { BalancesType } from '../hooks/use-balances'
import { tokenToTx } from '../utils/sdk-helpers'
import FormContainer from './FormContainer'
import Flex from './Flex'
import Logo from './Logo'
import Balances from './Balances'
import SubmitButton from './SubmitButton'
import CancelButton from './CancelButton'
import AddressInput from './AddressInput'
import useWeb3 from '../hooks/useWeb3'
import TimedComponent from './TimedComponent'
import AppLoader from './AppLoader'

const App = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  const { web3 } = useWeb3()
  const {
    assets,
    loaded,
    error: balancesError,
    selectedTokens,
    setSelectedTokens,
  }: BalancesType = useBalances(safe.safeAddress, safe.chainId)
  const [submitting, setSubmitting] = useState(false)
  const [toAddress, setToAddress] = useState<string>('')
  const [isFinished, setFinished] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [gasPrice, setGasPrice] = useState<BigNumber>(new BigNumber(0))
  const [networkPrefix, setNetworkPrefix] = useState<string>('')

  const onError = (userMsg: string, err: Error) => {
    setError(`${userMsg}: ${err.message}`)
    console.error(userMsg, err)
  }

  const sendTxs = async (): Promise<string> => {
    const txs = assets
      .filter(item => selectedTokens.includes(item.tokenInfo.address))
      .map(item => tokenToTx(toAddress, item))
    const data = await sdk.txs.send({ txs })

    return data?.safeTxHash
  }

  const submitTx = async (): Promise<void> => {
    if (!web3Utils.isAddress(toAddress)) {
      setError('Please enter a valid recipient address')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      await sendTxs()
    } catch (e) {
      setSubmitting(false)
      onError('Failed sending transactions', e as Error)
      return
    }

    setSubmitting(false)
    setFinished(true)
    setToAddress('')
    setSelectedTokens(assets.map(token => token.tokenInfo.address))
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitTx()
  }

  const onCancel = () => {
    setError('')
    setSubmitting(false)
  }

  const onToAddressChange = useCallback((address: string): void => {
    setToAddress(address)
    setError('')
  }, [])

  const transferStatusText = useMemo(() => {
    if (!selectedTokens.length) {
      return 'No tokens selected'
    }

    if (selectedTokens.length === assets.length) {
      return 'Transfer everything'
    }

    const assetsToTransferCount = selectedTokens.length
    return `Transfer ${assetsToTransferCount} asset${assetsToTransferCount > 1 ? 's' : ''}`
  }, [assets, selectedTokens])

  const getAddressFromDomain = useCallback(
    (address: string) => web3?.eth.ens.getAddress(address) || Promise.resolve(address),
    [web3],
  )

  useEffect(() => {
    if (balancesError) {
      onError('Failed fetching balances', balancesError)
    }
  }, [balancesError])

  useEffect(() => {
    sdk.eth.getGasPrice().then((gasPrice: string) => {
      setGasPrice(new BigNumber(gasPrice))
    })
  }, [sdk.eth])

  const ethFiatPrice = Number(assets[0]?.fiatConversion || 0)

  useEffect(() => {
    const getChainInfo = async () => {
      try {
        const { shortName } = await sdk.safe.getChainInfo()
        setNetworkPrefix(shortName)
      } catch (e) {
        console.error('Unable to get chain info:', e)
      }
    }

    getChainInfo()
  }, [sdk])

  if (!loaded) {
    return <AppLoader />
  }

  return (
    <FormContainer onSubmit={onSubmit} onReset={onCancel}>
      <Flex>
        <Logo />
        <Title size="md">Drain Account</Title>
      </Flex>

      {error && (
        <Text size="xl" color="error">
          {error}
        </Text>
      )}

      {assets.length ? (
        <>
          <Balances
            ethFiatPrice={ethFiatPrice}
            gasPrice={gasPrice}
            assets={assets}
            onSelectionChange={setSelectedTokens}
          />
          {isFinished && (
            <TimedComponent timeout={5000} onTimeout={() => setFinished(false)}>
              <Text size="lg">
                The transaction has been created. ✅<span role="img" aria-label="success"></span>
                <br />
                Refresh the app when it’s executed.
              </Text>
            </TimedComponent>
          )}
          {!submitting && (
            <AddressInput
              id="recipient"
              name="toAddress"
              label="Recipient"
              networkPrefix={networkPrefix}
              address={toAddress}
              hiddenLabel={false}
              onChangeAddress={onToAddressChange}
              showNetworkPrefix={!!networkPrefix}
              getAddressFromDomain={getAddressFromDomain}
            />
          )}

          {submitting ? (
            <CancelButton>Cancel</CancelButton>
          ) : (
            <SubmitButton disabled={!selectedTokens.length}>{transferStatusText}</SubmitButton>
          )}
        </>
      ) : (
        <Text size="xl">You don't have any transferable assets</Text>
      )}
    </FormContainer>
  )
}

export default App
