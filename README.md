# Safe Apps

[![Logo](https://raw.githubusercontent.com/safe-global/safe-react-apps/main/assets/logo.svg)](https://safe.global/)

![license](https://img.shields.io/github/license/safe-global/safe-react-apps)
![build](https://img.shields.io/github/actions/workflow/status/safe-global/safe-react-apps/deployment.yml?branch=main)
![tests](https://img.shields.io/github/actions/workflow/status/safe-global/safe-react-apps/safe-apps-e2e.yml?branch=main)

This project contains apps developed by Gnosis to be consumed by the Safe.

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
yarn start:drain-safe
yarn start:ramp-network
yarn start:tx-builder
yarn start:wallet-connect
```

## Contracts

This project contains some test contracts to check all solidity types in the `tx-builder` Safe App.

You can deploy your own tests contracts using the following command:

```bash
yarn workspace tx-builder contract:deploy-all <network>
```

you can invoke a read method using the command line:

```bash
yarn workspace tx-builder contract:read-method --network <network> --address <address> --method <method>
```

## Project structure

In `./apps` you can find one folder per each integration app Gnosis develops.

Also, each app must expose a `manifest.json` in order to be accepted by the Safe, you can find it in their `./public` folder. Besides the `manifest.json` file we also include the app Icon.

This will allow the Safe to consume these resources like so: `https://apps-portal.safe.global/tx-builder/manifest.json`

## How to Develop a third-party App

Documentation about how to develop and integrate your third-party app can be found [here](https://docs.safe.global/safe-core-aa-sdk/safe-apps).

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

- When the code is merged into `development`: https://safe-apps.dev.5afe.dev

  [Drain Account](https://safe-apps.dev.5afe.dev/drain-safe)
  | [Ramp Network](https://safe-apps.dev.5afe.dev/ramp-network)
  | [Transaction Builder](https://safe-apps.dev.5afe.dev/tx-builder)
  | [WalletConnect](https://safe-apps.dev.5afe.dev/wallet-connect)

- When the code is merged into `main`: https://safe-apps.staging.5afe.dev

  [Drain Account](https://safe-apps.staging.5afe.dev/drain-safe)
  | [Ramp Network](https://safe-apps.staging.5afe.dev/ramp-network)
  | [Transaction Builder](https://safe-apps.staging.5afe.dev/tx-builder)
  | [WalletConnect](https://safe-apps.staging.5afe.dev/wallet-connect)

- When the code is released: https://apps-portal.safe.global

  [Drain Account](https://apps-portal.safe.global/drain-safe)
  | [Ramp Network](https://apps-portal.safe.global/ramp-network)
  | [Transaction Builder](https://apps-portal.safe.global/tx-builder)
  | [WalletConnect](https://apps-portal.safe.global/wallet-connect)

## Run e2e tests

This repo provides e2e tests using Cypress. Ideally to be used on CI can also be handy to check locally that everything works as expected.
To run them it will be necessary to provide the following ENV parameters, that can be filled in a `.env` file at the root of the project

Example:

```
CYPRESS_WEB_BASE_URL=https://app.safe.global
CYPRESS_CHAIN_ID=1
CYPRESS_NETWORK_PREFIX=rin
CYPRESS_TESTING_SAFE_ADDRESS=0x0000000000000000000000000000000000000000
CYPRESS_CLIENT_GATEWAY_BASE_URL=https://safe-client.safe.global
```

Make sure to enter the desired values, for example a Safe address that you own

## Deprecated Apps

Latest code version from deprecated apps can be found in the following links:

- [Compound](https://github.com/safe-global/safe-react-apps/releases/tag/compound-1.1.3)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
