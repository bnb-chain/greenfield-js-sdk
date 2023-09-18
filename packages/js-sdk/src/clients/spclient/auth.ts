import { signSignatureByEddsa } from '@/offchainauth';
import { ReqMeta } from '@/types/auth';
import { hexlify, joinSignature } from '@ethersproject/bytes';
import { SigningKey } from '@ethersproject/signing-key';
import { Headers } from 'cross-fetch';
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { utf8ToBytes } from 'ethereum-cryptography/utils.js';
import { AuthType } from './spClient';

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

  return authorization;
};

export const newRequestHeadersByMeta = (meta: Partial<ReqMeta>) => {
  const headers = new Headers();
  if (meta.contentType) {
    headers.set(HTTPHeaderContentType.toLocaleLowerCase(), meta.contentType);
  }

  if (meta.txnHash && meta.txnHash !== '') {
    headers.set(HTTPHeaderTransactionHash.toLocaleLowerCase(), meta.txnHash);
  }

  if (meta.contentSHA256) {
    headers.set(HTTPHeaderContentSHA256.toLocaleLowerCase(), meta.contentSHA256);
  }

  if (meta.unsignMsg) {
    headers.set(HTTPHeaderUnsignedMsg.toLocaleLowerCase(), meta.unsignMsg);
  }

  if (meta.userAddress) {
    headers.set(HTTPHeaderUserAddress, meta.userAddress);
  }

  const date = new Date();
  if (meta.date) {
    headers.set(HTTPHeaderDate.toLocaleLowerCase(), formatDate(meta.date));
  } else {
    headers.set(HTTPHeaderDate.toLocaleLowerCase(), formatDate(date));
  }

  if (meta.expiryTimestamp) {
    headers.set(HTTPHeaderExpiryTimestamp.toLocaleLowerCase(), formatDate(meta.expiryTimestamp));
  } else {
    date.setHours(date.getHours() + 2);
    headers.set(HTTPHeaderExpiryTimestamp.toLocaleLowerCase(), formatDate(date));
  }

  return headers;
};

function formatDate(date: Date): string {
  const res = date.toISOString();
  return res.replace(/\.\d{3}/gi, '');
}

export const HTTPHeaderAuthorization = 'Authorization';
export const HTTPHeaderContentSHA256 = 'X-Gnfd-Content-Sha256';
export const HTTPHeaderTransactionHash = 'X-Gnfd-Txn-Hash';
export const HTTPHeaderObjectID = 'X-Gnfd-Object-ID';
export const HTTPHeaderRedundancyIndex = 'X-Gnfd-Redundancy-Index';
export const HTTPHeaderResource = 'X-Gnfd-Resource';
export const HTTPHeaderDate = 'X-Gnfd-Date';
export const HTTPHeaderExpiryTimestamp = 'X-Gnfd-Expiry-Timestamp';
export const HTTPHeaderRange = 'Range';
export const HTTPHeaderPieceIndex = 'X-Gnfd-Piece-Index';
export const HTTPHeaderContentType = 'Content-Type';
export const HTTPHeaderContentMD5 = 'Content-MD5';
export const HTTPHeaderUnsignedMsg = 'X-Gnfd-Unsigned-Msg';
export const HTTPHeaderUserAddress = 'X-Gnfd-User-Address';
export const HTTPHeaderAppDomain = 'X-Gnfd-App-Domain';

const SUPPORTED_HEADERS = [
  HTTPHeaderContentSHA256.toLocaleLowerCase(),
  HTTPHeaderTransactionHash.toLocaleLowerCase(),
  HTTPHeaderObjectID.toLocaleLowerCase(),
  HTTPHeaderRedundancyIndex.toLocaleLowerCase(),
  HTTPHeaderResource.toLocaleLowerCase(),
  HTTPHeaderDate.toLocaleLowerCase(),
  HTTPHeaderExpiryTimestamp.toLocaleLowerCase(),
  HTTPHeaderRange.toLocaleLowerCase(),
  HTTPHeaderPieceIndex.toLocaleLowerCase(),
  HTTPHeaderContentType.toLocaleLowerCase(),
  HTTPHeaderContentMD5.toLocaleLowerCase(),
  HTTPHeaderUnsignedMsg.toLocaleLowerCase(),
  HTTPHeaderUserAddress.toLocaleLowerCase(),
  // HTTPHeaderAppDomain.toLocaleLowerCase(),
];

// https://github.com/ethers-io/ethers.js/discussions/4339
export const secpSign = (digestBz: Uint8Array, privateKey: string) => {
  const signingKey = new SigningKey(privateKey);
  const signature = signingKey.signDigest(digestBz);
  let res = joinSignature(signature);

  const v = res.slice(-2);
  if (v === '1c') res = res.slice(0, -2) + '01';
  if (v === '1b') res = res.slice(0, -2) + '00';

  return res;
};

export const getMsgToSign = (unsignedBytes: Uint8Array): Uint8Array => {
  const res = keccak256(unsignedBytes);
  return res;
};

export const encodePath = (pathName: string) => {
  const reservedNames = /^[a-zA-Z0-9-_.~/]+$/;
  if (reservedNames.test(pathName)) {
    return pathName;
  }

  let encodedPathName = '';
  for (let i = 0; i < pathName.length; i++) {
    const s = pathName[i];

    // soft characters
    if (('A' <= s && s <= 'Z') || ('a' <= s && s <= 'z') || ('0' <= s && s <= '9')) {
      encodedPathName += s;
      continue;
    }

    switch (s) {
      // special characters are allowed
      case '-':
      case '_':
      case '.':
      case '~':
      case '/':
        encodedPathName += s;
        continue;

      // others characters need to be encoded
      default:
        // . ! @ # $ % ^ & * ) ( - + = { } [ ] / " , ' < > ~ \ .` ? : ; | \\
        if (/[.!@#\$%\^&\*\)\(\-+=\{\}\[\]\/\",'<>~\·`\?:;|\\]+$/.test(s)) {
          // english characters
          const hexStr = s.charCodeAt(0).toString(16);
          encodedPathName += '%' + hexStr.toUpperCase();
        } else {
          // others characters
          encodedPathName += encodeURI(s);
        }
    }
  }
  return encodedPathName;
};

export const getSortQuery = (queryMap: Record<string, string>) => {
  const queryParams = new URLSearchParams();
  for (const k in queryMap) {
    queryParams.append(k, queryMap[k]);
  }
  queryParams.sort();

  return queryParams.toString();
};

export const getSortQueryParams = (url: URL, queryMap: Record<string, string>) => {
  // const queryParams = new URLSearchParams();
  for (const k in queryMap) {
    url.searchParams.append(k, queryMap[k]);
  }
  url.searchParams.sort();

  return url;
};
