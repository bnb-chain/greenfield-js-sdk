import { ensureServiceIsRunning, initialize, instantiateWASM } from './init';

export const eddsaSign = (seed, message) => {
  return ensureServiceIsRunning().eddsaSign(seed, message);
};

export const getEddsaCompressedPublicKey = (seed) => {
  return ensureServiceIsRunning().getEddsaCompressedPublicKey(seed);
};

export const startRunningService = async (input) => {
  if (input === undefined) {
    input = new URL('../wasm/zk-crypto.wasm', import.meta.url);
  }

  await instantiateWASM(input);
  // const module = await instantiateWASM(input);
  // const exports = module.instance.exports;

  const { getEddsaCompressedPublicKey, eddsaSign } = globalThis;

  return {
    getEddsaCompressedPublicKey,
    eddsaSign,
  };
};

export const init = initialize;
