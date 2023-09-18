export interface RequestNonceRequest {
  spEndpoint: string;
  spAddress: string;
  address: string;
  domain: string;
  spName?: string;
}

export interface RequestNonceResponse {
  RequestNonceResp: {
    CurrentNonce: number;
    CurrentPublicKey: string;
    ExpiryDate: string;
    NextNonce: number;
  };
}
