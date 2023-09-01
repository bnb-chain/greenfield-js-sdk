import { EMPTY_STRING_SHA256, METHOD_GET } from '@/constants';
import { ReqMeta } from '@/types';
import { formatReadRecord } from '@/types/sp/Common';
import {
  ListBucketReadRecordRequest,
  ListBucketReadRecordResponse,
} from '@/types/sp/ListBucketReadRecord';
import { generateUrlByBucketName } from '@/utils';
import { XMLParser } from 'fast-xml-parser';
import { getSortQuery } from '../auth';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/list_bucket_read_records
export const parseListBucketReadRecordResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });

  const res = xmlParser.parse(data) as ListBucketReadRecordResponse;

  let readRecords = res.GetBucketReadQuotaResult?.ReadRecords || [];
  if (readRecords) {
    if (!Array.isArray(readRecords)) {
      readRecords = [readRecords];
    }

    readRecords = readRecords.map((readRecord) => formatReadRecord(readRecord));
  }

  res.GetBucketReadQuotaResult = {
    ...res.GetBucketReadQuotaResult,
    ReadRecords: readRecords,
  };

  return res;
};

export const getListBucketReadRecordMetaInfo = async (
  endpoint: string,
  params: ListBucketReadRecordRequest,
) => {
  const { bucketName, endTimeStamp, maxRecords, startTimeStamp } = params;
  const path = '/';
  const queryMap = {
    'list-read-record': 'null',
    'end-timestamp': String(endTimeStamp),
    'max-records': String(maxRecords),
    'start-timestamp': String(startTimeStamp),
  };
  const query = getSortQuery(queryMap);

  const url = `${generateUrlByBucketName(endpoint, bucketName)}${path}?${query}`;

  const reqMeta: Partial<ReqMeta> = {
    contentSHA256: EMPTY_STRING_SHA256,
    method: METHOD_GET,
    url: {
      hostname: new URL(url).hostname,
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
