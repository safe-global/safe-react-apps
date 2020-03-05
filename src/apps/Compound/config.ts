import daiIcon from "./images/asset_DAI.svg";
import batIcon from "./images/asset_BAT.svg";
import wbtcIcon from "./images/asset_BTC.svg";
import ethIcon from "./images/asset_ETH.svg";
import repIcon from "./images/asset_REP.svg";
import usdcIcon from "./images/asset_USDC.svg";
import zrxIcon from "./images/asset_ZRX.svg";

export type TokenItem = {
  id: string;
  label: string;
  iconUrl: string;
  decimals: number;
  tokenAddr: string;
  cTokenAddr: string;
};

export const web3Provider = process.env.REACT_APP_INFURA_PROVIDER || "";

const env = process.env;

export const tokenList: Array<TokenItem> = [
  {
    id: "DAI",
    label: "Dai",
    iconUrl: daiIcon,
    decimals: 18,
    tokenAddr: env.REACT_APP_DAI_ADDRESS || '',
    cTokenAddr: env.REACT_APP_CDAI_ADDRESS || ''
  },
  {
    id: "BAT",
    label: "BAT",
    iconUrl: batIcon,
    decimals: 18,
    tokenAddr: env.REACT_APP_BAT_ADDRESS || '',
    cTokenAddr: env.REACT_APP_CBAT_ADDRESS || ''
  },
  {
    id: "ETH",
    label: "ETH",
    iconUrl: ethIcon,
    decimals: 18,
    tokenAddr: env.REACT_APP_ETH_ADDRESS || '',
    cTokenAddr: env.REACT_APP_CETH_ADDRESS || ''
  },
  {
    id: "REP",
    label: "REP",
    iconUrl: repIcon,
    decimals: 18,
    tokenAddr: env.REACT_APP_AUGUR_ADDRESS || '',
    cTokenAddr: env.REACT_APP_CAUGUR_ADDRESS || ''
  },
  {
    id: "USDC",
    label: "USDC",
    iconUrl: usdcIcon,
    decimals: 6,
    tokenAddr: env.REACT_APP_USDC_ADDRESS || '',
    cTokenAddr: env.REACT_APP_CUSDC_ADDRESS || ''
  },
  {
    id: "WBTC",
    label: "WBTC",
    iconUrl: wbtcIcon,
    decimals: 8,
    tokenAddr: env.REACT_APP_WBTC_ADDRESS || '',
    cTokenAddr: env.REACT_APP_CWBTC_ADDRESS || ''
  },
  {
    id: "ZRX",
    label: "ZXR",
    iconUrl: zrxIcon,
    decimals: 18,
    tokenAddr: env.REACT_APP_ZRX_ADDRESS || '',
    cTokenAddr: env.REACT_APP_CZRX_ADDRESS || ''
  }
];
