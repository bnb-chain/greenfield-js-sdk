import { RequestErrorResponse } from '@/types';
import xml from 'xml2js';

export const parseError = async (data: string) => {
  const res = (await xml.parseStringPromise(data, {
    strict: true,
    explicitRoot: true,
    explicitArray: false,
  })) as RequestErrorResponse;

  return {
    code: res.Error.Code,
    message: res.Error.Message,
  };
};
