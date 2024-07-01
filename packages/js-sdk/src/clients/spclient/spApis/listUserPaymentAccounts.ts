import { EMPTY_STRING_SHA256, METHOD_GET } from '@/constants';
import { ReqMeta } from '@/types';
import { convertStrToBool } from '@/types/sp/Common';
import {
  ListUserPaymentAccountsResponse,
  ListUserPaymentAccountsResquest,
} from '@/types/sp/ListUserPaymentAccounts';
import { XMLParser } from 'fast-xml-parser';
import { getSortQuery, getSortQueryParams } from '../auth';

// https://github.com/bnb-chain/greenfield-storage-provider/blob/master/docs/storage-provider-rest-api/list_user_payment_accounts.md
export const getListUserPaymentAccountMetaInfo = (
  endpoint: string,
  params: ListUserPaymentAccountsResquest,
) => {
  const path = '/';
  const queryMap = {
    'user-payments': 'null',
  };
  const query = getSortQuery(queryMap);
  let url = new URL(path, endpoint);
  url = getSortQueryParams(url, queryMap);

  const reqMeta: Partial<ReqMeta> = {
    contentSHA256: EMPTY_STRING_SHA256,
    method: METHOD_GET,
    url: {
      hostname: new URL(url).hostname,
      query,
      path,
    },
    userAddress: params.account,
  };

  const optionsWithOutHeaders: Omit<RequestInit, 'headers'> = {
    method: METHOD_GET,
  };

  return {
    url: url.href,
    optionsWithOutHeaders,
    reqMeta,
  };
};

export const parseListUserPaymentAccountResponse = (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as ListUserPaymentAccountsResponse;

  let PaymentAccounts = res.GfSpListUserPaymentAccountsResponse.PaymentAccounts || [];

  if (PaymentAccounts) {
    if (!Array.isArray(PaymentAccounts)) {
      PaymentAccounts = [PaymentAccounts];
    }

    PaymentAccounts = PaymentAccounts.map((item) => {
      item.PaymentAccount = {
        ...item.PaymentAccount,
        // @ts-ignore
        Refundable: convertStrToBool(item.PaymentAccount.Refundable),
        UpdateAt: Number(item.PaymentAccount.UpdateAt),
        UpdateTime: Number(item.PaymentAccount.UpdateTime),
      };

      return item;
    });
  }

  res.GfSpListUserPaymentAccountsResponse.PaymentAccounts = PaymentAccounts;

  return res;
};
