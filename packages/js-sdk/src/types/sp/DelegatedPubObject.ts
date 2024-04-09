import { DelegatedOpts, ResumableOpts } from './Common';

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
