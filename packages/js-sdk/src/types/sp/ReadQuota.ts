export type ReadQuotaRequest = {
  bucketName: string;
  endpoint?: string;
  duration?: number;
  year?: number;
  month?: number;
};

export interface ReadQuotaResponse {
  GetReadQuotaResult: {
    BucketName: string;
    BucketID: string;
    ReadQuotaSize: number;
    SPFreeReadQuotaSize: number;
    ReadConsumedSize: number;
    FreeConsumedSize: number;
  };
}

export interface IQuotaProps {
  readQuota: number;
  freeQuota: number;
  consumedQuota: number;
  freeConsumedSize: number;
}
