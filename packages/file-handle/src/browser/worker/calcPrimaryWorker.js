import { sha256 } from 'hash-wasm';

const encodePrimary = async (chunkId, buffer) => {
  const primary = await sha256(new Uint8Array(buffer));
  return [chunkId, primary];
};

onmessage = async (e) => {
  const { chunkId, buffer, taskId } = e.data;
  const result = await encodePrimary(chunkId, buffer);
  postMessage({
    result,
    taskId,
  });
};
