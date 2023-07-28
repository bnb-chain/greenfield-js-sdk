import { hexlify, joinSignature } from '@ethersproject/bytes';
import { SigningKey } from '@ethersproject/signing-key';
import { Headers } from 'cross-fetch';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { sha256 } from 'ethereum-cryptography/sha256.js';
import { utf8ToBytes } from 'ethereum-cryptography/utils.js';
import { METHOD_GET, METHOD_POST, MOCK_SIGNATURE } from './http';

export const getCanonicalHeaders = (reqMeta: Partial<ReqMeta>, reqHeaders: Headers) => {
  const sortedHeaders = getSortedHeaders(reqHeaders, SUPPORTED_HEADERS);

  const res: string[] = [];
  sortedHeaders.forEach((k) => {
    const v = reqHeaders.get(k);
    res.push(`${k}:${v}`);
  });

  if (reqMeta.url && reqMeta.url.hostname) {
    res.push(reqMeta.url.hostname);
  }

  res.push('');
  return res.join('\n');
};

const getSortedHeaders = (reqHeaders: Headers, supportHeaders: string[]) => {
  const signedHeaders: string[] = [];

  reqHeaders.forEach((v, k) => {
    if (supportHeaders.includes(k)) {
      signedHeaders.push(k);
    }
  });

  return signedHeaders.sort();
};

const getSignedHeaders = (reqHeaders: Headers) => {
  const sortedHeaders = getSortedHeaders(reqHeaders, SUPPORTED_HEADERS);

  return sortedHeaders.join(';');
};

export const getAuthorizationAuthTypeV1 = (reqMeta: Partial<ReqMeta>, privateKey: string) => {
  const reqHeaders = newRequestHeadersByMeta(reqMeta);

  const canonicalHeaders = getCanonicalHeaders(reqMeta, reqHeaders);

  const signedHeaders = getSignedHeaders(reqHeaders);

  const canonicalRequestArr = [
    reqMeta.method!,
    reqMeta.url?.path,
    reqMeta.url?.query,
    canonicalHeaders,
    signedHeaders,
  ];

  const canonicalRequest = canonicalRequestArr.join('\n');
  // console.log('canonicalRequest', canonicalRequest);

  const unsignedMsg = getMsgToSign(utf8ToBytes(canonicalRequest));
  const sig = secpSign(unsignedMsg, privateKey);

  const authorization = `authTypeV1 ECDSA-secp256k1,  SignedMsg=${hexlify(
    Buffer.from(unsignedMsg),
  ).slice(2)}, Signature=${sig.slice(2)}`;
  return authorization;
};

const newRequestHeadersByMeta = (meta: Partial<ReqMeta>) => {
  const headers = new Headers();

  // console.log('meta', meta);
  if (meta.contentType) {
    headers.set(HTTPHeaderContentType, meta.contentType);
  } else {
    headers.set(HTTPHeaderContentType, 'application/octet-stream');
  }

  if (meta.contentSHA256) {
    headers.set(HTTPHeaderContentSHA256, meta.contentSHA256);
  }

  if (meta.txnMsg) {
    headers.set(HTTPHeaderUnsignedMsg, meta.txnMsg);
  }

  headers.set(HTTPHeaderDate, meta.date!);

  return headers;
};

export const getAuthorizationAuthTypeV2 = () => {
  const signature = MOCK_SIGNATURE;
  const authorization = `authTypeV2 ECDSA-secp256k1, Signature=${signature}`;

  return authorization;
};

const HTTPHeaderContentSHA256 = 'X-Gnfd-Content-Sha256'.toLocaleLowerCase();
const HTTPHeaderTransactionHash = 'X-Gnfd-Txn-Hash'.toLocaleLowerCase();
const HTTPHeaderObjectID = 'X-Gnfd-Object-ID'.toLocaleLowerCase();
const HTTPHeaderRedundancyIndex = 'X-Gnfd-Redundancy-Index'.toLocaleLowerCase();
const HTTPHeaderResource = 'X-Gnfd-Resource'.toLocaleLowerCase();
const HTTPHeaderDate = 'X-Gnfd-Date'.toLocaleLowerCase();
const HTTPHeaderRange = 'Range'.toLocaleLowerCase();
const HTTPHeaderPieceIndex = 'X-Gnfd-Piece-Index'.toLocaleLowerCase();
const HTTPHeaderContentType = 'Content-Type'.toLocaleLowerCase();
const HTTPHeaderContentMD5 = 'Content-MD5'.toLocaleLowerCase();
const HTTPHeaderUnsignedMsg = 'X-Gnfd-Unsigned-Msg'.toLocaleLowerCase();
const HTTPHeaderUserAddress = 'X-Gnfd-User-Address'.toLocaleLowerCase();

const SUPPORTED_HEADERS = [
  HTTPHeaderContentSHA256,
  HTTPHeaderTransactionHash,
  HTTPHeaderObjectID,
  HTTPHeaderRedundancyIndex,
  HTTPHeaderResource,
  HTTPHeaderDate,
  HTTPHeaderRange,
  HTTPHeaderPieceIndex,
  HTTPHeaderContentType,
  HTTPHeaderContentMD5,
  HTTPHeaderUnsignedMsg,
  HTTPHeaderUserAddress,
];

const secpSign = (digestBz: Uint8Array, privateKey: string) => {
  const signingKey = new SigningKey(privateKey);
  const signature = signingKey.signDigest(digestBz);
  let res = joinSignature(signature);

  const v = res.slice(-2);
  if (v === '1c') res = res.slice(0, -2) + '01';
  if (v === '1b') res = res.slice(0, -2) + '00';

  return res;
};

const getMsgToSign = (unsignedBytes: Uint8Array): Uint8Array => {
  const signBytes = sha256(unsignedBytes);
  const res = keccak256(signBytes);
  return res;
};

export interface ReqMeta {
  method: typeof METHOD_GET | typeof METHOD_POST;
  contentType: string;
  url: {
    hostname: string;
    query: string;
    path: string;
  };
  date: string;
  contentSHA256: string;
  txnMsg: string;
}
