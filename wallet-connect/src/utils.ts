import { LowercaseNetworks } from "@gnosis.pm/safe-apps-sdk";

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
