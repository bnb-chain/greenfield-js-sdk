import { convertStrToBool, formatObjectInfo } from '@/types/sp/Common';
import { GetObjectMetaRequest, GetObjectMetaResponse } from '@/types/sp/GetObjectMeta';
import { generateUrlByBucketName } from '@/utils/s3';
import { XMLParser } from 'fast-xml-parser';
import { encodePath, getSortQueryParams } from '../auth';
import type { SPMetaInfo } from './metaInfos';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest/get_object_meta
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

  const Object = res.GfSpGetObjectMetaResponse.Object || {};
  if (Object) {
    // @ts-ignore
    Object.Removed = convertStrToBool(Object.Removed);
    Object.UpdateAt = Number(Object.UpdateAt);
    Object.DeleteAt = Number(Object.DeleteAt);

    Object.ObjectInfo = formatObjectInfo(Object.ObjectInfo);
  }

  res.GfSpGetObjectMetaResponse = {
    ...res.GfSpGetObjectMetaResponse,
    Object,
  };

  return res;
};
