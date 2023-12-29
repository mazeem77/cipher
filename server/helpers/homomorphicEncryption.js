const SEAL = require('node-seal');

let initialized = false;
let seal, context, publicKey, secretKey, encryptor, decryptor, batchEncoder;

async function initializeSeal() {
  if (initialized) return;

  seal = await SEAL();
  const schemeType = seal.SchemeType.bfv;
  const securityLevel = seal.SecurityLevel.tc128;
  const polyModulusDegree = 4096;
  const bitSizes = [36, 36, 37];
  const bitSize = 20;

  const encParms = seal.EncryptionParameters(schemeType);
  encParms.setPolyModulusDegree(polyModulusDegree);
  encParms.setCoeffModulus(seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes)));
  encParms.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, bitSize));

  context = seal.Context(encParms, true, securityLevel);
  if (!context.parametersSet()) {
    throw new Error('Could not set the parameters in the given context.');
  }

  const keyGenerator = seal.KeyGenerator(context);
  publicKey = keyGenerator.createPublicKey();
  secretKey = keyGenerator.secretKey();
  encryptor = seal.Encryptor(context, publicKey);
  decryptor = seal.Decryptor(context, secretKey);
  batchEncoder = seal.BatchEncoder(context);

  initialized = true;
}

async function encode(array) {
  if (!initialized) {
    throw new Error('SEAL has not been initialized.');
  }

  const plainText = seal.PlainText();
  batchEncoder.encode(Int32Array.from(array), plainText);
  return plainText;
}

async function encrypt(plainText) {
  if (!initialized) {
    throw new Error('SEAL has not been initialized.');
  }

  const cipherText = seal.CipherText();
  encryptor.encrypt(plainText, cipherText);
  return cipherText;
}

async function decrypt(cipherText) {
  if (!initialized) {
    throw new Error('SEAL has not been initialized.');
  }

  const plainText = seal.PlainText();
  decryptor.decrypt(cipherText, plainText);

  const decodedArray = batchEncoder.decode(plainText);
  return Array.from(decodedArray);
}

async function add(cipherText1, cipherText2) {
  if (!initialized) {
    throw new Error('SEAL has not been initialized.');
  }

  const evaluator = seal.Evaluator(context);
  const cipherResult = seal.CipherText();

  evaluator.add(cipherText1, cipherText2, cipherResult);
  return cipherResult;
}


module.exports = {
  initializeSeal,
  encode,
  encrypt,
  decrypt,
  add
};
