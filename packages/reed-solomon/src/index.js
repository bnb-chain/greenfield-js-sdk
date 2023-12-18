import { sha256 } from 'ethereum-cryptography/sha256.js';
import { galMulSlice, galMulSliceXor } from './galois';
import { buildMatrix } from './matrix';
import { concat, getIntegrityUint8Array, toBase64 } from './utils';

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

  allocAligned(shards, each) {
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

  split(data) {
    if (data.length === 0) {
      return [];
    }

    if (this.totalShards === 1) {
      return [data];
    }

    const dataLen = data.length;

    const perShard = parseInt((dataLen + this.dataShards - 1) / this.dataShards);
    const needTotal = this.totalShards * perShard;

    // console.log('dataLen', dataLen)
    // console.log('needTotal', needTotal)
    // console.log('perShard', perShard)

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
      const fullShards = data.length / perShard;
      // padding = new Array(this.totalShards - fullShards).fill(0);
      padding = this.allocAligned(this.totalShards - fullShards, perShard);

      if (dataLen > perShard * fullShards) {
        const copyFrom = data.slice(perShard * fullShards, dataLen);
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

  encodeSegment(data) {
    if (data.length == 0) throw new Error('data buffer length is 0');

    const shared = this.split(data);

    const output = shared.slice(this.dataShards);

    // r.m
    const matrix = buildMatrix(this.totalShards, this.dataShards);

    let parity = [];
    for (let i = 0; i < this.parityShards; i++) {
      parity.push(matrix[this.dataShards + i]);
    }

    return this.codeSomeShards(
      parity,
      shared.slice(0, this.dataShards),
      output.slice(0, this.parityShards),
      shared[0].length,
    );
  }

  codeSomeShards(matrixRows, inputs, outputs) {
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

  encode(sourceData) {
    let chunkList = [];
    let cur = 0;

    // TODO: if totalShards is not `5JCeuQeRkm5NMpJWZG3hSuFU=`
    if (sourceData.length == 0) {
      return new Array(this.totalShards + 1).fill('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=');
    }

    while (cur < sourceData.length) {
      chunkList.push(sourceData.slice(cur, cur + this.segmentSize));
      cur += this.segmentSize;
    }

    let encodeDataHash = new Array(this.totalShards);

    for (let i = 0; i < encodeDataHash.length; i++) {
      encodeDataHash[i] = [];
    }

    let hashList = [];
    let segChecksumList = [];
    for (let i = 0; i < chunkList.length; i++) {
      const data = chunkList[i];
      // console.log('data i', i)
      const encodeShards = this.encodeSegment(data);
      // console.log('data i done')
      segChecksumList.push(sha256(data));
      for (let i = 0; i < encodeShards.length; i++) {
        const priceHash = sha256(encodeShards[i]);
        encodeDataHash[i].push(priceHash);
      }
    }

    hashList[0] = sha256(getIntegrityUint8Array(segChecksumList));

    for (let i = 0; i < encodeDataHash.length; i++) {
      hashList[i + 1] = sha256(getIntegrityUint8Array(encodeDataHash[i]));
    }

    return toBase64(hashList);
  }
}
