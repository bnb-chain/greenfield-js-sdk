/* eslint-disable */
const fs = require('node:fs/promises');
const path = require('node:path');
const { NodeAdapterReedSolomon } = require('../dist/node.adapter');

const rs = new NodeAdapterReedSolomon();
const folderPath = './dist';

(async () => {
  async function traverse(currentPath) {
    const start = Date.now();
    const files = await fs.readdir(currentPath);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(currentPath, file);
      const stat = await fs.stat(filePath);

      const start = Date.now();
      const fileBuffer = await fs.readFile(filePath);
      const res = await rs.encodeInWorker(__filename, Uint8Array.from(fileBuffer));
      console.log('res', file, Date.now() - start, res);
    }

    console.log('files count: ', files.length);
    console.log('total cost time: ', Date.now() - start);
  }

  await traverse(folderPath);
})();
