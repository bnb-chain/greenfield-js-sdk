import { EMPTY_STRING_SHA256, METHOD_POST } from '@/constants';
import { ReqMeta } from '@/types';
import { DelegateCreateFolderRepsonse } from '@/types/sp/DelegateCreateFolder';
import { generateUrlByBucketName } from '@/utils';
import { VisibilityType } from '@bnb-chain/greenfield-cosmos-types/greenfield/storage/common';
import { XMLParser } from 'fast-xml-parser';
import { encodePath, getSortQueryParams } from '../auth';

export const getDelegatedCreateFolderMetaInfo = async (
  endpoint: string,
  params: {
    objectName: string;
    bucketName: string;
    delegatedOpts?: {
      visibility: VisibilityType;
    };
  },
) => {
  const { bucketName, objectName, delegatedOpts } = params;
  const path = `/${encodePath(objectName)}`;
  let queryMap = {};

  if (delegatedOpts) {
    queryMap = {
      'create-folder': '',
      payload_size: '0',
      visibility: delegatedOpts.visibility.toString(),
    };
  }

  let url = new URL(path, generateUrlByBucketName(endpoint, bucketName));
  url = getSortQueryParams(url, queryMap);

  const reqMeta: Partial<ReqMeta> = {
    contentSHA256: EMPTY_STRING_SHA256,
    method: METHOD_POST,
    url: {
      hostname: url.hostname,
      query: url.searchParams.toString(),
      path,
    },
    contentType: '',
  };

  const optionsWithOutHeaders: Omit<RequestInit, 'headers'> = {
    method: METHOD_POST,
  };

  return {
    url: url.href,
    optionsWithOutHeaders,
    reqMeta,
  };
};

export const parseDelegatedCreateFolderResponse = (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });

  const res = xmlParser.parse(data) as DelegateCreateFolderRepsonse;
  return res;
};
