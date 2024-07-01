import { convertStrToBool, formatObjectInfo } from '@/types/sp/Common';
import { GetObjectMetaRequest, GetObjectMetaResponse } from '@/types/sp/GetObjectMeta';
import { generateUrlByBucketName } from '@/utils/asserts/s3';
import { XMLParser } from 'fast-xml-parser';
import { encodePath, getSortQueryParams } from '../auth';
import type { SPMetaInfo } from './metaInfos';

// https://github.com/bnb-chain/greenfield-storage-provider/blob/master/docs/storage-provider-rest-api/get_object_meta.md
export const getObjectMetaInfo = (
  endpoint: string,
  params: GetObjectMetaRequest,
): Pick<SPMetaInfo, 'url'> => {
  const { objectName, bucketName } = params;

  const path = `${encodePath(objectName)}`;
  const queryMap = {
    'object-meta': '',
  };

  let url = new URL(path, generateUrlByBucketName(endpoint, bucketName));
  url = getSortQueryParams(url, queryMap);

  return {
    url: url.href,
  };
};

export const parseGetObjectMetaResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as GetObjectMetaResponse;

  const ObjectTmp = res.GfSpGetObjectMetaResponse.Object || {};
  if (ObjectTmp) {
    // @ts-ignore
    ObjectTmp.Removed = convertStrToBool(ObjectTmp.Removed);
    ObjectTmp.UpdateAt = Number(ObjectTmp.UpdateAt);
    ObjectTmp.DeleteAt = Number(ObjectTmp.DeleteAt);

    ObjectTmp.ObjectInfo = formatObjectInfo(ObjectTmp.ObjectInfo);
  }

  res.GfSpGetObjectMetaResponse = {
    ...res.GfSpGetObjectMetaResponse,
    Object: ObjectTmp,
  };

  return res;
};
