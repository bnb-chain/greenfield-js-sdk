import { ListObjectsByIDsResponse } from '@/types';
import { formatObjectInfo, convertStrToBool } from '@/types/sp/Common';
import { XMLParser } from 'fast-xml-parser';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/list_objects_by_ids
export const parseListObjectsByIdsResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as ListObjectsByIDsResponse;

  let ObjectEntry = res.GfSpListObjectsByIDsResponse.ObjectEntry;

  if (ObjectEntry) {
    if (!Array.isArray(ObjectEntry)) {
      ObjectEntry = [ObjectEntry];
    }

    ObjectEntry = ObjectEntry.map((item) => {
      let Value = item.Value;
      if (Value) {
        Value = {
          ...item.Value,
          ObjectInfo: formatObjectInfo(item.Value.ObjectInfo),
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

  res.GfSpListObjectsByIDsResponse = {
    ...res.GfSpListObjectsByIDsResponse,
    ObjectEntry,
  };

  return res;
};
