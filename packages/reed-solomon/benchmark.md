# benchmarks

| file size | [Nodejs](./examples/node.js) | [Nodejs(worker_threads)](./examples/node-worker.js) | [Browser](./examples/web.html) | [Browser(webworker)](./examples/web-worker.html) |
| - | - | - | - | - |
| 20M | 1s | 1s | 1.6s | 1.3s |
| 200M | 10s | 2s | 15s | 2.2s |

## conclusion

When there are not many shards, using worker will not make performance faster.

Because worker communication is also a performance loss.
