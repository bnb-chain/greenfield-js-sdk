import { convertStrToBool, formatObjectInfo } from '@/types/sp/Common';
import { ListObjectsByBucketNameResponse } from '@/types/sp/ListObjectsByBucketName';
import { XMLParser } from 'fast-xml-parser';

// https://github.com/bnb-chain/greenfield-storage-provider/blob/master/docs/storage-provider-rest-api/list_objects_by_bucket.md
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
