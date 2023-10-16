import { StreamRecord } from './Common';

export type ListUserPaymentAccountsResquest = {
  account: string;
};

export type ListUserPaymentAccountsResponse = {
  GfSpListUserPaymentAccountsResponse: GfSPListUserPaymentAccountsResponse;
};

export type PaymentAccount = {
  Address: string;
  Owner: string;
  Refundable: boolean;
  UpdateAt: number;
  UpdateTime: number;
};

export interface GfSPListUserPaymentAccountsResponse {
  PaymentAccounts: {
    PaymentAccount: PaymentAccount;
    StreamRecord: StreamRecord;
  }[];
}
