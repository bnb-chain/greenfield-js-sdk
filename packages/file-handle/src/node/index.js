import path from 'path';
import * as wasm from '../wasm/file-handle.wasm';
import { getService, instantiateWASM } from './init';
import { DEFAULT_DATA_BLOCKS, DEFAULT_PARITY_BLOCKS, DEFAULT_SEGMENT_SIZE } from '../constants';

// 1. modify method of `exports` and `globalThis` export.
export const startRunningService = async () => {
  // `wasm.default` is `cross-wasm.wasm`
  const wasmPath = path.resolve(__dirname, wasm.default);
  await instantiateWASM(wasmPath);
  // const exports = module.instance.exports;

  // `exports` is a map to `//export` way of TinyGo way.
  // const { add } = exports;

  // `globalThis` is a map to complex way of `syscall/js` way.
  const { getCheckSums } = globalThis;

  return {
    getCheckSums,
  };
};

// 2. wasm export function:
export const getCheckSums = async (
  bytes,
  segmentSize = DEFAULT_SEGMENT_SIZE,
  dataBlocks = DEFAULT_DATA_BLOCKS,
  parityBlocks = DEFAULT_PARITY_BLOCKS,
) => {
  const service = await getService();
  return service.getCheckSums(bytes, segmentSize, dataBlocks, parityBlocks);
};
