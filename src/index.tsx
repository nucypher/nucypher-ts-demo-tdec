import React from "react";
import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import { DAppProvider, Config, Goerli } from "@usedapp/core";

import App from "./App";
import { WEB3_PROVIDER_URL } from "./web3";

const config: Config = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: WEB3_PROVIDER_URL
  },
  networks: [Goerli]
};
const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOMClient.createRoot(rootElement).render(
    <StrictMode>
      <DAppProvider config={config}>
        <App />
      </DAppProvider>
    </StrictMode>
  );
}
