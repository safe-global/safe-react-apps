import initSdk, { SafeInfo, SdkInstance } from "@gnosis.pm/safe-apps-sdk";

export default class SafeConnector {
  sdk: SdkInstance;

  info: SafeInfo | undefined;

  constructor() {
    this.sdk = initSdk();
  }

  activate(onUpdate: (update: any) => void) {
    const onSafeInfo = (info: SafeInfo) => {
      this.info = info;
      console.log({ info });
      onUpdate({});
    };

    this.sdk.addListeners({ onSafeInfo });
  }

  deactivate() {
    this.sdk.removeListeners();
  }

  isConnected(): boolean {
    return this.info !== undefined;
  }

  sendTransactions(txs: any[]) {
    this.sdk.sendTransactions(txs);
  }

  getSafeInfo(): SafeInfo {
    const info = this.info;
    if (info === undefined) throw Error("Not connected to a Safe");
    return info;
  }
}

export type Safe = InstanceType<typeof SafeConnector>;
