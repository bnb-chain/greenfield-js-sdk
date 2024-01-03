# Zk Crypto

NPM Wrap for [zkbnb-js-sdk](https://github.com/bnb-chain/zkbnb-js-sdk).

## Usage

```bash
> npm i @bnb-chain/greenfield-zk-crypto
```

### Browsers

#### ESM

```js
import { init, getEddsaCompressedPublicKey } from "@bnb-chain/greenfield-zk-crypto"

;(async () => {
  await init(
    'https://unpkg.com/@bnb-chain/greenfield-zk-crypto/dist/node/zk-crypto.wasm'
  );

  const res = await getEddsaCompressedPublicKey('foo');
  console.log(res)
})()
```

#### UMD

```html
<script src="https://cdn.jsdelivr.net/npm/@bnb-chain/greenfield-zk-crypto/dist/umd/index.js"></script>
<script>
  ;(async () => {
    await ZkCrypto.init(
      'https://unpkg.com/@bnb-chain/greenfield-zk-crypto/dist/node/zk-crypto.wasm'
    );

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

## Build WASM

```bash
tinygo build -no-debug -o zk-crypto.wasm -target=wasm main.go
```
