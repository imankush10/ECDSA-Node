const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const privateKey = secp256k1.utils.randomPrivateKey();
console.log("Private key: ", toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey);
console.log("Public key: ", toHex(publicKey));
