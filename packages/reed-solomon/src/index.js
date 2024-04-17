import { sha256 } from 'ethereum-cryptography/sha256.js';
import { galMulSlice, galMulSliceXor } from './galois';
import { buildMatrix } from './matrix';
import { concat, getIntegrityUint8Array, splitPrice, toBase64 } from './utils';

export class ReedSolomon {
  constructor(
    dataShards = 4,
    parityShards = 2,
    // 16 * 1024 * 1024 , 16m
    segmentSize = 16777216,
  ) {
    this.parityShards = parityShards;
    this.dataShards = dataShards;
    this.totalShards = dataShards + parityShards;
    this.segmentSize = segmentSize;
  }

  _allocAligned(shards, each) {
    // const eachAligned = (parseInt((each + 63) / 64)) * 64; // Use Math.ceil instead of ((each + 63) / 64) * 64

    const eachAligned = ((each + 63) >>> 6) << 6;
    let total = new ArrayBuffer(eachAligned * shards + 63);

    // Allocate slices
    let res = new Array(shards);
    for (let i = 0; i < shards; i++) {
      res[i] = new Uint8Array(total, i * eachAligned, each);
      total = new Uint8Array(total.slice(eachAligned));
    }
    return res;
  }

  _split(data) {
    if (data.length === 0) {
      return [];
    }

    if (this.totalShards === 1) {
      return [data];
    }

    const dataLen = data.length;

    // Calculate number of bytes per data shard.
    const perShard = Math.floor((dataLen + this.dataShards - 1) / this.dataShards);
    const needTotal = this.totalShards * perShard;

    let tmp = Array.prototype.slice.call(data);
    if (this.segmentSize > data.length) {
      if (this.segmentSize > needTotal) {
        tmp = tmp.slice(0, needTotal);
        for (let i = data.length; i < needTotal; i++) {
          tmp.push(0);
        }
      } else {
        for (let i = data.length; i < this.segmentSize; i++) {
          tmp[i] = 0;
        }
      }
    }
    data = Uint8Array.from(tmp);

    let padding = [];
    if (data.length < needTotal) {
      const fullShards = Math.floor(data.length / perShard);
      padding = this._allocAligned(this.totalShards - fullShards, perShard);

      if (dataLen > perShard * fullShards) {
        let copyFrom = data.slice(perShard * fullShards, dataLen);
        for (let i = 0; i < padding.length; i++) {
          if (copyFrom.length > 0) {
            padding[i] = copyFrom.slice(0, perShard);
            copyFrom = copyFrom.slice(perShard);
          }
        }
      }
    }

    // split data to same length price
    const dst = new Array(this.totalShards);
    let i = 0;
    for (; i < dst.length && data.length >= perShard; i++) {
      dst[i] = data.slice(0, perShard);
      data = data.slice(perShard);
    }

    for (let j = 0; i + j < dst.length; j++) {
      dst[i + j] = padding[j];
      padding[j] = padding[j + 1];
    }

    return dst;
  }

  _codeSomeShards(matrixRows, inputs, outputs) {
    let start = 0;
    let end = inputs[0].length;

    while (start < inputs[0].length) {
      for (let c = 0; c < inputs.length; c++) {
        const ins = inputs[c].slice(start, end);
        for (let iRow = 0; iRow < outputs.length; iRow++) {
          if (c === 0) {
            outputs[iRow] = galMulSlice(matrixRows[iRow][c], ins, outputs[iRow].slice(start, end));
          } else {
            outputs[iRow] = galMulSliceXor(
              matrixRows[iRow][c],
              ins,
              outputs[iRow].slice(start, end),
            );
          }
        }
      }

      start = end;
      // end += r.o.perRound;
      end += 1398144;
      if (end > inputs[0].length) {
        end = inputs[0].length;
      }
    }
    return concat(inputs, outputs);
  }

  encodeSegment(data) {
    if (data.length == 0) throw new Error('data buffer length is 0');

    const shared = this._split(data);

    const output = shared.slice(this.dataShards);

    // r.m
    const matrix = buildMatrix(this.totalShards, this.dataShards);

    let parity = [];
    for (let i = 0; i < this.parityShards; i++) {
      parity.push(matrix[this.dataShards + i]);
    }

    return this._codeSomeShards(
      parity,
      shared.slice(0, this.dataShards),
      output.slice(0, this.parityShards),
    );
  }

  encode(sourceData) {
    if (sourceData.length == 0) {
      throw new Error('file buffer is empty');
    }

    const chunkList = splitPrice(sourceData, this.segmentSize);

    let encodeDataHashList = new Array(this.totalShards);
    for (let i = 0; i < encodeDataHashList.length; i++) {
      encodeDataHashList[i] = [];
    }

    let encodeShards = chunkList.map((chunk, index) => {
      return this.getEncodeShard(chunk, index);
    });

    return this.getChecksumsByEncodeShards(encodeShards);
  }

  getEncodeShard(chunk, index) {
    const encodeShards = this.encodeSegment(chunk);
    let encodeDataHash = [];
    for (let i = 0; i < encodeShards.length; i++) {
      const priceHash = sha256(encodeShards[i]);
      encodeDataHash.push(priceHash);
    }
    return {
      index,
      segChecksum: sha256(chunk),
      encodeDataHash,
    };
  }

  getChecksumsByEncodeShards(encodeShards) {
    let hashList = [];
    let segChecksumList = [];
    let encodeDataHashList = new Array(this.totalShards);
    for (let i = 0; i < encodeDataHashList.length; i++) {
      encodeDataHashList[i] = [];
    }

    for (let i = 0; i < encodeShards.length; i++) {
      segChecksumList.push(encodeShards[i].segChecksum);
    }

    for (let i = 0; i < encodeShards.length; i++) {
      for (let j = 0; j < encodeDataHashList.length; j++) {
        encodeDataHashList[j][i] = encodeShards[i].encodeDataHash[j];
      }
    }

    hashList[0] = sha256(getIntegrityUint8Array(segChecksumList));

    for (let i = 0; i < encodeDataHashList.length; i++) {
      hashList[i + 1] = sha256(getIntegrityUint8Array(encodeDataHashList[i]));
    }

    return toBase64(hashList);
  }

  sortByIndex(encodeShards) {
    return encodeShards.sort((a, b) => a.index - b.index);
  }
}
