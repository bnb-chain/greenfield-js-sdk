import { EMPTY_STRING_SHA256, METHOD_GET } from '@/constants';
import { ReqMeta } from '@/types';
import {
  ListUserPaymentAccountsResponse,
  ListUserPaymentAccountsResquest,
} from '@/types/sp/ListUserPaymentAccounts';
import { XMLParser } from 'fast-xml-parser';
import { getSortQuery, getSortQueryParams } from '../auth';

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

  let StreamRecords = res.GfSpListUserPaymentAccountsResponse.StreamRecords || [];

  if (StreamRecords) {
    if (!Array.isArray(StreamRecords)) {
      StreamRecords = [StreamRecords];
    }
  }

  res.GfSpListUserPaymentAccountsResponse.StreamRecords = StreamRecords;

  return res;
};
