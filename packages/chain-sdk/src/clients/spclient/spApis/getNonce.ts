import { IFetchNonce, RequestNonceResponse } from '@/types';
import { fetchWithTimeout } from '@/utils/http';
import { XMLParser } from 'fast-xml-parser';

// https://docs.bnbchain.org/greenfield-docs/docs/api/storgae-provider-rest/get_nonce
export const getNonce = async ({ spEndpoint, spName, spAddress, address, domain }: IFetchNonce) => {
  let result;
  let res;
  const url = `${spEndpoint}/auth/request_nonce`;
  const headers = new Headers({
    'X-Gnfd-User-Address': address,
    'X-Gnfd-App-Domain': domain,
  });
  try {
    result = await fetchWithTimeout(url, {
      headers,
    });
    if (!result.ok) {
      return { code: -1, nonce: null };
    }

    const xmlParser = new XMLParser();
    const xmlData = await result.text();
    res = xmlParser.parse(xmlData) as RequestNonceResponse;
  } catch (error) {
    return { code: -1, nonce: null };
  }

  return {
    endpoint: spEndpoint,
    address: spAddress,
    name: spName,
    nonce: res.RequestNonceResp.NextNonce,
  };
};
