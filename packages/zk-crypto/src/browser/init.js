import { startRunningService } from '.';
import Go from './wasm_exec.js';

export const initialize = async () => {
  if (!initializePromise) {
    const input = window.__PUBLIC_ZKCRYPTO_WASM_PATH__;
    initializePromise = startRunningService(input).catch((err) => {
      // Let the caller try again if this fails.
      initializePromise = void 0;
      // But still, throw the error back up the caller.
      throw err;
    });
  }
  longLivedService = longLivedService || (await initializePromise);
};

export const instantiateWASM = async (wasmURL) => {
  let module = undefined;
  const go = new Go();

  if (!WebAssembly.instantiateStreaming) {
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
      const source = await (await resp).arrayBuffer();
      return await WebAssembly.instantiate(source, importObject);
    };
  }

  const fetchAndInstantiateTask = async () => {
    return WebAssembly.instantiateStreaming(fetch(wasmURL), go.importObject);
  };
  module = await fetchAndInstantiateTask();
  go.run(module.instance);

  return module;
};

let initializePromise;
let longLivedService;

export const ensureServiceIsRunning = () => {
  if (!initializePromise) throw new Error('You need to call "initialize" before calling this');
  if (!longLivedService)
    throw new Error(
      'You need to wait for the promise returned from "initialize" to be resolved before calling this',
    );
  return longLivedService;
};
