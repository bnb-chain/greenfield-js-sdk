import { DelegatedOpts } from './Common';

export type DelegatedCreateFolderRequest = {
  bucketName: string;
  objectName: string;
  delegatedOpts: DelegatedOpts;
  endpoint?: string;
  timeout?: number;
};

export interface DelegateCreateFolderRepsonse {
  CreateHash: {
    TxHash: string;
  };
}
