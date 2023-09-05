import { ListBucketsByIDsRequest, ListBucketsByIDsResponse } from '@/types';
import { convertStrToBool, formatBucketInfo } from '@/types/sp/Common';
import { XMLParser } from 'fast-xml-parser';
import { getSortQueryParams } from '../auth';
import { SPMetaInfo } from './metaInfos';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest/list_buckets_by_ids
export const getListBucketsByIDsMetaInfo = (
  endpoint: string,
  params: ListBucketsByIDsRequest,
): Pick<SPMetaInfo, 'url'> => {
  const path = '/';
  const queryMap = {
    ids: params.ids.join(','),
    'buckets-query': 'null',
  };

  let url = new URL(path, endpoint);
  url = getSortQueryParams(url, queryMap);

  return {
    url: url.href,
  };
};

export const parseListBucketsByIdsResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as ListBucketsByIDsResponse;

  let BucketEntry = res.GfSpListBucketsByIDsResponse.BucketEntry || [];
  if (BucketEntry) {
    if (!Array.isArray(BucketEntry)) {
      BucketEntry = [BucketEntry];
    }

    BucketEntry = BucketEntry.map((item) => {
      let Value = item.Value;
      if (Value) {
        Value = {
          ...item.Value,
          BucketInfo: formatBucketInfo(item.Value.BucketInfo),
          // @ts-ignore
          Removed: convertStrToBool(item.Value.Removed),
          UpdateAt: Number(item.Value.UpdateAt),
          DeleteAt: Number(item.Value.DeleteAt),
        };
      }

      return {
        ...item,
        Id: Number(item.Id),
        Value,
      };
    });
  }

  res.GfSpListBucketsByIDsResponse = {
    ...res.GfSpListBucketsByIDsResponse,
    BucketEntry,
  };

  return res;
};
