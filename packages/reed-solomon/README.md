# Reed Solomon

Lighting implementation for [klauspost/reedsolomon](https://github.com/klauspost/reedsolomon).

Compatible with [greenfield-common](https://github.com/bnb-chain/greenfield-common/blob/master/go/hash/hash.go).

## Install

```bash
> npm install @bnb-chain/reed-solomon
```

## Usage Examples

### ESM

If you use module bundler such as [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/guide/en/), etc:

```js
import {ReedSolomon} from '@bnb-chain/reed-solomon'

const rs = new ReedSolomon();
const res = rs.encode(new Uint8Array(fileBuffer))
```

### Browser

Use directly in the browser via script tag:

```html
<input type="file" id="file" />
<button id="btn">
  get reed solomon
</button>

<script src="https://cdn.jsdelivr.net/npm/@bnb-chain/reed-solomon/dist/index.aio.js"></script>
<script>
  const fileInput = document.getElementById('file');

  document.getElementById('btn').onclick = async function() {
    const selectFile = fileInput.files[0];
    const arrBuffer = await selectFile.arrayBuffer()

    if (!arrBuffer) alert('no file selected');

    const rs = new RS.ReedSolomon()
    const res = await rs.encode(sourceData)
  }
</script>
```

[Code](./examples/web.html)

### Browser(WebWorker)

```html
<!-- prefetch js -->
<link rel="prefetch" href="https://unpkg.com/@bnb-chain/reed-solomon/dist/web.adapter.aio.js" />
<link rel="prefetch" href="https://unpkg.com/@bnb-chain/reed-solomon/dist/utils.aio.js" />
<script src="https://unpkg.com/@bnb-chain/reed-solomon/dist/web.adapter.aio.js"></script>
<script>
  const rs = new WebAdapter.WebAdapterReedSolomon()
  rs.initWorkers({
    workerNum: 6,
    injectWorker,
  })

  document.getElementById('worker-btn').onclick = async function() {
    const selectFile = fileInput.files[0];
    const arrBuffer = await selectFile.arrayBuffer()
    if (!arrBuffer) alert('no file selected');

    const sourceData = new Uint8Array(arrBuffer)
    const res = await rs.encodeInWorker(sourceData)
  }

  // inject worker
  function injectWorker() {
    // or download this file and put it to your CDN server
    importScripts('https://unpkg.com/@bnb-chain/reed-solomon/dist/web.adapter.aio.js');
    importScripts('https://unpkg.com/@bnb-chain/reed-solomon/dist/utils.aio.js');

    const rs = new WebAdapter.WebAdapterReedSolomon();
    onmessage = function (event) {
      const { index, chunk } = event.data;
      const encodeShard = rs.getEncodeShard(chunk, index)
      postMessage(encodeShard);
    };
  }
</script>
```

[Code](./examples/web-worker.html)

### Nodejs

```js
const { ReedSolomon } = require('@bnb-chain/reed-solomon')

const rs = new ReedSolomon();
const res = await rs.encode(Uint8Array.from(fileBuffer));
```

[Code](./examples/node.js)

More examples:

* [calcute several file in a folder](./examples/folder.js)

### Nodejs(`worker_threads`)

Using in Nodejs:

```js
const { NodeAdapterReedSolomon } = require('@bnb-chain/reed-solomon/node.adapter');

const fileBuffer = fs.readFileSync('./output_file');

const rs = new NodeAdapterReedSolomon();
const res = await rs.encodeInWorker(__filename, Uint8Array.from(fileBuffer))
```

[Code](./examples/node-worker.js)

## Benchmark

[benchmark](./benchmark.md)
