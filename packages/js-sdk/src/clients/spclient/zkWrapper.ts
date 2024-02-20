import { init, getEddsaCompressedPublicKey, eddsaSign } from '@bnb-chain/greenfield-zk-crypto';

export const zkEddsaSign = async (seedString: string, message: string) => {
  await init((globalThis as any).__PUBLIC_ZKCRYPTO_WASM_PATH__);
  return await eddsaSign(seedString, message);
};

export const zkGetEddsaCompressedPublicKey = async (seedString: string) => {
  await init((globalThis as any).__PUBLIC_ZKCRYPTO_WASM_PATH__);
  return await getEddsaCompressedPublicKey(seedString);
};
