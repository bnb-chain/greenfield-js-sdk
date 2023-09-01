import { convertStrToBool, formatObjectInfo } from '@/types/sp/Common';
import { GetObjectMetaResponse } from '@/types/sp/GetObjectMeta';
import { XMLParser } from 'fast-xml-parser';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/get_object_meta
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
