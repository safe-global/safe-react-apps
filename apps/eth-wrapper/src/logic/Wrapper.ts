import { SafeInfo } from '@gnosis.pm/safe-apps-sdk';
import SafeAppsSDK from '@gnosis.pm/safe-apps-sdk/dist/src/sdk';
import { ethers } from 'ethers';
import { getWethAddress } from '../utils/Erc20Constants';
import { WETHwithdraw_function } from '../utils/WETHConstants';

export async function wrap(amountToWrap: string, safe: SafeInfo, sdk: SafeAppsSDK): Promise<string> {
    const parsedAmount = ethers.utils.parseEther(amountToWrap)
    const safeTx = await sdk.txs.send({
        txs: [{
            to: getWethAddress(safe.network.toLowerCase()),
            value: parsedAmount.toString(),
            data: '0x'
        }]
    })
    return safeTx.safeTxHash;
}

export async function withdraw(amountToWrap: string, safe: SafeInfo, sdk: SafeAppsSDK): Promise<string> {
    const parsedAmount = ethers.utils.parseEther(amountToWrap);
    const withdraw = new ethers.utils.Interface(WETHwithdraw_function);
    const safeTx = await sdk.txs.send({
        txs: [{
            to: getWethAddress(safe.network.toLowerCase()),
            value: '0',
            data: withdraw.encodeFunctionData("withdraw", [parsedAmount])
        }]
    })
    return safeTx.safeTxHash;
}

export function validateAmount(input: string, availableBalance: Number): string {
    if (isNaN(Number(input))) {
        throw new Error("Not a number");
    }
    else if (Number.parseFloat(input) > availableBalance) {
        throw new Error("Insufficient funds");
    }else {
        return input;
    }
}