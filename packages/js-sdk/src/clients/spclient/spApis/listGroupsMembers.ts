import { ListGroupsMembersResponse } from '@/types';
import { formatGroupInfo, convertStrToBool } from '@/types/sp/Common';
import { XMLParser } from 'fast-xml-parser';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest/list_group_members
export const parseListGroupsMembersResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as ListGroupsMembersResponse;

  let Groups = res.GfSpGetGroupMembersResponse.Groups || [];
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

  return res;
};
