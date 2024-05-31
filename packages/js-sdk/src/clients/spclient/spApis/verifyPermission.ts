import { VerifyPermissionResponse } from '@/types/sp/VerifyPermission';
import { XMLParser } from 'fast-xml-parser';

// https://github.com/bnb-chain/greenfield-storage-provider/blob/master/docs/storage-provider-rest-api/verify_permission.md
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
