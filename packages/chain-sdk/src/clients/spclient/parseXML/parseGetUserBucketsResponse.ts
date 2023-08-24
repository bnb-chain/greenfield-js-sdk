import { GetUserBucketsResponse } from '@/types';
import { XMLParser } from 'fast-xml-parser';

export const parseGetUserBucketsResponse = (data: string) => {
  const xmlParser = new XMLParser({
    isArray: (tagName: string) => {
      if (tagName === 'Buckets') return true;
      return false;
    },
    numberParseOptions: {
      hex: false,
      leadingZeros: true,
      skipLike: undefined,
      eNotation: false,
    },
  });

  const res = xmlParser.parse(data) as GetUserBucketsResponse;

  if (!res.GfSpGetUserBucketsResponse?.Buckets) {
    res.GfSpGetUserBucketsResponse.Buckets = [];
  }

  return res;
};
