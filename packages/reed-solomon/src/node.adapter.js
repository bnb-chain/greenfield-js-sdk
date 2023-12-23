import { isMainThread, parentPort, Worker, workerData } from 'node:worker_threads';
import { ReedSolomon } from './index';
import { splitPrice } from './utils';

export class NodeAdapterReedSolomon extends ReedSolomon {
  async encodeInWorker(p, sourceData) {
    return new Promise((resolve, reject) => {
      if (isMainThread) {
        // RES is `encodeShards` Array
        const RES = [];
        const chunkList = splitPrice(sourceData, this.segmentSize);
        const threads = new Set();

        for (let i = 0; i < chunkList.length; i++) {
          const worker = new Worker(p, {
            workerData: {
              index: i,
              chunk: chunkList[i],
            },
          });
          threads.add(worker);
        }

        for (const w of threads) {
          w.on('error', (err) => {
            throw err;
          });
          w.on('exit', () => {
            threads.delete(w);
            // console.log(`Thread exiting, ${threads.size} running...`)
            if (threads.size === 0) {
              const sortedRes = this.sortByIndex(RES);
              resolve(this.getChecksumsByEncodeShards(sortedRes));
            }
          });

          w.on('message', (message) => {
            // console.log('message', message.encodeData.index)
            RES[message.index] = message;
          });
        }
      } else {
        const { chunk, index } = workerData;

        const encodeShard = this.getEncodeShard(chunk, index);
        parentPort.postMessage(encodeShard);
      }
    });
  }
}
