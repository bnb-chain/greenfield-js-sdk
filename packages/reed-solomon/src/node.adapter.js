import { sha256 } from 'ethereum-cryptography/sha256.js';
import { isMainThread, parentPort, Worker, workerData } from 'node:worker_threads';
import { ReedSolomon } from './index';
import { getIntegrityUint8Array, toBase64, splitPrice } from './utils';

export class NodeAdapterReedSolomon extends ReedSolomon {
  async encodeInWorker(p, sourceData) {
    return new Promise((resolve, reject) => {
      if (isMainThread) {
        const chunkList = splitPrice(sourceData, this.segmentSize);

        let hashList = [];
        let segChecksumList = [];
        let encodeDataHashList = new Array(6);

        for (let i = 0; i < encodeDataHashList.length; i++) {
          encodeDataHashList[i] = [];
        }

        const threads = new Set();
        let RES = [];

        for (let i = 0; i < chunkList.length; i++) {
          const worker = new Worker(p, {
            workerData: {
              index: i,
              chunk: chunkList[i],
            },
          });
          threads.add(worker);
        }

        for (let w of threads) {
          w.on('error', (err) => {
            throw err;
          });
          w.on('exit', () => {
            threads.delete(w);
            // console.log(`Thread exiting, ${threads.size} running...`)
            if (threads.size === 0) {
              for (let i = 0; i < RES.length; i++) {
                segChecksumList.push(RES[i].segChecksum);
              }

              for (let i = 0; i < chunkList.length; i++) {
                for (let j = 0; j < encodeDataHashList.length; j++) {
                  encodeDataHashList[j][i] = RES[i].encodeDataHash[j];
                }
              }

              hashList[0] = sha256(getIntegrityUint8Array(segChecksumList));

              for (let i = 0; i < encodeDataHashList.length; i++) {
                hashList[i + 1] = sha256(getIntegrityUint8Array(encodeDataHashList[i]));
              }

              const res = toBase64(hashList);
              resolve(res);
            }
          });

          w.on('message', (message) => {
            // console.log('message', message.encodeData.index)
            RES[message.index] = message;
          });
        }
      } else {
        const encodeShards = this.encodeSegment(workerData.chunk);
        let encodeDataHash = [];

        for (let i = 0; i < encodeShards.length; i++) {
          const priceHash = sha256(encodeShards[i]);
          encodeDataHash.push(priceHash);
        }

        // console.log('encodeShards', encodeShards.length)
        // console.log('encodeDataHash', encodeDataHash.length)
        // console.log('workerData.index', workerData.index)

        parentPort.postMessage({
          index: workerData.index,
          segChecksum: sha256(workerData.chunk),
          encodeDataHash: encodeDataHash,
        });
      }
    });
  }
}
