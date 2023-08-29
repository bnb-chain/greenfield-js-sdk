import { RequestErrorResponse } from '@/types';
import { XMLParser } from 'fast-xml-parser';

export const parseError = async (data: string) => {
  const xmlParser = new XMLParser({
    parseTagValue: false,
  });
  const res = xmlParser.parse(data) as RequestErrorResponse;

  return {
    code: res.Error.Code,
    message: res.Error.Message,
  };
};
