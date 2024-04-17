import { BucketMeta } from './Common';

export type ListBucketsByPaymentAccountRequest = {
  paymentAccount: string;
  endpoint?: string;
};

export interface ListBucketsByPaymentAccountResponse {
  GfSpListPaymentAccountStreamsResponse: GfSPListPaymentAccountStreamsResponse;
}

export interface GfSPListPaymentAccountStreamsResponse {
  Buckets: BucketMeta[];
}
