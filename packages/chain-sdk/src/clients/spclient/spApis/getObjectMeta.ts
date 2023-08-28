import { formatObjectInfo } from '@/types';
import { GetObjectMetaResponse } from '@/types/sp-xml/GetObjectMetaResponse';
import xml from 'xml2js';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/get_object_meta
export const parseGetObjectMetaResponse = async (data: string) => {
  const res = (await xml.parseStringPromise(data, {
    strict: true,
    explicitRoot: true,
    explicitArray: false,
  })) as GetObjectMetaResponse;

  const Object = res.GfSpGetObjectMetaResponse.Object || {};
  if (Object) {
    Object.Removed = Boolean(Object.Removed);
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
