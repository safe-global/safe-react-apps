import daiIcon from "./images/asset_DAI.svg";
import batIcon from "./images/asset_BAT.svg";
import wbtcIcon from "./images/asset_BTC.svg";
import ethIcon from "./images/asset_ETH.svg";
import repIcon from "./images/asset_REP.svg";
import usdcIcon from "./images/asset_USDC.svg";
import zrxIcon from "./images/asset_ZRX.svg";

export const web3Provider = process.env.REACT_APP_INFURA_PROVIDER || "";

export const daiAddress = process.env.REACT_APP_DAI_ADDRESS;
export const cDaiAddress = process.env.REACT_APP_CDAI_ADDRESS;

export const tokenList = [
  { id: "DAI", label: "Dai", iconUrl: daiIcon },
  { id: "BAT", label: "BAT", iconUrl: batIcon },
  { id: "ETH", label: "ETH", iconUrl: ethIcon },
  { id: "REP", label: "REP", iconUrl: repIcon },
  { id: "USDC", label: "USDC", iconUrl: usdcIcon },
  { id: "WBTC", label: "WBTC", iconUrl: wbtcIcon },
  { id: "ZRX", label: "ZXR", iconUrl: zrxIcon }
];
