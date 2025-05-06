import { isMainThread, parentPort, workerData } from 'node:worker_threads';
import { ReedSolomon } from './index';

class NodeAdapterReedSolomonWorker extends ReedSolomon {
  execute() {
    if (!isMainThread) {
      const { chunk, index } = workerData;
      const encodeShard = this.getEncodeShard(chunk, index);
      parentPort.postMessage(encodeShard);
    }
  }
}

const worker = new NodeAdapterReedSolomonWorker();
worker.execute();
