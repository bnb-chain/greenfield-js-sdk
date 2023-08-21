import { fetchWithTimeout } from '@/utils/http';
import { Headers } from 'cross-fetch';
import { IFetchNonce, IUpdateOneSpPubKeyParams } from '../types/storage';
import { XMLParser } from 'fast-xml-parser';

interface RequestNonceResponse {
  RequestNonceResp: {
    CurrentNonce: number;
    CurrentPublicKey: string;
    ExpiryDate: string;
    NextNonce: number;
  };
}
export const fetchNonce = async ({
  spEndpoint,
  spName,
  spAddress,
  address,
  domain,
}: IFetchNonce) => {
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

    // res = await result.json();
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

export const updateOneSpPubKey = async ({
  address,
  domain,
  sp,
  pubKey,
  expireDate,
  authorization,
}: IUpdateOneSpPubKeyParams) => {
  let result;
  const url = `${sp.endpoint}/auth/update_key`;
  const nonce = sp.nonce + '';
  const headers = new Headers({
    'X-Gnfd-User-Address': address,
    'X-Gnfd-App-Domain': domain,
    'X-Gnfd-App-Reg-Nonce': nonce,
    'X-Gnfd-App-Reg-Public-Key': pubKey,
    'X-Gnfd-Expiry-Timestamp': expireDate,
    Authorization: authorization,
  });

  try {
    result = await fetchWithTimeout(url, {
      headers,
      method: 'POST',
    });
    if (!result.ok) {
      return { code: -1, data: { address }, message: 'upload sp pubKey error.' };
    }
  } catch (error) {
    return { code: -1, data: { address }, message: 'upload sp pubKey error.' };
  }

  return {
    code: 0,
    data: {
      ...sp,
    },
  };
};
