import { METHOD_GET, METHOD_POST, METHOD_PUT } from '@/constants/http';

export interface ReqMeta {
  method: typeof METHOD_GET | typeof METHOD_POST | typeof METHOD_PUT;
  bucketName: string;
  objectName: string;
  contentType: string;
  url: {
    hostname: string;
    query: string;
    path: string;
  };
  // date: string;
  contentSHA256: string;
  txnMsg: string;
  txnHash: string;
}
