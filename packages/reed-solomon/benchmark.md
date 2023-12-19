# benchmarks

## 20M

* Nodejs: 1s
* Nodejs(worker): 1s

## 200M

* Go: 300ms
* Nodejs: 10s
* Nodejs(worker): 2s
* Browser: 15s

## conclusion

When there are not many shards, using worker will not make performance faster.

Because worker communication is also a performance loss.
