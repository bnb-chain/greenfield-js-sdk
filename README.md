# GreenField JS SDK

## Documentation

[greenfield-chain-sdk](./packages/chain-sdk/) is a library that consists of pakcages, a so called monorepo.

| Package | Description |
| --- | --- |
| [@bnb-chain/greenfield-chain-sdk](./packages/chain-sdk) | A client library for Greenfield Chain |
| [@bnb-chain/greenfiled-file-handle](./packages/files) | WASM module that handle file, such as `checksums` |

## Examples

[Examples](./examples)

* tx
  * [transfer](./examples/wallet/src/components/transfer/index.tsx)
  * [withdraw](./examples/wallet/src/components/withdraw/index.tsx)
  * [bucket](./examples/wallet/src/components/bucket/index.tsx)
  * [object](./examples/wallet/src/components/object/index.tsx)
* [query](./examples/wallet/src/components/withdraw/query.tsx)

## Supported JS environments

1. Modern browsers (Chromium, Firefox, Safari)
2. Browser extensions (Chromium, Firefox)

## Contribution

Look at [CONTRIBUTING](./CONTRIBUTING.md) specifically


## Disclaimer

Look at [DISCLAIMER](./DISCLAIMER.md)

## License

The library is licensed under the
[GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.en.html),
also included in our repository in the `LICENSE` file.
