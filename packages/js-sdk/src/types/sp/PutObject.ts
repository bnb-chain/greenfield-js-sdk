import { OnProgress } from '../common';
import { ResumableOpts, UploadFile } from './Common';

export type PutObjectRequest = {
  endpoint?: string;
  bucketName: string;
  objectName: string;
  body: UploadFile;
  txnHash?: string;
  duration?: number;
  resumableOpts?: ResumableOpts;
  /**
   * resumable upload is not supported `onProgress`
   */
  onProgress?: OnProgress;
};
