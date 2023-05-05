# GNFD JS SDK Examples

## Getting Started

### Prepare Config 

```bash
# TESTNET qa ENV 
> cd example/wallet
# DEV ENV
> cp .env.simple .env.development.local
# QA ENV
> cp .env.simple .env.test.local
```

### Install
First, build SDK source:
```bash
> cd packages/chain-sdk
> pnpm run build
```

Second, build source
```bash
> cd example/wallet
> pnpm install
```

### Run Demo 
running different environment. choose one according to your `.env` config file

```bash
# dev ENV for .env.development.local
> npm run dev
```

```bash
# qa ENV for .env.test.local
> npm run dev:qa
```

then visit [http://localhost:3000/wallet](http://localhost:3000/wallet)
