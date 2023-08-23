import { RequestErrorResponse } from '@/types/spXML';
import fetch from 'cross-fetch';
import { XMLParser } from 'fast-xml-parser';

export function delayMs(duration: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('request time out'));
    }, duration);
  });
}

const fetchWithTimeout = async (fetchUrl = '', fetchOptions: any = {}, duration = 30000) => {
  try {
    const response = (await Promise.race([
      delayMs(duration),
      fetch(fetchUrl, fetchOptions),
    ])) as Response;
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const parseErrorXML = async (result: Response) => {
  const xmlParser = new XMLParser();
  const xmlData = await result.text();
  const res = xmlParser.parse(xmlData) as RequestErrorResponse;

  return {
    code: res.Error.Code,
    message: res.Error.Message,
  };
};

export { fetchWithTimeout, parseErrorXML as parseErrorXml };
