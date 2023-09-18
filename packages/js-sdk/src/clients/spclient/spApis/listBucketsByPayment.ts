import { convertStrToBool, formatBucketInfo } from '@/types/sp/Common';
import {
  ListBucketsByPaymentAccountRequest,
  ListBucketsByPaymentAccountResponse,
} from '@/types/sp/ListBucketsByPaymentAccount';
import { XMLParser } from 'fast-xml-parser';
import { getSortQueryParams } from '../auth';

export const getListBucketByPaymentMetaInfo = (
  endpoint: string,
  params: ListBucketsByPaymentAccountRequest,
) => {
  const path = '/';
  const queryMap = {
    'payment-buckets': 'null',
    'payment-account': params.paymentAccount,
  };

  let url = new URL(path, endpoint);
  url = getSortQueryParams(url, queryMap);

  return {
    url: url.href,
  };
};

export const parseListBucketByPaymentResponse = (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as ListBucketsByPaymentAccountResponse;

  let Buckets = res.GfSpListPaymentAccountStreamsResponse.Buckets || [];
  if (Buckets) {
    if (!Array.isArray(Buckets)) {
      Buckets = [Buckets];
    }

    Buckets = Buckets.map((item) => {
      return {
        ...item,
        BucketInfo: formatBucketInfo(item.BucketInfo),
        // @ts-ignore
        Removed: convertStrToBool(item.Removed),
        DeleteAt: Number(item.DeleteAt),
        UpdateAt: Number(item.UpdateAt),
        UpdateTime: Number(item.UpdateTime),
      };
    });
  }

  res.GfSpListPaymentAccountStreamsResponse = {
    Buckets,
  };

  return res;
};
