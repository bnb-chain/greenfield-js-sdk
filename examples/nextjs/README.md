# GreenField JS SDK Next.js

Use [React](https://react.dev/) and [Next.js](https://nextjs.org/)

## Usage case

* tx
  * [transfer](./examples/wallet/src/components/transfer/index.tsx)
  * [withdraw](./examples/wallet/src/components/withdraw/index.tsx)
  * [bucket](./examples/wallet/src/components/bucket/index.tsx)
  * [object](./examples/wallet/src/components/object/index.tsx)
* [query](./examples/wallet/src/components/withdraw/query.tsx)

## Getting Started

```bash
# DEV ENV
> cp .env.simple .env.development.local

# QA ENV
> cp .env.simple .env.test.local
```

## Install and Build

First, build SDK srouce code:

```bash
# root dir
> pnpm run install
> pnpm run -r build 
```

## Start

```bash
# dev ENV
> npm run dev
```

```bash
# qa env
> npm run dev:qa
```
