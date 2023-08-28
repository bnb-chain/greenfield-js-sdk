import {
  formatObjectInfo,
  ListObjectsByBucketNameResponse,
} from '@/types/sp-xml/ListObjectsByBucketNameResponse';
import xml from 'xml2js';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/list_objects_by_bucket
export const parseListObjectsByBucketNameResponse = async (data: string) => {
  const res = (await xml.parseStringPromise(data, {
    strict: true,
    explicitRoot: true,
    explicitArray: false,
  })) as ListObjectsByBucketNameResponse;

  let Objects = res.GfSpListObjectsByBucketNameResponse.Objects || [];
  if (Objects) {
    if (!Array.isArray(Objects)) {
      Objects = [Objects];
    }

    Objects = Objects.map((item) => {
      return {
        ...item,
        Removed: Boolean(item.Removed),
        UpdateAt: Number(item.UpdateAt),
        DeleteAt: Number(item.DeleteAt),
        ObjectInfo: formatObjectInfo(item.ObjectInfo),
      };
    });
  }

  const CommonPrefixes = res.GfSpListObjectsByBucketNameResponse.CommonPrefixes || [];

  res.GfSpListObjectsByBucketNameResponse = {
    ...res.GfSpListObjectsByBucketNameResponse,
    Objects,
    CommonPrefixes,
    IsTruncated: Boolean(res.GfSpListObjectsByBucketNameResponse.IsTruncated),
  };

  return res;
};
