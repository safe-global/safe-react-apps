# Gnosis Safe Apps

[![Logo](https://raw.githubusercontent.com/gnosis/safe-react-apps/main/assets/logo.png)](https://gnosis-safe.io/)

![license](https://img.shields.io/github/license/gnosis/safe-react-apps)
![build](https://img.shields.io/github/workflow/status/gnosis/safe-react-apps/Deploy%20safe%20apps/main)
![tests](https://img.shields.io/github/workflow/status/gnosis/safe-react-apps/Test/main?label=tests)

This project contains apps developed by Gnosis to be consumed by Gnosis Safe.

## Install

### Install dependencies

```bash
yarn install
```

## Configure

Configure your `.env` file starting from `.env.example` one. You will find the necessary example on each app folder. Fill the provided example values with the necessary information. Don't forget to add your infura API key.
If no example file is provided inside the app folder the `.env` file is not needed.

## Build

We use yarn workspaces to handle different apps inside this project. All apps are built with this command:

```bash
yarn build
```

### Run locally

You can also run each app locally using the following commands:

```bash
yarn start:compound
yarn start:drain-safe
yarn start:ramp
yarn start:tx-builder
yarn start:wallet-connect
```

## Project structure

In `./apps` you can find one folder per each integration app Gnosis develops.

Also, each app must expose a `manifest.json` in order to be accepted by Gnosis Safe, you can find it in their `./public` folder. Besides the `manifest.json` file we also include the app Icon.

This will allow the Gnosis Safe to consume these resources like so: `https://apps.gnosis-safe.io/tx-builder/manifest.json`

## How to Develop a third-party App

Documentation about how to develop and integrate your third-party app can be found [here](https://docs.gnosis-safe.io/build/sdks/safe-apps).

## For developers

Inside each app folder you can find a `config-overrides.js` that shows how to modify headers with the next information. This is necessary for your app to work properly.

```
headers: {
    "Access-Control-Allow-Origin": "\*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
},
```

## Environments

These apps are deployed in the following environments.

- When the code is merged into `development`: https://safe-apps.dev.gnosisdev.com

  [Compound](https://safe-apps.dev.gnosisdev.com/compound)
  | [Drain Account](https://safe-apps.dev.gnosisdev.com/drain-safe)
  | [Ramp Network](https://safe-apps.dev.gnosisdev.com/ramp-network)
  | [Transaction Builder](https://safe-apps.dev.gnosisdev.com/tx-builder)
  | [WalletConnect](https://safe-apps.dev.gnosisdev.com/wallet-connect)

- When the code is merged into `main`: https://safe-apps.staging.gnosisdev.com

  [Compound](https://safe-apps.staging.gnosisdev.com/compound)
  | [Drain Account](https://safe-apps.staging.gnosisdev.com/drain-safe)
  | [Ramp Network](https://safe-apps.staging.gnosisdev.com/ramp-network)
  | [Transaction Builder](https://safe-apps.staging.gnosisdev.com/tx-builder)
  | [WalletConnect](https://safe-apps.staging.gnosisdev.com/wallet-connect)

- When the code is released: https://apps.gnosis-safe.io

  [Compound](https://apps.gnosis-safe.io/compound)
  | [Drain Account](https://apps.gnosis-safe.io/drain-safe)
  | [Ramp Network](https://apps.gnosis-safe.io/ramp-network)
  | [Transaction Builder](https://apps.gnosis-safe.io/tx-builder)
  | [WalletConnect](https://apps.gnosis-safe.io/wallet-connect)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
