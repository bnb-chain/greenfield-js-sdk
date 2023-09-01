import { METHOD_GET, METHOD_POST, METHOD_PUT } from '@/constants/http';

export interface ReqMeta {
  method: typeof METHOD_GET | typeof METHOD_POST | typeof METHOD_PUT;
  contentType: string;
  url: {
    hostname: string;
    path: string;
    query: string;
  };
  date: string;
  expiryTimestamp: string;
  contentSHA256: string;
  unsignMsg: string;
  txnHash: string;
}
