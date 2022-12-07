import { Goerli } from "@usedapp/core";

export const WEB3_PROVIDER_URL =
  "https://goerli.infura.io/v3/a11313ddcf61443898b6a47e952d255c";

declare global {
  interface Window {
    ethereum: any;
  }
}
