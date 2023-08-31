import { ListGroupsResponse } from '@/types';
import { formatGroupInfo } from '@/types/sp-xml/Common';
import { XMLParser } from 'fast-xml-parser';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/get_group_list
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
