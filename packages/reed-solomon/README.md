# Reed Solomon

Lighting implementation for [klauspost/reedsolomon](https://github.com/klauspost/reedsolomon).

Compatible with [greenfield-common](https://github.com/bnb-chain/greenfield-common/blob/master/go/hash/hash.go).

## Install

```bash
> npm install @bnb-chain/reed-solomon
```

## Usage Examples

### Browser

Use directly in the browser via script tag:

```html
<input type="file" id="file" />
<button id="btn">
  get reed solomon
</button>

<script src="https://cdn.jsdelivr.net/npm/@bnb-chain/reed-solomon/index.aio.js"></script>
<script>
  const fileInput = document.getElementById('file');

  document.getElementById('btn').onclick = async function() {
    const selectFile = fileInput.files[0];
    const arrBuffer = await selectFile.arrayBuffer()

    if (!arrBuffer) alert('no file selected');

    const rs = new RS.ReedSolomon();
    const res = rs.encode(new Uint8Array(arrBuffer))
  }
</script>
```

### ESM

If you use module bundler such as [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/guide/en/), etc:

```js
import {ReedSolomon} from '@bnb-chain/reed-solomon'

const rs = new RS.ReedSolomon();
const res = rs.encode(new Uint8Array(fileBuffer))
```

### Nodejs

Using in Nodejs:

```js
const { NodeAdapterReedSolomon } = require('@bnb-chain/reed-solomon/node.adapter');

const fileBuffer = fs.readFileSync('./output_file');

const rs = new NodeAdapterReedSolomon();
const res = await rs.encodeInWorker(__filename, Uint8Array.from(fileBuffer))
```

* [calcute single file](./examples/singlefile.js)
* [calcute several file in a folder](./examples/folder.js)
