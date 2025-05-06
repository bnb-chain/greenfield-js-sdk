import { isMainThread, parentPort, workerData } from 'node:worker_threads';
import { ReedSolomon } from './index';

const main = () => {
  if (isMainThread) {
    return;
  }

  try {
    const { chunk, index } = workerData;
    if (!chunk || !(index >= 0)) {
      parentPort.postMessage({ index, encodeDataHash: [], segChecksum: [] });
      return;
    }

    const rs = new ReedSolomon();
    const encodeShard = rs.getEncodeShard(chunk, index);
    parentPort.postMessage(encodeShard);
  } catch (error) {
    parentPort.postMessage({ index, encodeDataHash: [], segChecksum: [], error: error.message });
  }
};

main();
