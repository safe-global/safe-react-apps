import { Networks } from "@gnosis.pm/safe-apps-sdk";

import daiIcon from "./images/asset_DAI.svg";
import batIcon from "./images/asset_BAT.svg";
import wbtcIcon from "./images/asset_BTC.svg";
import ethIcon from "./images/asset_ETH.svg";
import repIcon from "./images/asset_REP.svg";
import usdcIcon from "./images/asset_USDC.svg";
import zxrIcon from "./images/asset_ZXR.svg";
import tokens from "./tokens";

export type TokenItem = {
  id: string;
  label: string;
  iconUrl: string;
  decimals: number;
  tokenAddr: string;
  cTokenAddr: string;
};

export const web3Provider = process.env.REACT_APP_WEB3_PROVIDER_URL || "";

export const getTokenList = (network: Networks): Array<TokenItem> => {
  const tokensByNetwork = tokens[network];
  if (!tokensByNetwork) {
    throw Error(`No token configuration for ${network}`);
  }

  return [
    {
      id: "DAI",
      label: "DAI",
      iconUrl: daiIcon,
      decimals: 18,
      tokenAddr: tokensByNetwork.DAI,
      cTokenAddr: tokensByNetwork.cDAI
    },
    {
      id: "BAT",
      label: "BAT",
      iconUrl: batIcon,
      decimals: 18,
      tokenAddr: tokensByNetwork.BAT,
      cTokenAddr: tokensByNetwork.cBAT
    },
    {
      id: "ETH",
      label: "ETH",
      iconUrl: ethIcon,
      decimals: 18,
      tokenAddr: tokensByNetwork.ETH,
      cTokenAddr: tokensByNetwork.cETH
    },
    {
      id: "REP",
      label: "REP",
      iconUrl: repIcon,
      decimals: 18,
      tokenAddr: tokensByNetwork.REP,
      cTokenAddr: tokensByNetwork.cREP
    },
    {
      id: "USDC",
      label: "USDC",
      iconUrl: usdcIcon,
      decimals: 6,
      tokenAddr: tokensByNetwork.USDC,
      cTokenAddr: tokensByNetwork.cUSDC
    },
    {
      id: "WBTC",
      label: "WBTC",
      iconUrl: wbtcIcon,
      decimals: 8,
      tokenAddr: tokensByNetwork.WBTC,
      cTokenAddr: tokensByNetwork.cWBTC
    },
    {
      id: "ZXR",
      label: "ZXR",
      iconUrl: zxrIcon,
      decimals: 18,
      tokenAddr: tokensByNetwork.ZXR,
      cTokenAddr: tokensByNetwork.cZXR
    }
  ];
};
