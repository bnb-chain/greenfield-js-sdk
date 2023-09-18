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
