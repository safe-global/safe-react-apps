import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { SafeAppsSdkProvider } from '@gnosis.pm/safe-apps-ethers-provider';
import { Snackbar } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { Button, TextField } from '@gnosis.pm/safe-react-components';
import { getWethAddress, Erc20 } from '../utils/Erc20Constants';
import { ethers } from 'ethers';
import { fetchAvailableBalance, validateAmount, withdraw, wrap } from '../logic/Wrapper';

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

    const submitTransaction = useCallback(async () => {
        if (isError) {
            return;
        }
        let safeTxHash: string = "";
        try {
            safeTxHash = props.wrap ? await wrap(amountToWrap, safe, sdk) :
                await withdraw(amountToWrap, safe, sdk);

        } catch (e) {
            console.error(e)
        } finally {
            console.log("Submitted safeTxHash: ", safeTxHash);
            setSafeTxHash(safeTxHash);
        }
    }, [sdk, amountToWrap, isError, props.wrap, safe])

    const validateAmout = useCallback((newValue: string) => {
        try {
            setIsError(false);
            setErrorMessage("");
            setAmountToWrap(validateAmount(newValue, availableBalance));
        } catch (e) {
            setIsError(true);
            setErrorMessage(e.message);
        }
    }, [availableBalance])

    useEffect(() => {
        setAmountToWrap("");
    }, [props.wrap])

    useEffect(() => {
        const runEffect = async () => {
            setAvailableBalance(await fetchAvailableBalance(props.wrap, safe, sdk, weth))
        };
        runEffect();
    }, [safe, sdk, weth, props.wrap]);

    return (
        <Grid container spacing={3}>
            <Snackbar
                open={safeTxHash.length !== 0}
                autoHideDuration={3000}
                onClose={() => setSafeTxHash("")}
                message="Your transaction has been submitted"
            />
            <Grid item xs={8}>
                <TextField
                    value={amountToWrap}
                    label={props.wrap ? "ETH amount" : "WETH amount"}
                    meta={{ error: errorMessage }}
                    onChange={e => validateAmout(e.target.value)} />
            </Grid>
            <Grid item xs={8}>
                <Button size="md" color="primary" variant="contained" onClick={() => submitTransaction()}>
                    {props.wrap ? "Wrap" : "Unwrap"}
                </Button>
            </Grid>
        </Grid>);
}

export default Wrapper;
