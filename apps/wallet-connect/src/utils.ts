import { Networks } from '@gnosis.pm/safe-apps-sdk';

export const chainIdByNetwork: { [key in Networks]: number } = {
  MAINNET: 1,
  MORDEN: 2,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42,
  XDAI: 100,
  ENERGY_WEB_CHAIN: 246,
  VOLTA: 73799,
  UNKNOWN: 1337,
};

export const gnosisUrlByNetwork: {
  [key in Networks]: null | string;
} = {
  MAINNET: 'https://gnosis-safe.io/app/#',
  MORDEN: null,
  ROPSTEN: null,
  RINKEBY: 'https://safe-team-rinkeby.staging.gnosisdev.com/app/#',
  GOERLI: null,
  KOVAN: null,
  XDAI: null,
  ENERGY_WEB_CHAIN: 'https://ewc.gnosis-safe.io/app/#',
  VOLTA: 'https://volta.gnosis-safe.io/app/#',
  UNKNOWN: null,
};

export const blobToImageData = async (blob: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    let img = new Image();
    img.src = blob;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  }).then((img) => {
    let canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    let ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Could not generate context from canvas');

    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height); // some browsers synchronously decode image here
  });
};
