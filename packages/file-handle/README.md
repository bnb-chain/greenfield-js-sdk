# Greenfield Files JS SDK

WASM module that handle file, such as `checksums` method.

## Usage on Nodejs

```javascript
const fs = require('fs')
const { getCheckSums } = require('@bnb-chain/greenfiled-file-handle');
const fileBuffer = fs.readFileSync('./CHANGELOG.md');

(async () => {
  const { contentLength, expectCheckSums } = await getCheckSums(fileBuffer);
})()
```

Full Code: https://github.com/bnb-chain/greenfield-js-sdk/blob/main/examples/nodejs/storage.js

## Usage on Browser

load wasm:

```html
<script src="https://unpkg.com/@bnb-chain/greenfiled-file-handle@0.2.1/dist/browser/umd/index.js"></script>
<script
  window.__PUBLIC_FILE_HANDLE_WASM_PATH__ = 'https://unpkg.com/@bnb-chain/greenfiled-file-handle@0.2.1/dist/node/file-handle.wasm'`,
  }}
></script>
```

execute wasm:

```javascript
(async () => {
  // file is from input element
  const fileBytes = await file.arrayBuffer();
  const hashResult = await (window as any).FileHandle.getCheckSums(
    new Uint8Array(fileBytes),
  );
  const { contentLength, expectCheckSums } = hashResult;
})()
```

Full Code: https://github.com/bnb-chain/greenfield-js-sdk/blob/main/examples/nextjs/src/components/object/create/index.tsx#L63
