import { Buffer } from 'buffer';
import * as Comlink from 'comlink';
import { sha256 } from 'hash-wasm';
import { values } from 'lodash-es';
import { encodeBase64 } from '../../utils';
import { DEFAULT_DATA_BLOCKS, DEFAULT_PARITY_BLOCKS, DEFAULT_SEGMENT_SIZE } from '../../constants';

const WORKER_POOL_SIZE = 6;
const _createFileChunks = (file) => {
  if (!file.size) return [{ file }];
  const SIZE = DEFAULT_SEGMENT_SIZE;
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

const _initPrimaryWorkers = ({ consumers }) => {
  const workers = new Array(WORKER_POOL_SIZE).fill(1).map(() => {
    return new Worker(
      /* webpackChunkName: "workers/calcPrimaryWorker-worker" */ new URL(
        './calcPrimaryWorker.js',
        import.meta.url,
      ),
      {
        type: 'module',
      },
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
const _initSecondWorkers = ({ consumers }) => {
  const workers = new Array(WORKER_POOL_SIZE).fill(1).map(() => {
    return new Worker(
      /* webpackChunkName: "workers/calcSecondWorker-worker" */ new URL(
        './calcSecondWorker.js',
        import.meta.url,
      ),
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

export const generateCheckSumV2 = async (file) => {
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
          DEFAULT_DATA_BLOCKS,
          DEFAULT_PARITY_BLOCKS,
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

Comlink.expose({
  generateCheckSumV2,
});
