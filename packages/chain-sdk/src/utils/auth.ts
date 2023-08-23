import { AuthType } from '@/api/spclient';
import { signSignatureByEddsa } from '@/offchainauth';
import { ReqMeta } from '@/types/auth';
import { hexlify, joinSignature } from '@ethersproject/bytes';
import { SigningKey } from '@ethersproject/signing-key';
import { Headers } from 'cross-fetch';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { utf8ToBytes } from 'ethereum-cryptography/utils.js';

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

export const getAuthorization = async (
  reqMeta: Partial<ReqMeta>,
  reqHeaders: Headers,
  authType: AuthType,
) => {
  const canonicalHeaders = getCanonicalHeaders(reqMeta, reqHeaders);
  const signedHeaders = getSignedHeaders(reqHeaders);

  const canonicalRequestArr = [
    reqMeta.method,
    reqMeta.url?.path,
    reqMeta.url?.query,
    canonicalHeaders,
    signedHeaders,
  ];

  const canonicalRequest = canonicalRequestArr.join('\n');
  // console.log('canonicalRequest', canonicalRequest);

  const unsignedMsg = getMsgToSign(utf8ToBytes(canonicalRequest));
  let authorization = '';
  if (authType.type === 'ECDSA') {
    const sig = secpSign(unsignedMsg, authType.privateKey);
    authorization = `GNFD1-ECDSA, Signature=${sig.slice(2)}`;
  } else {
    const sig = await signSignatureByEddsa(authType.seed, hexlify(unsignedMsg).slice(2));
    authorization = `GNFD1-EDDSA,Signature=${sig}`;
  }

  // console.log('authorization', authorization);
  return authorization;
};

export const newRequestHeadersByMeta = (meta: Partial<ReqMeta>) => {
  const headers = new Headers();
  // console.log('meta', meta);
  if (meta.contentType) {
    headers.set(HTTPHeaderContentType, meta.contentType);
  }

  if (meta.txnHash && meta.txnHash !== '') {
    headers.set(HTTPHeaderTransactionHash, meta.txnHash);
  }

  if (meta.contentSHA256) {
    headers.set(HTTPHeaderContentSHA256, meta.contentSHA256);
  }

  if (meta.txnMsg) {
    headers.set(HTTPHeaderUnsignedMsg, meta.txnMsg);
  }

  const date = new Date();
  // console.log('date', formatDate(date));
  headers.set(HTTPHeaderDate, formatDate(date));

  // date.setSeconds(date.getSeconds() + 1000);
  date.setDate(date.getDate() + 6);
  headers.set(HTTPHeaderExpiryTimestamp, formatDate(date));

  return headers;
};

function formatDate(date: Date): string {
  const res = date.toISOString();
  return res.replace(/\.\d{3}/gi, '');
}

const HTTPHeaderContentSHA256 = 'X-Gnfd-Content-Sha256'.toLocaleLowerCase();
const HTTPHeaderTransactionHash = 'X-Gnfd-Txn-Hash'.toLocaleLowerCase();
const HTTPHeaderObjectID = 'X-Gnfd-Object-ID'.toLocaleLowerCase();
const HTTPHeaderRedundancyIndex = 'X-Gnfd-Redundancy-Index'.toLocaleLowerCase();
const HTTPHeaderResource = 'X-Gnfd-Resource'.toLocaleLowerCase();
const HTTPHeaderDate = 'X-Gnfd-Date'.toLocaleLowerCase();
const HTTPHeaderExpiryTimestamp = 'X-Gnfd-Expiry-Timestamp'.toLocaleLowerCase();
const HTTPHeaderRange = 'Range'.toLocaleLowerCase();
const HTTPHeaderPieceIndex = 'X-Gnfd-Piece-Index'.toLocaleLowerCase();
const HTTPHeaderContentType = 'Content-Type'.toLocaleLowerCase();
const HTTPHeaderContentMD5 = 'Content-MD5'.toLocaleLowerCase();
const HTTPHeaderUnsignedMsg = 'X-Gnfd-Unsigned-Msg'.toLocaleLowerCase();
const HTTPHeaderUserAddress = 'X-Gnfd-User-Address'.toLocaleLowerCase();
const HTTPHeaderAppDomain = 'X-Gnfd-App-Domain'.toLocaleLowerCase();

const SUPPORTED_HEADERS = [
  HTTPHeaderContentSHA256,
  HTTPHeaderTransactionHash,
  HTTPHeaderObjectID,
  HTTPHeaderRedundancyIndex,
  HTTPHeaderResource,
  HTTPHeaderDate,
  HTTPHeaderExpiryTimestamp,
  HTTPHeaderRange,
  HTTPHeaderPieceIndex,
  HTTPHeaderContentType,
  HTTPHeaderContentMD5,
  HTTPHeaderUnsignedMsg,
  HTTPHeaderUserAddress,
  // HTTPHeaderAppDomain,
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

export const getMsgToSign = (unsignedBytes: Uint8Array): Uint8Array => {
  // const signBytes = sha256(unsignedBytes);
  const res = keccak256(unsignedBytes);
  return res;

  // const signBytes = sha256(unsignedBytes);
  // const res = keccak256(signBytes);
  // return res;
};
