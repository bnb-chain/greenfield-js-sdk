/* eslint-disable */
const fs = require('node:fs');
const path = require('node:path');
const { NodeAdapterReedSolomon } = require('../dist/node.adapter');

const fileBuffer = fs.readFileSync('./README.md');

const rs = new NodeAdapterReedSolomon();

// single file
(async () => {
  console.time('cost');
  const res = await rs.encodeInWorker(__filename, Uint8Array.from(fileBuffer));
  console.log('res', res);
  console.timeEnd('cost');
})();
