import { VisibilityType } from '../common';

export type PutObjectRequest = {
  bucketName: string;
  objectName: string;
  txnHash?: string;
  body: File;
  duration?: number;
  endpoint?: string;
  resumableOpts?: ResumableOpts;
};

export type DelegatedPubObjectRequest = {
  bucketName: string;
  objectName: string;
  body: File;
  delegatedOpts: DelegatedOpts;
  endpoint?: string;
  timeout?: number;
  contentType?: string;
  resumableOpts?: ResumableOpts;
};

export type DelegatedOpts = {
  visibility: VisibilityType;
  isUpdate?: boolean;
};

export type ResumableOpts = {
  disableResumable: boolean;
  partSize?: number;
};
