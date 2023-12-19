import { ReedSolomon } from '.';
import { sha256, getIntegrityUint8Array, toBase64, splitPrice } from './utils';

export class WebAdapterReedSolomon extends ReedSolomon {
  async encodeInWorker(workerFn, sourceData, { webAdapterUrl, utilsUrl }) {
    const chunkList = splitPrice(sourceData, this.segmentSize);

    const workers = [];

    for (let i = 0; i < chunkList.length; i++) {
      // const worker = new Worker('worker.js');
      const worker = createWorker(workerFn, {
        webAdapterUrl,
        utilsUrl,
      });
      workers.push(worker);
      worker.postMessage({
        index: i,
        chunk: chunkList[i],
      });
    }

    const plist = workers.map(
      (worker) =>
        new Promise((resolve) => {
          worker.onmessage = (e) => {
            resolve(e.data);
          };
        }),
    );

    return Promise.all(plist).then((RES) => {
      let hashList = [];
      let segChecksumList = [];
      let encodeDataHashList = new Array(this.totalShards);
      for (let i = 0; i < encodeDataHashList.length; i++) {
        encodeDataHashList[i] = [];
      }

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

      return res;
    });
  }
}

function createWorker(f, { webAdapterUrl, utilsUrl }) {
  var blob = new Blob([
    '(' + f.toString() + ')(' + `'${webAdapterUrl}'` + ',' + `'${utilsUrl}'` + ')',
  ]);
  var url = window.URL.createObjectURL(blob);
  var worker = new Worker(url);
  return worker;
}

// inject worker script
export function injectWorker(cdnsUrls) {
  importScripts(
    cdnsUrls.webAdapterUrl ||
      'https://cdn.jsdelivr.net/npm/@bnb-chain/reed-solomon/dist/index.aio.js',
  );
  importScripts('https://cdn.jsdelivr.net/npm/@bnb-chain/reed-solomon/dist/utils.aio.js');

  const rs = new WebAdapter.WebAdapterReedSolomon();

  onmessage = function (event) {
    const { index, chunk } = event.data;
    const encodeShards = rs.encodeSegment(chunk);
    let encodeDataHash = [];

    for (let i = 0; i < encodeShards.length; i++) {
      const priceHash = RSUtils.sha256(encodeShards[i]);
      encodeDataHash.push(priceHash);
    }

    postMessage({
      index,
      segChecksum: RSUtils.sha256(chunk),
      encodeDataHash,
    });

    self.close();
  };
}
