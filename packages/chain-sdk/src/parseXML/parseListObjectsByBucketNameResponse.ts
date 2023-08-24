import { ListObjectsByBucketNameResponse } from '@/types/sp-xml/ListObjectsByBucketNameResponse';
import { XMLParser } from 'fast-xml-parser';

export const parseListObjectsByBucketNameResponse = (data: string) => {
  const arrayFields = ['Objects', 'CommonPrefixes'];
  const xmlParser = new XMLParser({
    isArray: (tagName: string) => {
      if (arrayFields.includes(tagName)) return true;
      return false;
    },
    numberParseOptions: {
      hex: false,
      leadingZeros: true,
      skipLike: undefined,
      eNotation: false,
    },
  });

  const res = xmlParser.parse(data) as ListObjectsByBucketNameResponse;

  if (res.GfSpListObjectsByBucketNameResponse.CommonPrefixes.length === 0) {
    res.GfSpListObjectsByBucketNameResponse.CommonPrefixes = [];
  }

  if (res.GfSpListObjectsByBucketNameResponse.Objects.length === 0) {
    res.GfSpListObjectsByBucketNameResponse.Objects = [];
  }

  return res;
};
