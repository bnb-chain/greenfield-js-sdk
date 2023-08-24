export interface ListObjectsByBucketNameResponse {
  GfSpListObjectsByBucketNameResponse: GfSPListObjectsByBucketNameResponse;
}

export interface GfSPListObjectsByBucketNameResponse {
  Objects: TObject[];
  KeyCount: string;
  MaxKeys: string;
  IsTruncated: string;
  NextContinuationToken: string;
  Name: string;
  Prefix: string;
  Delimiter: string;
  CommonPrefixes: string[];
  ContinuationToken: string;
}

export interface TObject {
  ObjectInfo: ObjectInfo;
  LockedBalance: string;
  Removed: string;
  UpdateAt: string;
  DeleteAt: string;
  DeleteReason: string;
  Operator: string;
  CreateTxHash: string;
  UpdateTxHash: string;
  SealTxHash: string;
}

export interface ObjectInfo {
  Owner: string;
  Creator: string;
  BucketName: string;
  ObjectName: string;
  Id: string;
  LocalVirtualGroupId: string;
  PayloadSize: string;
  Visibility: string;
  ContentType: string;
  CreateAt: string;
  ObjectStatus: string;
  RedundancyType: string;
  SourceType: string;
  Checksums: Checksum[];
}

export enum Checksum {
  D7Dca9013758E3E20E448Eead58D2Eb075Cfd2Af6C8781B650A6Dbd1B6E49481 = 'd7dca9013758e3e20e448eead58d2eb075cfd2af6c8781b650a6dbd1b6e49481',
  F803F1A72B179111F3Bea2203695D1Bacefec4Ef546D4Cdc90F5C252Bcc6F827 = 'f803f1a72b179111f3bea2203695d1bacefec4ef546d4cdc90f5c252bcc6f827',
}
