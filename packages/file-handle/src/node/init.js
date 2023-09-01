import fs from 'node:fs';
import { startRunningService } from '.';
import Go from './wasm_exec';
let longLivedService;

export const getService = () => {
  if (!longLivedService) {
    longLivedService = startRunningService().catch((err) => {
      // Let the caller try again if this fails.
      longLivedService = void 0;
      // But still, throw the error back up the caller.
      throw err;
    });
  }
  return longLivedService;
};

export const instantiateWASM = async (wasmPath) => {
  let response = undefined;

  const fetchAndInstantiateTask = async () => {
    const buf = fs.readFileSync(wasmPath);
    const go = new Go();
    const module = await WebAssembly.instantiate(new Uint8Array(buf), go.importObject);

    go.run(module.instance);
    return module;
  };
  response = await fetchAndInstantiateTask();

  return response;
};
