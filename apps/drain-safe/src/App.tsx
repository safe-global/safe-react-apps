import React, { useCallback, useState, useEffect } from 'react';
import { Button, Loader, Title, TextField, Table, EthHashInfo } from '@gnosis.pm/safe-react-components';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import erc20 from './abis/erc20';
import { fetchJson } from './utils';
import useServices from './hooks/useServices';
import Container from './Container';
import Icon from './Icon';
import Flex from './Flex';

interface Asset {
  balance: string;
  fiatBalance: string;
  fiatConversion: string;
  tokenInfo: {
    address: string;
    decimals: number;
    logoUri: string;
    name: string;
    symbol: string;
    type: string;
  };
}

interface Balance {
  fiatTotal: string;
  items: Asset[];
}

const CURRENCY = 'USD';

async function fetchSafeAssets(safeAddress: string, safeNetwork: string): Promise<Balance> {
  const network = safeNetwork.toLowerCase() === 'mainnet' ? 'mainnet' : 'rinkeby';
  const url = `https://safe-client.${network}.gnosis.io/v1/safes/${safeAddress}/balances/${CURRENCY}/?trusted=false&exclude_spam=true`;
  const data = await fetchJson(url);
  return data as Balance;
}

const App: React.FC = () => {
  const { sdk, safe } = useSafeAppsSDK();
  const services = useServices(safe.network);
  const web3: Web3 | undefined = services?.web3;
  const [submitting, setSubmitting] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [toAddress, setToAddress] = useState<string>('');

  const fetchBalances = useCallback(async (): Promise<void> => {
    // Fetch safe assets
    try {
      const data = await fetchSafeAssets(safe.safeAddress, safe.network);
      setAssets(data.items);
    } catch (err) {
      console.error("Couldn't load assets", err);
    }
  }, [safe]);

  const encodeTxData = useCallback(
    (recipient, amount): string => {
      if (web3 == null) {
        return '0x';
      }

      return web3.eth.abi.encodeFunctionCall(erc20.transfer as AbiItem, [
        web3.utils.toChecksumAddress(recipient),
        amount,
      ]);
    },
    [web3],
  );

  const submitTx = useCallback(async () => {
    setSubmitting(true);

    if (!web3!.utils.isAddress(toAddress)) {
      return;
    }

    const txs = assets.map((item) => {
      return item.tokenInfo.type === 'ETHER'
        ? {
            // Send ETH directly to the recipient address
            to: web3!.utils.toChecksumAddress(toAddress),
            value: item.balance,
            data: '0x',
          }
        : {
            // For other token types, generate a contract tx
            to: web3!.utils.toChecksumAddress(item.tokenInfo.address),
            value: '0',
            data: encodeTxData(toAddress, item.balance),
          };
    });

    let safeTxHash = '';
    try {
      const data = await sdk.txs.send({ txs });
      safeTxHash = data.safeTxHash;
      console.log(safeTxHash);
    } catch (e) {
      console.error(e);
    }

    if (!safeTxHash) {
      setSubmitting(false);
      return;
    }

    const poll = setInterval(async (): Promise<void> => {
      try {
        const safeTx = await sdk.txs.getBySafeTxHash(safeTxHash);
        console.log(safeTx);
      } catch (e) {
        return;
      }
      setSubmitting(false);

      setAssets(
        assets.map((item) => ({
          ...item,
          balance: '0',
          fiatBalance: '0',
        })),
      );
    }, 1000);

    return () => {
      clearInterval(poll);
    };
  }, [sdk, assets, toAddress, web3, encodeTxData]);

  const onToAddressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setToAddress(e.target.value);
  };

  // Fetch balances
  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return (
    <Container>
      <Flex>
        <Title size="md">Drain Account</Title>
        <div style={{ flex: 1 }} />
        <EthHashInfo hash={safe.safeAddress} network={safe.network} textSize="lg" showIdenticon showCopyBtn />
      </Flex>

      <Table
        headers={[
          { id: 'col1', label: 'Asset' },
          { id: 'col2', label: 'Amount' },
          { id: 'col3', label: `Value, ${CURRENCY}` },
        ]}
        rows={assets.map((item: Asset, index: number) => ({
          id: `${index}`,
          cells: [
            {
              content: (
                <Flex>
                  <Icon src={item.tokenInfo.logoUri} alt="" />
                  {item.tokenInfo.name}
                </Flex>
              ),
            },
            { content: Web3.utils.fromWei(item.balance) },
            { content: item.fiatBalance },
          ],
        }))}
      />

      {submitting ? (
        <>
          <Loader size="md" />
          <br />
          <Button
            size="lg"
            color="secondary"
            onClick={() => {
              setSubmitting(false);
            }}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <TextField onChange={onToAddressChange} value={toAddress} label="Recipient" />

          <Button size="lg" color="primary" onClick={submitTx} disabled={!toAddress || !assets.length}>
            Transfer everything
          </Button>
        </>
      )}
    </Container>
  );
};

export default App;
