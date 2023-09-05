import { ListGroupsResponse, ListGroupsResquest } from '@/types';
import { formatGroupInfo, convertStrToBool } from '@/types/sp/Common';
import { XMLParser } from 'fast-xml-parser';
import { getSortQueryParams } from '../auth';
import { SPMetaInfo } from './metaInfos';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest/get_group_list
export const getListGroupMetaInfo = (
  endpoint: string,
  params: ListGroupsResquest,
): Pick<SPMetaInfo, 'url'> => {
  const { name, prefix, sourceType, limit, offset } = params;
  const path = '/';
  const queryMap = {
    'group-query': 'null',
    name,
    prefix,
    'source-type': sourceType as string,
    limit: String(limit),
    offset: String(offset),
  };
  let url = new URL(path, endpoint);
  url = getSortQueryParams(url, queryMap);

  return {
    url: url.href,
  };
};

export const parseListGroupsResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });

  const res = xmlParser.parse(data) as ListGroupsResponse;

  let Groups = res.GfSpGetGroupListResponse.Groups || [];
  if (Groups) {
    if (!Array.isArray(Groups)) {
      Groups = [Groups];
    }

    Groups = Groups.map((item) => {
      return {
        ...item,
        CreateAt: Number(item.CreateAt),
        CreateTime: Number(item.CreateTime),
        UpdateAt: Number(item.UpdateAt),
        UpdateTime: Number(item.UpdateTime),
        // @ts-ignore
        Removed: convertStrToBool(item.Removed),
        Group: formatGroupInfo(item.Group),
      };
    });
  }

  res.GfSpGetGroupListResponse = {
    Groups: Groups,
    Count: Number(res.GfSpGetGroupListResponse.Count),
  };

  return res;
};
