# GreenField JS SDK Node.js


## Prepare

### install and build

Install dependencies:

```bash
pnpm install
```

Build packages:

```bash
pnpm run -F "./packages/**"  -r build
```

### Run the demo application

```bash
> cp .env.simple .env
```

Fill your account's private key and address in [env](./env).

## Execure example

```bash
> node ./cases/storage.js
```

* [storages.js](./cases/storage.js)
* [account.js](./cases/account.js)
* [policy.js](./cases/policy.js)
* [query.js](./cases/query.js)
* [transfer.js](./cases/transfer.js)
