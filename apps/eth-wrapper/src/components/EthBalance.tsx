import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { Text } from '@gnosis.pm/safe-react-components';

const EthBalance: React.FC = () => {
    const [balance, setBalance] = useState("loading...");
    const { sdk, safe } = useSafeAppsSDK();

    async function fetchBalance() {
        const balanceEth = await sdk.eth.getBalance([safe.safeAddress]);
        setBalance(ethers.utils.formatEther(balanceEth));
    }

    useEffect(() => {
        fetchBalance();
        console.log("Updating ETH balance");
    }, []);

    return <Text size="xl" >Your ETH balance: {balance}</Text>
}

export default EthBalance;

