import type {
  conditions,
  Ciphertext,
  DeployedCbdStrategy,
} from "@nucypher/nucypher-ts";
import { CbdStrategy, Cohort, FerveoVariant } from "@nucypher/nucypher-ts";
import React, { useEffect, useState } from "react";
import { Mumbai, useEthers } from "@usedapp/core";
import { ethers } from "ethers";

import { ConditionBuilder } from "./ConditionBuilder";
import { Encrypt } from "./Encrypt";
import { Decrypt } from "./Decrypt";
import { Spinner } from "./Spinner";

export type EncryptedMessage = { ciphertext: Ciphertext; };
export default function App() {
  const { activateBrowserWallet, deactivate, account, switchNetwork } =
    useEthers();

  const [loading, setLoading] = useState(false);
  const [deployedStrategy, setDeployedStrategy] =
    useState<DeployedCbdStrategy>();
  const [conditionExpr, setConditionExpr] =
    useState<conditions.ConditionExpression>();
  const [encryptedMessage, setEncryptedMessage] = useState<EncryptedMessage>();
  const [decryptedMessage, setDecryptedMessage] = useState<string>();
  const [decryptionErrors, setDecryptionErrors] = useState<string[]>([]);

  useEffect(() => {
    const makeCohort = async () => {
      // TODO: This works, release a new alpha version of nucypher-ts
      const cohortConfig = {
        threshold: 2,
        shares: 2,
        porterUri: "https://porter-lynx.nucypher.community",
      };
      const cohort = await Cohort.create(cohortConfig);
      console.log("Created cohort: ", cohort);
      return cohort;
    };

    const deployStrategy = async () => {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const cohort = await makeCohort();
      const strategy = CbdStrategy.create(cohort);
      console.log("Created strategy: ", strategy);
      const deployedStrategy = await strategy.deploy(web3Provider);
      setDeployedStrategy(deployedStrategy);
      console.log("Deployed Strategy: ", deployedStrategy);
    };

    setLoading(true);
    deployStrategy().then(() => setLoading(false));
  }, []);

  const encryptMessage = (plaintext: string) => {
    if (!deployedStrategy || !conditionExpr) {
      return;
    }
    setLoading(true);
    const encryptedMessage = deployedStrategy
      .makeEncrypter(conditionExpr)
      .encryptMessageCbd(plaintext);
    setEncryptedMessage(encryptedMessage);
    setLoading(false);
  };

  const decryptMessage = async (encryptedMessage: EncryptedMessage) => {
    if (!deployedStrategy || !conditionExpr) {
      return;
    }
    setLoading(true);
    setDecryptedMessage("");
    setDecryptionErrors([]);

    await switchNetwork(Mumbai.chainId);

    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    const decryptedMessage =
      await deployedStrategy.decrypter.retrieveAndDecrypt(
        web3Provider,
        conditionExpr,
        FerveoVariant.Simple,
        encryptedMessage.ciphertext,
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
      </div>

      <ConditionBuilder
        enabled={!!deployedStrategy}
        conditionExpr={conditionExpr}
        setConditions={setConditionExpr}
      />

      <Encrypt
        enabled={!!conditionExpr}
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
