import { ReedSolomon } from '.';
import { sha256, getIntegrityUint8Array, toBase64, splitPrice } from './utils';

export class WebAdapterReedSolomon extends ReedSolomon {
  async encodeInWorker(sourceData, { injectWorker, workerNum = 10 }) {
    let RES = [];
    const chunkList = splitPrice(sourceData, this.segmentSize);
    const queue = [];
    const workers = [];

    for (let i = 0; i < chunkList.length; i++) {
      queue.push({
        index: i,
        chunk: chunkList[i],
      });
    }

    for (let i = 0; i < workerNum; i++) {
      const worker = createWorker(injectWorker);
      workers.push(worker);
    }

    return new Promise((resolve) => {
      let completedWorkers = 0;

      for (let i = 0; i < queue.length; i++) {
        const worker = workers[i % workerNum];
        worker.postMessage({
          index: queue[i].index,
          chunk: queue[i].chunk,
        });

        worker.onmessage = (e) => {
          // console.log('worker data', e.data)
          completedWorkers++;
          RES.push(e.data);

          if (completedWorkers === queue.length) {
            // console.log('RES', RES)
            const sortedRes = this._sortByIndex(RES);
            resolve(this._getChecksumsByEncodeShards(sortedRes));
          }
        };
      }
    });
  }

  _sortByIndex(encodeShards) {
    return encodeShards.sort((a, b) => a.index - b.index);
  }

  /**
   * @param {Array[{index, segChecksum, encodeDataHash}]} encodeShards
   */
  _getChecksumsByEncodeShards(encodeShards) {
    let hashList = [];
    let segChecksumList = [];
    let encodeDataHashList = new Array(this.totalShards);
    for (let i = 0; i < encodeDataHashList.length; i++) {
      encodeDataHashList[i] = [];
    }

    for (let i = 0; i < encodeShards.length; i++) {
      segChecksumList.push(encodeShards[i].segChecksum);
    }

    for (let i = 0; i < encodeShards.length; i++) {
      for (let j = 0; j < encodeDataHashList.length; j++) {
        encodeDataHashList[j][i] = encodeShards[i].encodeDataHash[j];
      }
    }

    hashList[0] = sha256(getIntegrityUint8Array(segChecksumList));

    for (let i = 0; i < encodeDataHashList.length; i++) {
      hashList[i + 1] = sha256(getIntegrityUint8Array(encodeDataHashList[i]));
    }

    return toBase64(hashList);
  }
}

function createWorker(f) {
  var blob = new Blob(['(' + f.toString() + ')()']);
  var url = window.URL.createObjectURL(blob);
  var worker = new Worker(url);
  return worker;
}
