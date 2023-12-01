import { sha256 } from 'hash-wasm';
import { decodeBase64 } from '../../utils';
import Go from '../wasm_exec.js';

const init = async () => {
  const go = new Go();
  const input = window.__PUBLIC_FILE_HANDLE_WASM_PATH__;
  const result = await WebAssembly.instantiateStreaming(fetch(input), go.importObject);
  if (result) {
    go.run(result.instance);
    // Ensure hash-wasm initial success,
    // Otherwise, after the browser finishes loading the page,
    // the user immediately uploads a large object,
    // and hash-wasm has a certain probability of initialization failure due to memory problems in chrome.
    await sha256('');
  }
};

init();

const encodeRawSegment = async (chunkId, buffer, dataBlocks, parityBlocks) => {
  const results = [];
  const bytes = new Uint8Array(buffer);

  if (typeof greenfieldSdk === 'undefined') {
    await init();
  }
  const result = greenfieldSdk.encodeRawSegment(bytes, dataBlocks, parityBlocks);
  const shards = JSON.parse(result.result);

  // Empty chunks should also return digest arrays of the corresponding length.
  await Promise.all(
    shards.map(async (shard, idx) => {
      if (!results[idx]) {
        results[idx] = [];
      }
      const hex = await sha256(decodeBase64(shard || ''));
      results[idx].unshift(hex);
    }),
  );

  return [chunkId, results];
};

onmessage = async (e) => {
  const { chunkId, buffer, dataBlocks, parityBlocks, taskId } = e.data;

  const result = await encodeRawSegment(chunkId, buffer, dataBlocks, parityBlocks);

  postMessage({
    result,
    taskId,
  });
};
