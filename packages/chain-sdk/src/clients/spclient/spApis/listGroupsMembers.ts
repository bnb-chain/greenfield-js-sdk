import { ListGroupsMembersResponse } from '@/types';
import { XMLParser } from 'fast-xml-parser';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/list_group_members
export const parseListGroupsMembersResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as ListGroupsMembersResponse;

  return res;
};
