export interface ReadQuotaResponse {
  GetReadQuotaResult: {
    BucketID: number;
    BucketName: string;
    ReadConsumedSize: number;
    ReadQuotaSize: number;
    SPFreeReadQuotaSize: number;
  };
}
