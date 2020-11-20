import { LowercaseNetworks } from "@gnosis.pm/safe-apps-sdk";
import { isHexString } from 'ethjs-util'

// Type for gs_multi_send transaction, taken from https://github.com/gnosis/contract-proxy-kit/blob/master/src/utils/transactions.ts#L31
export type NumberLike = number | string | bigint

export interface MetaTx {
  to: string
  value?: NumberLike
  data?: string
}

function isDecimalString(value: string): boolean {
  return !value.match(/^[0-9]*$/)
}

function isNumberLike(object: any): object is MetaTx {
  if (typeof object === 'string' && !isHexString(object) && !isDecimalString(object)) return false
  return (typeof object) in ['number', 'string', 'bigint']
}

export function isMetaTx(object: any): object is MetaTx {
  if (typeof object.to !== 'string') return false
  if (object.value && isNumberLike(object.value)) return false
  if (object.data && !isHexString(object.data)) return false
  // Make sure that operation is not set to avoid unexpected behaviour
  if (typeof object.operation !== 'undefined') return false
  return true
}

export function isMetaTxArray(object: any): object is MetaTx[] {
  if (!Array.isArray(object)) return false
  for (let tx of object) {
    if (!isMetaTx(tx)) return false
  }
  return true
}

export const chainIdByNetwork: { [key in LowercaseNetworks]: number } = {
  mainnet: 1,
  morden: 2,
  ropsten: 3,
  rinkeby: 4,
  goerli: 5,
  kovan: 42,
  xdai: 100,
  energy_web_chain: 246,
  volta: 73799,
  unknown: 1337,
};

export const gnosisUrlByNetwork: {
  [key in LowercaseNetworks]: null | string;
} = {
  mainnet: "https://gnosis-safe.io/app/#",
  morden: null,
  ropsten: null,
  rinkeby: "https://safe-team-rinkeby.staging.gnosisdev.com/app/#",
  goerli: null,
  kovan: null,
  xdai: null,
  energy_web_chain: 'https://ewc.gnosis-safe.io/app/#',
  volta: 'https://volta.gnosis-safe.io/app/#',
  unknown: null,
};

export const blobToImageData = async (blob: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    let img = new Image();
    img.src = blob;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  }).then((img) => {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Could not generate context from canvas");

    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height); // some browsers synchronously decode image here
  });
};
