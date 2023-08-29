import { GetUserBucketsResponse } from '@/types';
import { convertStrToBool } from '@/types/sp-xml/Common';
import xml from 'xml2js';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/get_user_buckets
export const parseGetUserBucketsResponse = async (data: string) => {
  const res = (await xml.parseStringPromise(data, {
    strict: true,
    explicitRoot: true,
    explicitArray: false,
  })) as GetUserBucketsResponse;

  let Buckets = res.GfSpGetUserBucketsResponse.Buckets || [];
  if (Buckets) {
    if (!Array.isArray(Buckets)) {
      Buckets = [Buckets];
    }

    Buckets = Buckets.map((item) => {
      return {
        ...item,
        // @ts-ignore
        Removed: convertStrToBool(item.Removed),
        DeleteAt: Number(item.DeleteAt),
        UpdateAt: Number(item.UpdateAt),
        UpdateTime: Number(item.UpdateTime),
      };
    });
  }

  res.GfSpGetUserBucketsResponse = {
    Buckets,
  };

  return res;
};
