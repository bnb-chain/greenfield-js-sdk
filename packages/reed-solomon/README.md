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
# Performance Optimization Guide

## Choosing Between Worker Threads and Direct Processing

The Reed-Solomon library provides two methods for calculating checksums:

### Direct Processing: `encode()`

For small files (< 1MB), we recommend using the direct `encode()` method:

```javascript
import { ReedSolomon } from '@bnb-chain/reed-solomon';

const rs = new ReedSolomon();
const checksums = rs.encode(fileData);
```

**Advantages**:
- Simpler implementation
- No worker thread overhead
- No risk of worker context issues
- Suitable for most common use cases

### Worker Thread Processing: `encodeInWorker()`

For larger files (> 1MB) or when performance is critical, use worker threads:

```javascript
import { NodeAdapterReedSolomon } from '@bnb-chain/reed-solomon/node.adapter';

const rs = new NodeAdapterReedSolomon();
const checksums = await rs.encodeInWorker(workerFilePath, fileData);
```

**Important**: When using `encodeInWorker()`, your worker file must include worker handling code at the top level:

```javascript
const { isMainThread, parentPort, workerData } = require('node:worker_threads');

// Worker thread code - must be at the top of any file used as a worker
if (!isMainThread) {
  try {
    const { chunk, index } = workerData;
    if (chunk) {
      const { ReedSolomon } = require('@bnb-chain/reed-solomon');
      const rs = new ReedSolomon();
      const encodeShard = rs.getEncodeShard(chunk, index);
      parentPort.postMessage(encodeShard);
    }
  } catch (error) {
    parentPort.postMessage({ error: error.message, index: workerData?.index });
  }
}

// Main thread code can follow...
```

## Decision Guide

| File Size | Recommended Method | Notes |
|-----------|-------------------|-------|
| < 1MB     | `encode()`        | Simplest, most reliable approach |
| 1MB-10MB  | Either method     | Consider application requirements |
| > 10MB    | `encodeInWorker()`| Best for performance with proper worker handling | # Performance Optimization Guide

## Choosing Between Worker Threads and Direct Processing

The Reed-Solomon library provides two methods for calculating checksums:

### Direct Processing: `encode()`

For small files (< 1MB), we recommend using the direct `encode()` method:

```javascript
import { ReedSolomon } from '@bnb-chain/reed-solomon';

const rs = new ReedSolomon();
const checksums = rs.encode(fileData);
```

**Advantages**:
- Simpler implementation
- No worker thread overhead
- No risk of worker context issues
- Suitable for most common use cases

### Worker Thread Processing: `encodeInWorker()`

For larger files (> 1MB) or when performance is critical, use worker threads:

```javascript
import { NodeAdapterReedSolomon } from '@bnb-chain/reed-solomon/node.adapter';

const rs = new NodeAdapterReedSolomon();
const checksums = await rs.encodeInWorker(workerFilePath, fileData);
```

**Important**: When using `encodeInWorker()`, your worker file must include worker handling code at the top level:

```javascript
const { isMainThread, parentPort, workerData } = require('node:worker_threads');

// Worker thread code - must be at the top of any file used as a worker
if (!isMainThread) {
  try {
    const { chunk, index } = workerData;
    if (chunk) {
      const { ReedSolomon } = require('@bnb-chain/reed-solomon');
      const rs = new ReedSolomon();
      const encodeShard = rs.getEncodeShard(chunk, index);
      parentPort.postMessage(encodeShard);
    }
  } catch (error) {
    parentPort.postMessage({ error: error.message, index: workerData?.index });
  }
}

// Main thread code can follow...
```

## Decision Guide

| File Size | Recommended Method | Notes |
|-----------|-------------------|-------|
| < 1MB     | `encode()`        | Simplest, most reliable approach |
| 1MB-10MB  | Either method     | Consider application requirements |
| > 10MB    | `encodeInWorker()`| Best for performance with proper worker handling | 