import { StreamRecord } from './Common';

export type ListUserPaymentAccountsResquest = {
  account: string;
};

export type ListUserPaymentAccountsResponse = {
  GfSpListUserPaymentAccountsResponse: GfSPListUserPaymentAccountsResponse;
};

export interface GfSPListUserPaymentAccountsResponse {
  StreamRecords: StreamRecords[];
}

export interface StreamRecords {
  StreamRecord: StreamRecord;
  Refundable: string;
}
