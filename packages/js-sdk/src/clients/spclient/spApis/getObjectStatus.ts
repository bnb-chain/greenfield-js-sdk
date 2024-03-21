import { EMPTY_STRING_SHA256, METHOD_GET } from '@/constants';
import { ReqMeta } from '@/types';
import { UploadProgressResponse } from '@/types/sp/UploadProgress';
import { generateUrlByBucketName } from '@/utils/asserts/s3';
import { XMLParser } from 'fast-xml-parser';
import { encodePath, getSortQueryParams } from '../auth';

// Object's upload-progress
export const getObjectStatusInfo = async (
  endpoint: string,
  params: {
    objectName: string;
    bucketName: string;
  },
) => {
  const { bucketName, objectName } = params;
  const path = `/${encodePath(objectName)}`;
  const queryMap = {
    'upload-progress': '',
  };

  let url = new URL(path, generateUrlByBucketName(endpoint, bucketName));
  url = getSortQueryParams(url, queryMap);

  const reqMeta: Partial<ReqMeta> = {
    contentSHA256: EMPTY_STRING_SHA256,
    method: METHOD_GET,
    url: {
      hostname: new URL(url).hostname,
      query: url.searchParams.toString(),
      path,
    },
    // contentType: 'application/octet-stream',
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

export const parseObjectStatusResponse = (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });

  const res = xmlParser.parse(data) as UploadProgressResponse;

  return res;
};
