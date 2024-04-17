/* eslint-disable */
const fs = require('node:fs');
const path = require('node:path');
const { NodeAdapterReedSolomon } = require('../dist/node.adapter');

const fileBuffer = fs.readFileSync('./README.md');

(async () => {
  const rs = new NodeAdapterReedSolomon();

  console.time('cost worker_threads');
  console.log('file size', fileBuffer.length / 1024 / 1024, 'm');
  const res = await rs.encodeInWorker(__filename, Uint8Array.from(fileBuffer));
  console.log('res', res);
  console.timeEnd('cost worker_threads');
})();
