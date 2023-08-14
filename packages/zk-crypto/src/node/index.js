import path from 'path';
import * as wasm from '../wasm/zk-crypto.wasm';
import { getService, instantiateWASM } from './init';

// 1. modify method of `exports` and `globalThis` export.
export const startRunningService = async () => {
  // `wasm.default` is `cross-wasm.wasm`
  const wasmPath = path.resolve(__dirname, wasm.default);
  await instantiateWASM(wasmPath);
  // const exports = module.instance.exports;

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
  const service = await getService();
  return service.eddsaSign(seed, message);
};

export const getEddsaCompressedPublicKey = async (seed) => {
  const service = await getService();
  return service.getEddsaCompressedPublicKey(seed);
};
