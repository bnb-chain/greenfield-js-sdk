import { EMPTY_STRING_SHA256, METHOD_GET } from '@/constants';
import { ReqMeta } from '@/types';
import { formatReadRecord } from '@/types/sp/Common';
import {
  ListBucketReadRecordRequest,
  ListBucketReadRecordResponse,
} from '@/types/sp/ListBucketReadRecord';
import { generateUrlByBucketName } from '@/utils';
import { XMLParser } from 'fast-xml-parser';
import { getSortQuery, getSortQueryParams } from '../auth';
import { SPMetaInfo } from './metaInfos';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storage-provider-rest/list_bucket_read_records
export const getListBucketReadRecordMetaInfo = (
  endpoint: string,
  params: ListBucketReadRecordRequest,
): SPMetaInfo => {
  const { bucketName, endTimeStamp, maxRecords, startTimeStamp } = params;
  const path = '/';
  const queryMap = {
    'list-read-record': 'null',
    'end-timestamp': String(endTimeStamp),
    'max-records': String(maxRecords),
    'start-timestamp': String(startTimeStamp),
  };

  let url = new URL(path, generateUrlByBucketName(endpoint, bucketName));
  url = getSortQueryParams(url, queryMap);

  const reqMeta: Partial<ReqMeta> = {
    contentSHA256: EMPTY_STRING_SHA256,
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
