export type PutObjectRequest = {
  bucketName: string;
  objectName: string;
  txnHash: string;
  body: File;
  duration?: number;
  endpoint?: string;
  delegated?: boolean;
};

export type DelegatedPubObjectRequest = {
  bucketName: string;
  objectName: string;
  body: File;
  endpoint?: string;
  timeout?: number;
  contentType?: string;
};
