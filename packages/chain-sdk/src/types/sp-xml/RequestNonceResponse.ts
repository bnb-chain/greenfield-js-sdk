export interface RequestNonceResponse {
  RequestNonceResp: {
    CurrentNonce: number;
    CurrentPublicKey: string;
    ExpiryDate: string;
    NextNonce: number;
  };
}
