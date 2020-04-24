# Gnosis Safe Apps 

[![Logo](https://raw.githubusercontent.com/gnosis/safe-react-apps/master/assets/logo.png)](https://gnosis.pm/)

[![Build Status](https://travis-ci.org/gnosis/safe-react-apps.svg?branch=master)](https://travis-ci.org/gnosis/pm-contracts)

This project contains the apps developed by gnosis to be consumed by Safe Multisig.


## Install

### Install dependencies

```bash
yarn install
```

## Build

```bash
yarn build
```

## Project structure
In `./src/apps` you can find one folder per each integration app Gnosis develops.

Also, as each app must expose a `manifest.json` in order to be accepted by Safe Multisig, in `./public` folder you can find a folder per each app. Besides the `manifest.json` file we also include the Icon for each app.

This will allow Safe Multisig to consume these resources like so: `https://apps.gnosis.io/compound/manifest.json`

## How to Develop a third-party App

Documentation in how to develop and integrate your third-party app can be found [here](https://docs.gnosis.io/safe/docs/sdks_safe_apps/).

## For developers

Modify this file `safe-apps/node_modules/react-scripts/config/webpackDevServer.config.js` by adding these lines:

```
headers: {
    "Access-Control-Allow-Origin": "\*",
    "Access-Control-Allow-Methods": "GET",
    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
},
```


## License

This library is released under MIT.

## Contributors

- Nicolás Domínguez ([nicosampler](https://github.com/nicosampler))