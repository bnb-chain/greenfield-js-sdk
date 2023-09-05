import { convertStrToBool, formatObjectInfo } from '@/types/sp/Common';
import { ListObjectsByBucketNameResponse } from '@/types/sp/ListObjectsByBucketName';
import { XMLParser } from 'fast-xml-parser';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest/list_objects_by_bucket
export const parseListObjectsByBucketNameResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as ListObjectsByBucketNameResponse;

  let Objects = res.GfSpListObjectsByBucketNameResponse.Objects || [];
  if (Objects) {
    if (!Array.isArray(Objects)) {
      Objects = [Objects];
    }

    Objects = Objects.map((item) => {
      return {
        ...item,
        // @ts-ignore
        Removed: convertStrToBool(item.Removed),
        UpdateAt: Number(item.UpdateAt),
        DeleteAt: Number(item.DeleteAt),
        ObjectInfo: formatObjectInfo(item.ObjectInfo),
      };
    });
  }

  let CommonPrefixes = res.GfSpListObjectsByBucketNameResponse.CommonPrefixes || [];
  if (CommonPrefixes) {
    if (!Array.isArray(CommonPrefixes)) {
      CommonPrefixes = [CommonPrefixes];
    }
  }

  res.GfSpListObjectsByBucketNameResponse = {
    ...res.GfSpListObjectsByBucketNameResponse,
    Objects,
    CommonPrefixes,
    // @ts-ignore
    IsTruncated: convertStrToBool(res.GfSpListObjectsByBucketNameResponse.IsTruncated),
  };

  return res;
};
