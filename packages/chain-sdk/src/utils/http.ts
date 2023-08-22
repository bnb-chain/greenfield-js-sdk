import { RequestErrorResponse } from '@/types/spXML';
import fetch from 'cross-fetch';
import { XMLParser } from 'fast-xml-parser';

const EMPTY_STRING_SHA256 = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
const MOCK_SIGNATURE = '1234567812345678123456781234567812345678123456781234567812345678';
const NORMAL_ERROR_CODE = 404;
const METHOD_GET = 'GET';
const METHOD_POST = 'POST';
const METHOD_PUT = 'PUT';

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

export {
  EMPTY_STRING_SHA256,
  MOCK_SIGNATURE,
  NORMAL_ERROR_CODE,
  METHOD_GET,
  METHOD_POST,
  METHOD_PUT,
  fetchWithTimeout,
  parseErrorXML as parseErrorXml,
};
