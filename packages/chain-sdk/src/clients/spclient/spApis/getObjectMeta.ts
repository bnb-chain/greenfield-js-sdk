import { GetObjectMetaResponse } from '@/types/sp-xml/GetObjectMetaResponse';
import { XMLParser } from 'fast-xml-parser';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/get_object_meta
export const parseGetObjectMetaResponse = (data: string) => {
  const xmlParser = new XMLParser({
    isArray: (tagName: string) => {
      if (tagName === 'Objects') return true;
      return false;
    },
    numberParseOptions: {
      hex: false,
      leadingZeros: true,
      skipLike: undefined,
      eNotation: false,
    },
  });

  return xmlParser.parse(data) as GetObjectMetaResponse;
};
