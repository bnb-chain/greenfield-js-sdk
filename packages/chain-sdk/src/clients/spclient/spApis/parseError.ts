import { RequestErrorResponse } from '@/types';
import { XMLParser } from 'fast-xml-parser';

export const parseError = (data: string) => {
  const xmlParser = new XMLParser();
  const res = xmlParser.parse(data) as RequestErrorResponse;
  return {
    code: res.Error.Code,
    message: res.Error.Message,
  };
};
