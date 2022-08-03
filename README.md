# Celo Safe Apps

This fork of Celo safe apps contains apps for use with celo safe.

To start only wallet-connect app is set up.

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
yarn start:walletconnect
```

```

## Project structure

In `./apps` you can find one folder per each integration app (only walletconnect has been set up)

## Run e2e tests

This repo provides e2e tests using cypress. Ideally to be used on CI can also be handy to check locally that everything works as expected.
To run them it will be necessary to provide the following ENV parameters, that can be filled in a `.env` file at the root of the project

Example:
```
CYPRESS_BASE_URL=https://gnosis-safe.io/app
CYPRESS_NETWORK_PREFIX=rin
CYPRESS_TESTING_SAFE_ADDRESS=0x0000000000000000000000000000000000000000
CYPRESS_CONFIG_SERVICE_BASE_URL=https://safe-client.gnosis.io
```
Make sure to enter the desired values, for example a Safe address that you own

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
