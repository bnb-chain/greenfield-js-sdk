import { ensureServiceIsRunning, initialize, instantiateWASM } from './init';
import { DEFAULT_DATA_BLOCKS, DEFAULT_PARITY_BLOCKS, DEFAULT_SEGMENT_SIZE } from '../constants';

// 1. modify method of `exports` and `globalThis` export.
export const startRunningService = async (wasmURL) => {
  const module = await instantiateWASM(wasmURL);
  module.instance.exports;

  // `exports` is a map to `//export` way of TinyGo way.
  // const { add } = exports;

  // `globalThis` is a map to complex way of `syscall/js` way.
  const { getCheckSums } = globalThis;

  return {
    getCheckSums,
  };
};

export const getCheckSums = async (
  bytes,
  segmentSize = DEFAULT_SEGMENT_SIZE,
  dataBlocks = DEFAULT_DATA_BLOCKS,
  parityBlocks = DEFAULT_PARITY_BLOCKS,
) => {
  await initialize();
  return ensureServiceIsRunning().getCheckSums(bytes, segmentSize, dataBlocks, parityBlocks);
};
