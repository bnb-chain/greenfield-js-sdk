import { EMPTY_STRING_SHA256, METHOD_GET } from '@/constants';
import { ReqMeta, TListBucketReadRecord } from '@/types';
import { formatReadRecord } from '@/types/sp-xml/Common';
import { ListBucketReadRecordResponse } from '@/types/sp-xml/ListBucketReadRecordResponse';
import { generateUrlByBucketName } from '@/utils';
import { XMLParser } from 'fast-xml-parser';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/list_bucket_read_records
export const parseListBucketReadRecordResponse = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });

  const res = xmlParser.parse(data) as ListBucketReadRecordResponse;

  let readRecords = res.ListBucketReadRecordResult.ReadRecords || [];
  if (readRecords) {
    if (!Array.isArray(readRecords)) {
      readRecords = [readRecords];
    }

    readRecords = readRecords.map((readRecord) => formatReadRecord(readRecord));
  }

  res.ListBucketReadRecordResult = {
    ...res.ListBucketReadRecordResult,
    ReadRecords: readRecords,
  };

  return res;
};

export const getListBucketReadRecordMetaInfo = async (
  endpoint: string,
  params: TListBucketReadRecord,
) => {
  const { bucketName, endTimeStamp, listReadRecord, maxRecords, startTimeStamp } = params;

  const path = '/';
  const query = `end-timestamp=${endTimeStamp}&list-read-record=${listReadRecord}&max-records=${maxRecords}&start-timestamp=${startTimeStamp}`;
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
