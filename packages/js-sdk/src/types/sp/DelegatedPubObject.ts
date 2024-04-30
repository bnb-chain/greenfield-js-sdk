import { OnProgress } from '../common';
import { DelegatedOpts, ResumableOpts, UploadFile } from './Common';

export type DelegatedPubObjectRequest = {
  bucketName: string;
  objectName: string;
  body: UploadFile;
  delegatedOpts: DelegatedOpts;
  endpoint?: string;
  timeout?: number;
  contentType?: string;
  resumableOpts?: ResumableOpts;
  onProgress?: OnProgress;
};
