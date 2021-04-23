import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { SafeAppsSdkProvider } from '@gnosis.pm/safe-apps-ethers-provider';
import { Snackbar } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { Button, TextField } from '@gnosis.pm/safe-react-components';
import { getWethAddress, Erc20 } from '../utils/Erc20Constants';
import { ethers } from 'ethers';
import { WETHwithdraw_function } from '../utils/WETHConstants';

interface WrapperProps {
    wrap: boolean
}

const Wrapper: React.FC<WrapperProps> = (props: WrapperProps) => {
    const { sdk, safe } = useSafeAppsSDK();

    const [amountToWrap, setAmountToWrap] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [availableBalance, setAvailableBalance] = useState(0.0);
    const [isError, setIsError] = useState(false);
    const [safeTxHash, setSafeTxHash] = useState("");

    const provider = useMemo(() => new SafeAppsSdkProvider(safe, sdk), [safe, sdk]);
    const weth = useMemo(() => new ethers.Contract(getWethAddress(safe.network.toLowerCase()), Erc20, provider), [provider, safe]);

    const wrapEth = useCallback(async () => {
        if (isError) {
            return;
        }

        if (props.wrap) {
            try {
                const parsedAmount = ethers.utils.parseEther(amountToWrap)
                const safeTx = await sdk.txs.send({
                    txs: [{
                        to: getWethAddress(safe.network.toLowerCase()),
                        value: parsedAmount.toString(),
                        data: '0x'
                    }]
                })
                setSafeTxHash(safeTx.safeTxHash);
                console.log(safeTx.safeTxHash);
            } catch (e) {
                console.error(e)
            }
        } else {
            try {
                const parsedAmount = ethers.utils.parseEther(amountToWrap);
                const withdraw = new ethers.utils.Interface(WETHwithdraw_function);
                const safeTx = await sdk.txs.send({
                    txs: [{
                        to: getWethAddress(safe.network.toLowerCase()),
                        value: '0',
                        data: withdraw.encodeFunctionData("withdraw", [parsedAmount])
                    }]
                })
                setSafeTxHash(safeTx.safeTxHash);
                console.log(safeTx.safeTxHash);
            } catch (e) {
                console.error(e);
            }
        }
    }, [sdk, amountToWrap, isError, props.wrap, safe])

    async function fetchAvailableEth() {
        var newValue = "0";
        if (props.wrap) {
            const balanceEth = await sdk.eth.getBalance([safe.safeAddress]);
            newValue = ethers.utils.formatEther(balanceEth);
        } else {
            const balanceWeth = await weth.balanceOf(safe.safeAddress);
            newValue = ethers.utils.formatEther(balanceWeth);
        }
        setAvailableBalance(Number.parseFloat(newValue));
    };

    const validateAmout = useCallback((newValue: string) => {
        console.log("available balance:", availableBalance);
        if (isNaN(Number(newValue))) {
            setIsError(true);
            setErrorMessage("Not a number");
        }
        else if (Number.parseFloat(newValue) > availableBalance) {
            console.log("on switch new value ", Number.parseFloat(newValue));
            console.log("on switch available balance", availableBalance);
            setIsError(true);
            setErrorMessage("Insufficient funds");
        }
        else {
            setIsError(false);
            setErrorMessage("");
            setAmountToWrap(newValue);
        }
    }, [availableBalance])

    useEffect(() => {
        const runEffect = async () => {
            await fetchAvailableEth();
            await validateAmout("");
        };
        runEffect();
    }, [safe, sdk, props, availableBalance, fetchAvailableEth, validateAmout]);

    return (
        <Grid container spacing={3}>
            <Snackbar
                open={safeTxHash.length !== 0}
                autoHideDuration={3000}
                onClose={() => setSafeTxHash("")}
                message="You transaction has been submitted"
            />
            <Grid item xs={8}>
                <TextField
                    value={amountToWrap}
                    label={props.wrap ? "ETH amount" : "WETH amount"}
                    meta={{ error: errorMessage }}
                    onChange={e => validateAmout(e.target.value)} />
            </Grid>
            <Grid item xs={8}>
                <Button size="md" color="primary" variant="contained" onClick={() => wrapEth()}>
                    {props.wrap ? "Wrap" : "Unwrap"}
                </Button>
            </Grid>
        </Grid>);
}

export default Wrapper;
