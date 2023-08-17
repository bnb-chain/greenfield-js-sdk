import wasm from './main.wasm';
import './wasm_exec';

if (!WebAssembly.instantiateStreaming) {
  // polyfill
  WebAssembly.instantiateStreaming = async (resp, importObject) => {
    const source = await (await resp).arrayBuffer();
    return await WebAssembly.instantiate(source, importObject);
  };
}

const go = new Go();

export const GreenfieldWasmSdk = async () => {
  const { module, instance } = await wasm({ ...go.importObject });
  go.run(instance);

  const methods = ['getCheckSums'];

  let G = {};

  methods.map((method) => {
    G[method] = window[method];
  });

  WebAssembly.instantiate(module, go.importObject);

  return G;
};

// export default GreenfieldWasmSdk;
