/* eslint-disable */
const fs = require('node:fs/promises');
const path = require('node:path');
const { NodeAdapterReedSolomon } = require('../dist/node.adapter');

const rs = new NodeAdapterReedSolomon();
const folderPath = './dist';

(async () => {
  async function traverse(currentPath) {
    console.time('total');
    const files = await fs.readdir(currentPath);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(currentPath, file);
      const stat = await fs.stat(filePath);

      console.time('file', file);
      const fileBuffer = await fs.readFile(filePath);
      const res = await rs.encodeInWorker(__filename, Uint8Array.from(fileBuffer));
      console.timeEnd('file');
      console.log(file, 'res: ', res);
    }

    console.log('files count: ', files.length);
    console.timeEnd('total');
  }

  await traverse(folderPath);
})();
