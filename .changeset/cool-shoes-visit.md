---
"@bnb-chain/greenfield-js-sdk": patch
---

fix: Replace legacy method, Some third-party plug-ins (e.g. wallet guard) will automatically convert deprecated methods and are not compatible with the return value of deprecated methods. https://github.com/wallet-guard/wallet-guard-extension/blob/221ad3eb329ad7681b16a37c7ddfaf173dba6e7f/src/injected/injectWalletGuard.tsx#L49-L62
