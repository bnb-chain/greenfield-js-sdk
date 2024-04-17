import { formatGroupInfo, convertStrToBool } from '@/types/sp/Common';
import { ListUserOwnedGroupsResponse } from '@/types/sp/ListUserOwnedGroups';
import { XMLParser } from 'fast-xml-parser';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/list_user_owned_groups
export const parseListUserOwnedGroupsResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });

  const res = xmlParser.parse(data) as ListUserOwnedGroupsResponse;

  let Groups = res.GfSpGetUserOwnedGroupsResponse.Groups || [];
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

  res.GfSpGetUserOwnedGroupsResponse = {
    Groups: Groups,
  };

  return res;
};
