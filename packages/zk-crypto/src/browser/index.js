import { ensureServiceIsRunning, initialize, instantiateWASM } from './init';

// 1. modify method of `exports` and `globalThis` export.
export const startRunningService = async (wasmURL) => {
  const module = await instantiateWASM(wasmURL);
  module.instance.exports;

  // `exports` is a map to `//export` way of TinyGo way.
  // const { add } = exports;

  // `globalThis` is a map to complex way of `syscall/js` way.
  const { getEddsaCompressedPublicKey, eddsaSign } = globalThis;

  return {
    getEddsaCompressedPublicKey,
    eddsaSign,
  };
};

// 2. wasm export function:
export const eddsaSign = async (seed, message) => {
  await initialize();
  return ensureServiceIsRunning().eddsaSign(seed, message);
};

export const getEddsaCompressedPublicKey = async (seed) => {
  await initialize();
  return ensureServiceIsRunning().getEddsaCompressedPublicKey(seed);
};
