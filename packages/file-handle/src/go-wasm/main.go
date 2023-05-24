package main

import (
	"bytes"
	"encoding/json"
	"syscall/js"

	lib "github.com/bnb-chain/greenfield-common/go/hash"
)

func hashFunc(this js.Value, args []js.Value) interface{} {
	if len(args) != 4 {
		return "invalid ComputerHashFromFile params amount"
	}
	array := args[0]
	byteLength := array.Get("byteLength").Int()
	var buffer []uint8 = make([]uint8, byteLength)
	js.CopyBytesToGo(buffer, array)
	segmentSize := args[1].Int()
	dataBlocks := args[2].Int()
	parityBlocks := args[3].Int()
	reader := bytes.NewReader(buffer)
	pieceHashRoots, contentLen, err := lib.ComputeIntegrityHash(reader, int64(segmentSize), dataBlocks, parityBlocks)
	if err != nil {
		return err.Error()
	}
	expectCheckSumsJson, err := json.Marshal(pieceHashRoots)
	if err != nil {
		return err.Error()
	}

	return map[string]interface{}{
		"expectCheckSums": string(expectCheckSumsJson),
		"contentLength":   contentLen,
		"redundancyVal":   0,
	}
}

func main() {
	done := make(chan int, 0)
	js.Global().Set("getCheckSums", js.FuncOf(hashFunc))
	<-done
}
