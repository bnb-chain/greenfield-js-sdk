import { GetBucketMetaResponse } from '@/types';
import { formatBucketInfo } from '@/types/sp-xml/Common';
import { XMLParser } from 'fast-xml-parser';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/get_bucket_meta
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
