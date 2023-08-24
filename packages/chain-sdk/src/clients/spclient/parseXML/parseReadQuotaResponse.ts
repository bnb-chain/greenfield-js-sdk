import { XMLParser } from 'fast-xml-parser';
import { ReadQuotaResponse } from '../../..';

export const parseReadQuotaResponse = (data: string) => {
  const xmlParser = new XMLParser();
  return xmlParser.parse(data) as ReadQuotaResponse;
};
