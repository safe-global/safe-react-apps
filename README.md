# Gnosis Safe Apps 

[![Logo](https://raw.githubusercontent.com/gnosis/safe-react-apps/master/assets/logo.png)](https://gnosis.pm/)

[![Build Status](https://travis-ci.com/gnosis/safe-react-apps.svg?branch=master)](https://travis-ci.com/gnosis/safe-react-apps)

This project contains the apps developed by Gnosis to be consumed by Safe Multisig.


## Install

### Install dependencies

```bash
yarn install
```

## Configure

Configure your `.env` file starting from `.env.example` one. Fill the provided example values with the necessary information. Don't forget to add your infura API key

## Build

We use yarn workspaces to handle different apps inside this project. To build each app you can use one of the following commands:

```bash
yarn build-compound
yarn build-tx-builder
yarn build-wallet-connect
```

### Run locally
You can also run this apps locally using the following commands:

```bash
yarn start-compound
yarn start-tx-builder
yarn start-wallet-connect
```


## Project structure

In `./apps` you can find one folder per each integration app Gnosis develops.

Also, each app must expose a `manifest.json` in order to be accepted by Safe Multisig, you can find it in their `./public` folder. Besides the `manifest.json` file we also include the app Icon.

This will allow Safe Multisig to consume these resources like so: `https://apps.gnosis.io/compound/manifest.json`

## How to Develop a third-party App

Documentation about how to develop and integrate your third-party app can be found [here](https://docs.gnosis.io/safe/docs/sdks_safe_apps/).

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
These apps are deployed in the following environments
* When the code is merged into development: https://safe-apps.dev.gnosisdev.com
* When the code is merged into master: https://safe-apps.staging.gnosisdev.com
* When the code is released: https://apps.gnosis-safe.io

## License

This library is released under MIT.

## Contributors

- Nicolás Domínguez ([nicosampler](https://github.com/nicosampler))