const express = require("express");
const app = express();
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { hexToBytes } = require("ethereum-cryptography/utils");

const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0398e463d39aa6979ff5028404b8477cb5298c63afcf223609ee626caf9ed1a9f9": 100,
  "036f6a9eebd47c9288e57c63b4e84e9ec2ef2c4607ab0d1af167cf6a625ce2408e": 50,
  "03d3f1ec7a6991c8a932c5c8ff6565246c3651004dbe483ea3bcde24823a22e36b": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature, msgHash } = req.body;
  signature.r = BigInt(signature.r);
  signature.s = BigInt(signature.s);
  if (!secp256k1.verify(signature, msgHash, sender))
    return res.status(400).send({ message: "Invalid transaction" });

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
