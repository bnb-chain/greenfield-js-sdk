import { GetBucketMetaRequest, GetBucketMetaResponse } from '@/types';
import { formatBucketInfo } from '@/types/sp/Common';
import { XMLParser } from 'fast-xml-parser';
import { getSortQueryParams } from '../auth';
import { SPMetaInfo } from './metaInfos';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest/get_bucket_meta
export const getBucketMetaInfo = (
  endpoint: string,
  params: GetBucketMetaRequest,
): Pick<SPMetaInfo, 'url'> => {
  const path = `/${params.bucketName}`;
  const queryMap = {
    'bucket-meta': '',
  };
  let url = new URL(path, endpoint);
  url = getSortQueryParams(url, queryMap);

  return {
    url: url.href,
  };
};

export const parseGetBucketMetaResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as GetBucketMetaResponse;

  res.GfSpGetBucketMetaResponse.Bucket = {
    ...res.GfSpGetBucketMetaResponse.Bucket,
    BucketInfo: formatBucketInfo(res.GfSpGetBucketMetaResponse.Bucket.BucketInfo),
    DeleteAt: Number(res.GfSpGetBucketMetaResponse.Bucket.DeleteAt),
    UpdateAt: Number(res.GfSpGetBucketMetaResponse.Bucket.UpdateAt),
    UpdateTime: Number(res.GfSpGetBucketMetaResponse.Bucket.UpdateTime),
  };

  return res;
};
