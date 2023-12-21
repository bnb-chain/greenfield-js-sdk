/* eslint-disable */
const fs = require('node:fs');
const path = require('node:path');
const { ReedSolomon } = require('../dist/index');

const sourceData = fs.readFileSync('./README.md');

(async () => {
  const rs = new ReedSolomon();
  console.log('file size', sourceData.length / 1024 / 1024, 'm');
  console.time('cost');
  const res = await rs.encode(Uint8Array.from(sourceData));
  console.log('res', res);
  console.timeEnd('cost');
})();
