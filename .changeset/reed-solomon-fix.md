---
"@bnb-chain/reed-solomon": patch
---

Fix "Reduce of empty array with no initial value" error in Reed-Solomon module.

This fixes two issues:
1. Added safety checks in `getIntegrityUint8Array` to handle empty arrays gracefully
2. Enhanced Node adapter with proper worker thread handling to prevent errors when files are executed as workers

Added documentation about performance optimization, recommending direct `encode()` method for small files (<1MB) instead of `encodeInWorker()` to avoid worker thread complexity. 