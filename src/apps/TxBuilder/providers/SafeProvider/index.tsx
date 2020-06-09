import React from "react";
import { Loader } from "@gnosis.pm/safe-react-components";

import SafeConnector, { Safe } from "./safeConnector";

export const SafeContext = React.createContext<Safe | undefined>(undefined);

interface Props {
  children: any;
}

export const SafeProvider = ({ children }: Props) => {
  const [safe] = React.useState(new SafeConnector());
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    safe.activate(() => {
      setConnected(safe.isConnected());
    });

    return () => safe.deactivate();
  }, [safe]);

  if (!connected) {
    return <Loader size="lg" />;
  }

  return (
    <div className="App">
      <SafeContext.Provider value={safe}>{children}</SafeContext.Provider>
    </div>
  );
};

export default SafeProvider;
