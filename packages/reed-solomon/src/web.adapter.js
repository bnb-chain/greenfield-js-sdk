import { ReedSolomon } from '.';
import { splitPrice } from './utils';

export class WebAdapterReedSolomon extends ReedSolomon {
  initWorkers({ injectWorker, workerNum = 10 }) {
    this.workerNum = workerNum;
    this.workers = [];
    for (let i = 0; i < workerNum; i++) {
      const worker = createWorker(injectWorker);
      this.workers.push(worker);
    }
  }

  async encodeInWorker(sourceData) {
    // RES is `encodeShards` Array
    let RES = [];
    const chunkList = splitPrice(sourceData, this.segmentSize);
    const queue = [];

    for (let i = 0; i < chunkList.length; i++) {
      queue.push({
        index: i,
        chunk: chunkList[i],
      });
    }

    return new Promise((resolve) => {
      let completedWorkers = 0;

      for (let i = 0; i < queue.length; i++) {
        const worker = this.workers[i % this.workerNum];
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
}

function createWorker(f) {
  var blob = new Blob(['(' + f.toString() + ')()']);
  var url = window.URL.createObjectURL(blob);
  var worker = new Worker(url);
  return worker;
}
