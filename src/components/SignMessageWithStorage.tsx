import { useCallback, useEffect, useMemo, useState } from "react";
import type { Hex } from "viem";
import { useAccount, usePublicClient, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";

export function SignMessageWithStorage() {
  const account = useAccount();
  const client = usePublicClient();
  const [signature, setSignature] = useState<Hex | undefined>(undefined);
  const [storedSignatures, setStoredSignatures] = useState<Array<{ signature: Hex; address: string }>>([]);
  
  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: (sig) => setSignature(sig),
    },
  });

  const message = useMemo(() => {
    return new SiweMessage({
      domain: document.location.host,
      address: account.address,
      chainId: account.chainId,
      uri: document.location.origin,
      version: "1",
      statement: "Smart Wallet SIWE Example",
      nonce: "12345678",
    });
  }, [account.address, account.chainId]);

  const [valid, setValid] = useState<boolean | undefined>(undefined);

  const checkValid = useCallback(async () => {
    if (!signature || !account.address || !client) return;

    const isValid = await client.verifyMessage({
      address: account.address,
      message: message.prepareMessage(),
      signature,
    });
    setValid(isValid);

    if (isValid) {
      // Store signature if valid
      await fetch("/api/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature,
          address: account.address,
        }),
      });
      
      // Refresh stored signatures
      fetchStoredSignatures();
    }
  }, [signature, account.address, client, message]);

  const fetchStoredSignatures = async () => {
    const response = await fetch("/api/store");
    const data = await response.json();
    setStoredSignatures(data.signatures);
  };

  useEffect(() => {
    checkValid();
  }, [signature, checkValid]);

  useEffect(() => {
    fetchStoredSignatures();
  }, []);

  return (
    <div>
      <h2>Sign Message With Storage</h2>
      <button
        onClick={() => signMessage({ message: message.prepareMessage() })}
      >
        Sign
      </button>
      
      {signature && <p>Current Signature: {signature}</p>}
      {valid !== undefined && <p>Is valid: {valid.toString()}</p>}
      
      <div>
        <h3>Stored Signatures</h3>
        {storedSignatures.map((stored, index) => (
          <div key={index}>
            <p>Address: {stored.address}</p>
            <p>Signature: {stored.signature}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
} 