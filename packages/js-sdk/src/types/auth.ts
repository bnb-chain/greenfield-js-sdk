import { METHOD_GET, METHOD_POST, METHOD_PUT } from '@/constants/http';

/**
 * ECDSA Signature
 */
export type ECDSA = {
  type: 'ECDSA';
  privateKey: string;
};
/**
 * EDDSA Signature
 */
export type EDDSA = {
  type: 'EDDSA';
  seed: string;
  domain: string;
  address: string;
};
export type AuthType = ECDSA | EDDSA;

export interface ReqMeta {
  method: typeof METHOD_GET | typeof METHOD_POST | typeof METHOD_PUT;
  contentType: string;
  url: {
    hostname: string;
    path: string;
    query: string;
  };
  date: Date;
  expiryTimestamp: Date;
  contentSHA256: string;
  unsignMsg: string;
  txnHash: string;
  userAddress: string;
}
