# Zk Crypto

NPM Wrap for [zkbnb-js-sdk](https://github.com/bnb-chain/zkbnb-js-sdk).

## Usage

```
> npm i @bnb-chain/greenfield-zk-crypto
```

### Browsers

#### ESM

```js
import {getEddsaCompressedPublicKey} from "@bnb-chain/greenfield-zk-crypto"

// set wasm path: CDN or your server path
window.__PUBLIC_ZKCRYPTO_WASM_PATH__ = 'zk wasm path';

;(async () => {
  const res = await getEddsaCompressedPublicKey('foo');
  console.log(res)
})()
```

#### UMD

```html
<script src="https://cdn.jsdelivr.net/npm/@bnb-chain/greenfield-zk-crypto/dist/umd/index.js"></script>
<script>
  // set wasm path
  window.__PUBLIC_CROSS_WASM_PATH__ = 'https://cdn.jsdelivr.net/npm/@bnb-chain/greenfield-zk-crypto/dist/node/zk-crypto.wasm';

  ;(async () => {
    const res = await getEddsaCompressedPublicKey('foo');
    console.log(res)
  })()
</script>
```

### Nodejs

```js
const { getEddsaCompressedPublicKey } = require("@bnb-chain/greenfield-zk-crypto");

;(async () => {
  const res = await getEddsaCompressedPublicKey('foo');
})()
```
