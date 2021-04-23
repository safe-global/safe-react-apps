import React, { useEffect, useState, useMemo } from 'react';
import { SafeAppsSdkProvider } from '@gnosis.pm/safe-apps-ethers-provider';
import { ethers } from 'ethers';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { Erc20, getWethAddress } from '../utils/Erc20Constants'
import { Text } from '@gnosis.pm/safe-react-components';

const WethBalance: React.FC = () => {
    const [balance, setBalance] = useState("");

    const { sdk, safe } = useSafeAppsSDK();
    const provider = useMemo(() => new SafeAppsSdkProvider(safe, sdk), [safe, sdk]);
    const weth = useMemo(() => new ethers.Contract(getWethAddress(safe.network.toLowerCase()), Erc20, provider), [safe, provider]);

    async function fetchBalance() {
        const balanceWeth = await weth.balanceOf(safe.safeAddress);
        setBalance(ethers.utils.formatEther(balanceWeth));
    }

    useEffect(() => {
        fetchBalance();
        console.log("Updating WETH balance");
    });

    return <Text size="xl" >Your WETH Balance: {balance}</Text>
}

export default WethBalance;

