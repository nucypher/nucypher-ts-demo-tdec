import type {
  DeployedCbdStrategy,
  conditions,
  Ciphertext,
} from "@nucypher/nucypher-ts";
import React, { useState } from "react";
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";

import { ConditionBuilder } from "./ConditionBuilder";
import { Encrypt } from "./Encrypt";
import { Decrypt } from "./Decrypt";
import { Spinner } from "./Spinner";
import { StrategyBuilder } from "./StrategyBuilder";
import { FerveoVariant } from "@nucypher/nucypher-ts";

export type EncryptedMessage = { ciphertext: Ciphertext; aad: Uint8Array };
export default function App() {
  const { activateBrowserWallet, deactivate, account } = useEthers();

  const [loading, setLoading] = useState(false);
  const [deployedStrategy, setDeployedStrategy] =
    useState<DeployedCbdStrategy>();
  const [conditionSet, setConditionSet] = useState<conditions.ConditionSet>();
  const [encryptedMessage, setEncryptedMessage] = useState<EncryptedMessage>();
  const [decryptedMessage, setDecryptedMessage] = useState<string>();
  const [decryptionErrors, setDecryptionErrors] = useState<string[]>([]);

  const encryptMessage = (plaintext: string) => {
    if (!deployedStrategy || !conditionSet) {
      return;
    }
    setLoading(true);
    const encryptedMessage = deployedStrategy
      .makeEncrypter(conditionSet)
      .encryptMessageCbd(plaintext);
    setEncryptedMessage(encryptedMessage);
    setLoading(false);
  };

  const decryptMessage = async (encryptedMessage: EncryptedMessage) => {
    if (!deployedStrategy || !conditionSet) {
      return;
    }
    setLoading(true);
    setDecryptedMessage("");
    setDecryptionErrors([]);

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const decryptedMessage =
      await deployedStrategy.decrypter.retrieveAndDecrypt(
        web3Provider,
        conditionSet,
        FerveoVariant.Precomputed,
        encryptedMessage.ciphertext,
        encryptedMessage.aad
      );

    setDecryptedMessage(new TextDecoder().decode(decryptedMessage));
    setLoading(false);
  };

  if (!account) {
    return (
      <div>
        <h2>Web3 Provider</h2>
        <button onClick={() => activateBrowserWallet()}>Connect Wallet</button>
      </div>
    );
  }

  if (loading) {
    return <Spinner loading={loading} />;
  }

  return (
    <div>
      <div>
        <h2>Web3 Provider</h2>
        <button onClick={deactivate}> Disconnect Wallet</button>
        {account && <p>Account: {account}</p>}
        <p>
          Access{" "}
          <a href={"https://goerli-nfts.vercel.app/"} target="_blank">
            the NFT Faucet
          </a>{" "}
          if needed
        </p>
      </div>

      <StrategyBuilder
        setLoading={setLoading}
        setDeployedStrategy={setDeployedStrategy}
      />

      <ConditionBuilder
        enabled={!!deployedStrategy}
        conditionSet={conditionSet}
        setConditions={setConditionSet}
      />

      <Encrypt
        enabled={!!conditionSet}
        encrypt={encryptMessage}
        encryptedMessage={encryptedMessage!}
      />

      <Decrypt
        enabled={!!encryptedMessage}
        decrypt={decryptMessage}
        decryptedMessage={decryptedMessage ?? ""}
        decryptionErrors={decryptionErrors}
      />
    </div>
  );
}
