import { Ciphertext } from "@nucypher/nucypher-ts";
import React, { useState } from "react";
import type { EncryptedMessage } from "./App";

interface Props {
  enabled: boolean;
  decrypt: (encryptedMessage: EncryptedMessage) => void;
  decryptedMessage: string;
  decryptionErrors: string[];
}

export const Decrypt = ({
  decrypt,
  decryptedMessage,
  decryptionErrors,
  enabled,
}: Props) => {
  const [ciphertext, setCiphertext] = useState("");

  if (!enabled) {
    return <></>;
  }

  const onDecrypt = () => {
    const encryptedMessage = {
      ciphertext: Ciphertext.fromBytes(Buffer.from(ciphertext, "base64")),
    };
    decrypt(encryptedMessage);
  };

  const DecryptedMessage = () => {
    if (!decryptedMessage) {
      return <></>;
    }
    return (
      <>
        <h3>Decrypted Message:</h3>
        <p>{decryptedMessage}</p>
      </>
    );
  };

  const DecryptionErrors = () => {
    if (decryptionErrors.length === 0) {
      return null;
    }

    return (
      <div>
        <h2>Decryption Errors</h2>
        <p>Not enough decryption shares to decrypt the message.</p>
        <p>Some Ursulas have failed with errors:</p>
        <ul>
          {decryptionErrors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h2>Step 3 - Decrypt Encrypted Message</h2>
      <input
        value={ciphertext}
        placeholder="Enter ciphertext"
        onChange={(e) => setCiphertext(e.currentTarget.value)}
      />
      <button onClick={onDecrypt}>Decrypt</button>
      {DecryptedMessage()}
      {DecryptionErrors()}
    </div>
  );
};
