import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import type { EncryptedMessage } from "./App";

interface Props {
  enabled: boolean;
  encryptedMessage?: EncryptedMessage;
  encrypt: (value: string) => void;
}

export const Encrypt = ({ encrypt, encryptedMessage, enabled }: Props) => {
  if (!enabled) {
    return <></>;
  }

  const [plaintext, setPlaintext] = useState("plaintext");

  const onClick = () => encrypt(plaintext);

  const EncryptedMessageContent = () => {
    if (!encryptedMessage) {
      return <></>;
    }

    const encodedCiphertext = Buffer.from(
      encryptedMessage.ciphertext.toBytes()
    ).toString("base64");
    const encodedAad = Buffer.from(encryptedMessage.aad).toString("base64");

    return (
      <>
        <div>
          <h3>Encrypted ciphertext:</h3>
          <pre className="ciphertext">{encodedCiphertext}</pre>
          <CopyToClipboard text={encodedCiphertext}>
            <button>Copy to clipboard</button>
          </CopyToClipboard>
        </div>
        <div>
          <h3>Encrypted AAD:</h3>
          <pre className="aad">{encodedAad}</pre>
          <CopyToClipboard text={encodedAad}>
            <button>Copy to clipboard</button>
          </CopyToClipboard>
        </div>
      </>
    );
  };

  return (
    <div>
      <h2>Step 2 - Set conditions and Encrypt a message</h2>
      <input
        type="string"
        value={plaintext}
        onChange={(e) => setPlaintext(e.currentTarget.value)}
      />
      <button onClick={onClick}>Encrypt</button>
      {EncryptedMessageContent()}
    </div>
  );
};
