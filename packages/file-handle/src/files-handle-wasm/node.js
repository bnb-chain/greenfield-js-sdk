import { resolve } from 'path';
import { spawnSync } from 'child_process';

const wasmExec = (func, funcArgs) => {
  const wasmExecNodePath = resolve(__dirname, './wasm_exec_node.js');
  const wasmFilePath = resolve(__dirname, './main.wasm');

  const proc = spawnSync('node', [wasmExecNodePath, wasmFilePath, func, ...funcArgs]);

  return proc.stdout.toString();
};

export const getCheckSums = (bytes, segmentSize, dataBlocks, parityBlocks) => {
  // console.log(bytes, segmentSize, dataBlocks, parityBlocks);
  return wasmExec('getCheckSums', [bytes, segmentSize, dataBlocks, parityBlocks]);
};
