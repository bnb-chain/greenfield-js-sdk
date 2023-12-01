package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"syscall/js"

	lib "github.com/bnb-chain/greenfield-common/go/hash"
	redundancy "github.com/bnb-chain/greenfield-common/go/redundancy"
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

func encodeRawSegment(this js.Value, args []js.Value) interface{} {
	array := args[0]
	dataBlocks := args[1].Int()
	parityBlocks := args[2].Int()

	fmt.Print("array: ", array, dataBlocks, parityBlocks)

	byteLength := array.Get("byteLength").Int()
	data := make([]byte, byteLength)
	var buffer []uint8 = make([]uint8, byteLength)
	js.CopyBytesToGo(buffer, array)
	reader := bytes.NewReader(buffer)
	reader.Read(data)

	encodeShards, _ := redundancy.EncodeRawSegment(data, dataBlocks, parityBlocks)
	shardsJson, _ := json.Marshal(encodeShards)
	return map[string]interface{}{
		"result": string(shardsJson),
	}
}

func main() {
	done := make(chan int, 0)
	js.Global().Set("getCheckSums", js.FuncOf(hashFunc))
	js.Global().Set("encodeRawSegment", js.FuncOf(encodeRawSegment))
	<-done
}
