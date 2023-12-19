import { encode } from '@ethersproject/base64';
export { sha256 } from 'ethereum-cryptography/sha256.js';

export function concat(a, b) {
  let res = [];
  a.forEach((i) => {
    res.push(i);
  });
  b.forEach((i) => {
    res.push(i);
  });
  return res;
}

export function getIntegrityUint8Array(uint8arr) {
  const arr = uint8arr.reduce((a, b) => {
    return concat(a, b);
  });

  return Uint8Array.from(arr);
}

export function toBase64(hashList) {
  const res = [];
  for (let i = 0; i < hashList.length; i++) {
    res.push(encode(hashList[i]));
  }
  return res;
}

/**
 * split data to same length price
 */
export function splitPrice(data, size) {
  let chunkList = [];
  let cur = 0;

  while (cur < data.length) {
    chunkList.push(data.slice(cur, cur + size));
    cur += size;
  }

  return chunkList;
}
