import { IUpdateOneSpPubKeyParams } from '@/types';
import { fetchWithTimeout } from '@/utils/http';
import { Headers } from 'cross-fetch';

export const updateUserAccountKey = async ({
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
