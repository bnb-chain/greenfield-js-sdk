import { VerifyPermissionResponse } from '@/types/sp-xml/VerifyPermissionResponse';
import { XMLParser } from 'fast-xml-parser';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/verify_permission
export const parseVerifyPermissionResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as VerifyPermissionResponse;

  res.QueryVerifyPermissionResponse = {
    ...res.QueryVerifyPermissionResponse,
    Effect: Number(res.QueryVerifyPermissionResponse.Effect),
  };

  return res;
};
