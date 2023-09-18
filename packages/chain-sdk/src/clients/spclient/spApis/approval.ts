import { EMPTY_STRING_SHA256, METHOD_GET } from '@/constants';
import { ReqMeta } from '@/types';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';
import { getSortQueryParams } from '../auth';

export type APPROVAL_ACTION = 'CreateBucket' | 'CreateObject' | 'MigrateBucket';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest/get_approval
export const getApprovalMetaInfo = <T>(endpoint: string, action: APPROVAL_ACTION, msg: T) => {
  const path = '/greenfield/admin/v1/get-approval';
  const queryMap = {
    action,
  };

  let url = new URL(path, endpoint);
  url = getSortQueryParams(url, queryMap);

  const unSignedMessageInHex = toHex(utf8ToBytes(JSON.stringify(msg)));

  const reqMeta: Partial<ReqMeta> = {
    contentSHA256: EMPTY_STRING_SHA256,
    unsignMsg: unSignedMessageInHex,
    method: METHOD_GET,
    url: {
      hostname: url.hostname,
      query: url.searchParams.toString(),
      path,
    },
  };

  const optionsWithOutHeaders: Omit<RequestInit, 'headers'> = {
    method: METHOD_GET,
  };

  return {
    url: url.href,
    optionsWithOutHeaders,
    reqMeta,
  };
};
