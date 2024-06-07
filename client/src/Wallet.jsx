import { useEffect } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({
  balance,
  setBalance,
  privateKey,
  address,
  setAddress,
  setPrivateKey,
}) {
  async function fetchData(address) {
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  useEffect(() => {
    if (privateKey) {
      try {
        const publicKey = toHex(secp256k1.getPublicKey(privateKey));
        setAddress(publicKey);
        fetchData(publicKey);
      } catch (e) {
        if (e.message.includes("private key must be 32 bytes")) {
          console.log("Invalid private key length. Ignoring error.");
        } else {
          console.log(e);
        }
      }
    }
  }, [privateKey]);

  function onChange(evt) {
    const newPrivateKey = evt.target.value;
    setPrivateKey(newPrivateKey);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private key
        <input
          placeholder="Enter Private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>
      <div
        style={{
          width: "200px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        Address: {address}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
