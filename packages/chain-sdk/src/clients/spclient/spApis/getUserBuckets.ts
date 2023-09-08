import type { GetUserBucketsResponse } from '@/types';
import { convertStrToBool, formatBucketInfo, formatVGF } from '@/types/sp/Common';
import { XMLParser } from 'fast-xml-parser';
import { SPMetaInfo } from './metaInfos';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest/get_user_buckets
export const getUserBucketMetaInfo = (endpoint: string): Pick<SPMetaInfo, 'url'> => {
  return {
    url: endpoint,
  };
};

export const parseGetUserBucketsResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as GetUserBucketsResponse;

  let Buckets = res.GfSpGetUserBucketsResponse.Buckets || [];
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
        Vgf: formatVGF(item.Vgf),
      };
    });
  }

  res.GfSpGetUserBucketsResponse = {
    Buckets,
  };

  return res;
};
