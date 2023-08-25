import { EMPTY_STRING_SHA256, METHOD_GET } from '@/constants';
import { ICreateBucketMsgType, ReqMeta } from '@/types';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/get_approval
export const getBucketApprovalMetaInfo = async (endpoint: string, msg: ICreateBucketMsgType) => {
  const path = '/greenfield/admin/v1/get-approval';
  const query = 'action=CreateBucket';
  const url = `${endpoint}${path}?${query}`;
  const unSignedMessageInHex = toHex(utf8ToBytes(JSON.stringify(msg)));

  const reqMeta: Partial<ReqMeta> = {
    contentSHA256: EMPTY_STRING_SHA256,
    unsignMsg: unSignedMessageInHex,
    method: METHOD_GET,
    url: {
      hostname: new URL(endpoint).hostname,
      query,
      path,
    },
  };

  const optionsWithOutHeaders: Omit<RequestInit, 'headers'> = {
    method: METHOD_GET,
  };

  return {
    url,
    optionsWithOutHeaders,
    reqMeta,
  };
};
