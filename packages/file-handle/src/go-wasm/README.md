# Wasm part

This folder contains methods that needed to be transformed from Golang to WebAssembly in `greenfield-go-common` repository.

## How to update wasm

Navigate to `wasm` directory in root dir, and execute `GOOS=js GOARCH=wasm go build -o ../files-handle-wasm/main.wasm` to generate new wasm file.
