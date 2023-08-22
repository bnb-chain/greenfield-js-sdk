export interface RequestErrorResponse {
  Error: {
    Code: string;
    Message: string;
  };
}

export interface RequestNonceResponse {
  RequestNonceResp: {
    CurrentNonce: number;
    CurrentPublicKey: string;
    ExpiryDate: string;
    NextNonce: number;
  };
}

export interface ReadQuotaResponse {
  GetReadQuotaResult: {
    BucketID: number;
    BucketName: string;
    ReadConsumedSize: number;
    ReadQuotaSize: number;
    SPFreeReadQuotaSize: number;
  };
}
