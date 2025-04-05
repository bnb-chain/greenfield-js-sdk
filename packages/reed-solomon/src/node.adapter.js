import { isMainThread, parentPort, Worker, workerData } from 'node:worker_threads';
import { ReedSolomon } from './index';
import { splitPrice } from './utils';

// Define the class outside of any conditional blocks
export class NodeAdapterReedSolomon extends ReedSolomon {
  async encodeInWorker(p, sourceData) {
    return new Promise((resolve, reject) => {
      if (isMainThread) {
        // RES is `encodeShards` Array
        const RES = [];
        const chunkList = splitPrice(sourceData, this.segmentSize);
        const threads = new Set();

        // If there's no data to process, return empty checksums
        if (!chunkList.length) {
          resolve([]);
          return;
        }

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
            reject(err);
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
            if (message.error) {
              reject(new Error(message.error));
              return;
            }
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

// Worker thread handling code as a separate block
if (!isMainThread) {
  try {
    const { chunk, index } = workerData;
    if (chunk) {
      // Create a new Reed-Solomon instance in the worker thread
      const rs = new ReedSolomon();
      const encodeShard = rs.getEncodeShard(chunk, index);
      parentPort.postMessage(encodeShard);
    } else {
      // If no chunk data, send empty result with index to avoid errors
      parentPort.postMessage({ index, encodeDataHash: [] });
    }
  } catch (error) {
    // Send error message back to main thread
    parentPort.postMessage({ error: error.message, index: workerData?.index });
  }
} 