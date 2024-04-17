import { ListObjectsByIDsRequest, ListObjectsByIDsResponse } from '@/types';
import { formatObjectInfo, convertStrToBool } from '@/types/sp/Common';
import { XMLParser } from 'fast-xml-parser';
import { getSortQueryParams } from '../auth';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest/list_objects_by_ids
export const getListObjectsByIDsMetaInfo = (endpoint: string, params: ListObjectsByIDsRequest) => {
  const path = '';
  const queryMap = {
    ids: params.ids.join(','),
    'objects-query': 'null',
  };

  let url = new URL(path, endpoint);
  url = getSortQueryParams(url, queryMap);

  return {
    url: url.href,
  };
};

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
