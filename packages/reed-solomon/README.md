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

const rs = new RS.ReedSolomon();
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
<script>
  document.getElementById('worker-btn').onclick = async function() {
    const selectFile = fileInput.files[0];
    const arrBuffer = await selectFile.arrayBuffer()
    if (!arrBuffer) alert('no file selected');

    const sourceData = new Uint8Array(arrBuffer)
    const rs = new WebAdapter.WebAdapterReedSolomon()
    const res = await rs.encodeInWorker(injectWorker, sourceData)
  }

  // inject worker
  function injectWorker() {
    // replace your CDN url
    importScripts('http://localhost:9002/dist/web.adapter.aio.js');
    importScripts('http://localhost:9002/dist/utils.aio.js');

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

## Benchark

[benchmark](./benchmark.md)
