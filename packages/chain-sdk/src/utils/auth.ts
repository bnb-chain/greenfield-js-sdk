import { bufferToHex } from '@ethereumjs/util';
import { Headers } from 'cross-fetch';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
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

  // const xx = signedHeaders.sort(function (a, b) {
  //   return a - b;
  // });

  // console.log('signedHeaders -----', signedHeaders, sortBy(signedHeaders, 'toLowerCase'));

  return signedHeaders.sort();
};

export const getCanonicalRequest = (url: URL) => {
  const res = ['GET', '/greenfield/admin/v1/get-approval', 'action=CreateBucket'];

  // const headers = newHeaders(contentType);
  // const rawQuery = getRawQuery(url.searchParams);
  // const canonicalHeaders = getCanonicalHeaders(url, SUPPORTED_HEADERS);
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

  // match TestSig
  // const foo = utf8ToBytes('hello world');
  // const unsignedMsg2 = getMsgToSign(foo);
  // console.log('unsignedMsg2', bufferToHex(Buffer.from(unsignedMsg2)));
  // const sig2 = secpSign(unsignedMsg2, privateKey);
  // console.log('sig2', bufferToHex(Buffer.from(sig2)));

  // console.log(utf8ToBytes('hello world'));
  // console.log(secpSign(utf8ToBytes('hello world'), privateKey));

  // go match TestSig333
  // const bytess = hexToBytes('0x0d8d36affb2fb903d3b7099b32a7b974bed99ec16b1009477f324e980e92694f')
  // console.log('bytess', secpSign(bytess, privateKey));

  const authorization = `authTypeV1 ECDSA-secp256k1,  SignedMsg=${bufferToHex(
    Buffer.from(unsignedMsg),
  ).slice(2)}, Signature=${bufferToHex(Buffer.from(sig)).slice(2)}`;

  // console.log('authorization', authorization);
  return authorization;

  // return authorization;
  // + string - to - sign + ':' + Signature;
  // string-to-sign = crypto.Keccak256(sha256(canonical request)
  // Signature = privateKey.secp256k1-Sign(string-to-sign)
  // Authorization: authTypeV1 ECDSA-secp256k1, SignedMsg=70d03c8d65eb304fefc6d358168db4cfe9305a82dae54bb6a8dc4fbfa7461ca2, Signature=53e2f098411c5df46b71111337a5cf48bf254ba4a8516996445626619c4f10ac57a5ba081154272ed9e0334a338db39bf74f6de0f3c252fd27890fb81cffd29d00
};

const newRequestHeadersByMeta = (meta: Partial<ReqMeta>) => {
  const headers = new Headers();

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
  if (digestBz.length !== 32) {
    digestBz = keccak256(digestBz);
  }
  const sig = secp256k1.sign(digestBz, privateKey.slice(2));
  return sig.toCompactHex();
};

const getMsgToSign = (unsignedBytes: Uint8Array): Uint8Array => {
  const signBytes = sha256(unsignedBytes);
  return keccak256(signBytes);
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
