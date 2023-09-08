import { convertStrToBool, formatObjectInfo } from '@/types/sp/Common';
import {
  GetListObjectPoliciesRequest,
  GetListObjectPoliciesResponse,
} from '@/types/sp/ListObjectPolicies';
import { generateUrlByBucketName } from '@/utils';
import { actionTypeFromJSON } from '@bnb-chain/greenfield-cosmos-types/greenfield/permission/common';
import { XMLParser } from 'fast-xml-parser';
import { encodePath, getSortQueryParams } from '../auth';

export const getListObjectPoliciesMetaInfo = (
  endpoint: string,
  params: GetListObjectPoliciesRequest,
) => {
  const { actionType, bucketName, objectName, limit = '10', startAfter = '' } = params;
  const path = `/${encodePath(objectName)}`;
  const queryMap = {
    'object-policies': 'null',
    'start-after': startAfter,
    limit: String(limit),
    'action-type': String(actionTypeFromJSON(actionType)),
  };

  let url = new URL(path, generateUrlByBucketName(endpoint, bucketName));
  url = getSortQueryParams(url, queryMap);

  return {
    url: url.href,
  };
};

export const parseGetListObjectPoliciesResponse = (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as GetListObjectPoliciesResponse;

  let Policies = res.GfSpListObjectPoliciesResponse.Policies || [];

  if (Policies) {
    if (!Array.isArray(Policies)) {
      Policies = [Policies];
    }

    Policies = Policies.map((item) => {
      return {
        ...item,
        PrincipalType: Number(item.ResourceType),
        ResourceType: Number(item.ResourceType),
        CreateTimestamp: Number(item.CreateTimestamp),
        UpdateTimestamp: Number(item.UpdateTimestamp),
        ExpirationTime: Number(item.ExpirationTime),
      };
    });
  }

  res.GfSpListObjectPoliciesResponse = {
    Policies,
  };

  return res;
};
