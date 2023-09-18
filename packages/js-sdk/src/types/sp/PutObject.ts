export type PutObjectRequest = {
  bucketName: string;
  objectName: string;
  txnHash: string;
  body: File;
  duration?: number;
  endpoint?: string;
};
