import { Buffer } from 'buffer';
import { sha256 } from 'hash-wasm';
import { values } from 'lodash-es';
import { encodeBase64 } from '../../utils';

export function getChecksumApi() {
  const segmentSize = 16 * 1024 * 1024;
  const dataBlocks = 4;
  const parityBlocks = 2;
  const WORKER_POOL_SIZE = 6;

  const _createFileChunks = (file) => {
    if (!file.size) return [{ file }];
    const SIZE = segmentSize;
    const fileChunkList = [];
    let cur = 0;
    while (cur < file.size) {
      fileChunkList.push({ file: file.slice(cur, cur + SIZE) });
      cur += SIZE;
    }
    return fileChunkList;
  };

  const _generateIntegrityHash = async (list) => {
    const hex = await sha256(Buffer.from(list.join(''), 'hex'));
    return encodeBase64(Uint8Array.from(Buffer.from(hex, 'hex')));
  };

  const primaryWorkerScript = `
  importScripts('https://unpkg.com/hash-wasm@4.11.0/dist/sha256.umd.min.js')
  const encodePrimary = async (chunkId, buffer) => {
    const primary = await hashwasm.sha256(new Uint8Array(buffer));
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

  `;
  const _initPrimaryWorkers = ({ consumers }) => {
    const workers = new Array(WORKER_POOL_SIZE).fill(1).map(() => {
      // return new Worker(new URL('./calcPrimaryWorker', import.meta.url));
      return new Worker(
        URL.createObjectURL(new Blob([primaryWorkerScript], { type: 'text/javascript' })),
      );
    });
    workers.forEach((it) => {
      it.onmessage = (e) => {
        const { result, taskId } = e.data;
        const id = result[0];
        if (!consumers[id]) return;
        const { resolve, data, taskId: _taskId } = consumers[id];
        if (taskId !== _taskId) return;
        data[result[0]] = result[1];
        resolve();
      };
    });

    return workers;
  };

  const workerScript = `
  importScripts('https://unpkg.com/hash-wasm@4.11.0/dist/sha256.umd.min.js')
  importScripts('http://unpkg.com/@bnb-chain/greenfiled-file-handle/dist/browser/esm/wasm_exec-worker.js');
  function getDecodeBase64Length(data) {
    let bufferLength = Math.floor(data.length * 0.75);
    const len = data.length;

    if (data[len - 1] === '=') {
      bufferLength -= 1;
      if (data[len - 2] === '=') {
        bufferLength -= 1;
      }
    }

    return bufferLength;
  }
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const base64Lookup = new Uint8Array(256);
  for (let i = 0; i < base64Chars.length; i++) {
    base64Lookup[base64Chars.charCodeAt(i)] = i;
  }

  function decodeBase64(data) {
    const bufferLength = getDecodeBase64Length(data);
    const len = data.length;

    const bytes = new Uint8Array(bufferLength);

    let p = 0;
    for (let i = 0; i < len; i += 4) {
      const encoded1 = base64Lookup[data.charCodeAt(i)];
      const encoded2 = base64Lookup[data.charCodeAt(i + 1)];
      const encoded3 = base64Lookup[data.charCodeAt(i + 2)];
      const encoded4 = base64Lookup[data.charCodeAt(i + 3)];

      bytes[p] = (encoded1 << 2) | (encoded2 >> 4);
      p += 1;
      bytes[p] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
      p += 1;
      bytes[p] = ((encoded3 & 3) << 6) | (encoded4 & 63);
      p += 1;
    }

    return bytes;
  }
  const init = async () => {
    const go = new Go();
    const result = await WebAssembly.instantiateStreaming(
      fetch('https://unpkg.com/@bnb-chain/greenfiled-file-handle/dist/browser/esm/index.js'),
      go.importObject,
    );
    if (result) {
      go.run(result.instance);
      // Ensure hash-wasm initial success,
      // Otherwise, after the browser finishes loading the page,
      // the user immediately uploads a large object,
      // and hash-wasm has a certain probability of initialization failure due to memory problems in chrome.
      await hashwasm.sha256('');
    }
  };

  init();

  const encodeSegment = async (
    chunkId,
    buffer,
    dataBlocks,
    parityBlocks,
  ) => {
    const results = [];
    const bytes = new Uint8Array(buffer);

    if (typeof encodeRawSegment === 'undefined') {
      await init();
    }
    const result = encodeRawSegment(bytes, dataBlocks, parityBlocks);
    const shards = JSON.parse(result.result);

    // Empty chunks should also return digest arrays of the corresponding length.
    await Promise.all(
      shards.map(async (shard, idx) => {
        if (!results[idx]) {
          results[idx] = [];
        }
        const hex = await hashwasm.sha256(decodeBase64(shard || ''));
        results[idx].unshift(hex);
      }),
    );

    return [chunkId, results];
  };

  onmessage = async (e) => {
    const { chunkId, buffer, dataBlocks, parityBlocks, taskId } = e.data;

    const result = await encodeSegment(chunkId, buffer, dataBlocks, parityBlocks);

    postMessage({
      result,
      taskId,
    });
  };
  `;

  const _initSecondWorkers = ({ consumers }) => {
    const workers = new Array(WORKER_POOL_SIZE).fill(1).map(() => {
      // return new Worker(new URL('./calcSecondWorker', import.meta.url));
      return new Worker(URL.createObjectURL(new Blob([workerScript], { type: 'text/javascript' })));
    });
    workers.forEach((it) => {
      it.onmessage = (e) => {
        const { result, taskId } = e.data;
        const id = result[0];
        if (!consumers[id]) return;
        const { resolve, data, taskId: _taskId } = consumers[id];
        if (taskId !== _taskId) return;
        data[result[0]] = result[1];
        resolve();
      };
    });

    return workers;
  };

  // js vm instance memory will not release immediately. try reuse worker thread.
  let primaryWorkers = [];
  let secondWorkers = [];

  const primaryWorkerConsumers = {};
  primaryWorkers = _initPrimaryWorkers({
    consumers: primaryWorkerConsumers,
  });

  const secondWorkerConsumers = {};
  secondWorkers = _initSecondWorkers({
    consumers: secondWorkerConsumers,
  });

  const generateCheckSumV2 = async (file) => {
    if (!file) return {};

    const taskId = Date.now();
    let checkSumRes;

    values(primaryWorkerConsumers).forEach((r) => r.resolve());
    values(secondWorkerConsumers).forEach((r) => r.resolve());

    try {
      const fileChunks = _createFileChunks(file);
      const secondResults = [];
      const primaryResults = [];

      const segments = fileChunks.map(async (fileItem, chunkId) => {
        const buffer = await fileItem.file.arrayBuffer();

        const primaryPromise = new Promise((resolve) => {
          primaryWorkerConsumers[chunkId] = {
            resolve,
            data: primaryResults,
            taskId,
          };

          const workerIdx = chunkId % WORKER_POOL_SIZE;
          primaryWorkers[workerIdx].postMessage({ chunkId, buffer, taskId });
        });

        // shards
        const shardsPromise = new Promise((resolve) => {
          secondWorkerConsumers[chunkId] = {
            resolve,
            data: secondResults,
            taskId,
          };

          const workerIdx = chunkId % WORKER_POOL_SIZE;
          secondWorkers[workerIdx].postMessage({
            chunkId,
            buffer,
            dataBlocks,
            parityBlocks,
            taskId,
          });
        });

        return Promise.all([shardsPromise, primaryPromise]);
      });

      await Promise.all(segments);

      const combinedShards = [];
      secondResults.forEach((items, idx) => {
        items.forEach((child, childIdx) => {
          if (!combinedShards[childIdx]) {
            combinedShards[childIdx] = [];
          } else if (!combinedShards[childIdx][idx]) {
            combinedShards[childIdx][idx] = [];
          }
          combinedShards[childIdx][idx] = child[0];
        });
      });

      const primaryCheckSum = await _generateIntegrityHash(primaryResults);
      const secondsCheckSum = await Promise.all(
        combinedShards.map((it) => _generateIntegrityHash(it)),
      );
      const value = [primaryCheckSum].concat(secondsCheckSum);
      checkSumRes = {
        fileChunks: fileChunks.length,
        contentLength: file.size,
        expectCheckSums: value,
      };
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('check sum error', e);
    }

    return checkSumRes;
  };

  return {
    generateCheckSumV2,
  };
}
