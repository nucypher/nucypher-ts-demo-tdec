import React from "react";
import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import {DAppProvider, Config, Mumbai} from "@usedapp/core";

import App from "./App";

const config: Config = {
  networks: [Mumbai],
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
