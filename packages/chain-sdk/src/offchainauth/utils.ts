import { fetchNonce, updateOneSpPubKey } from './fetch';
import {
  IFetchNonces,
  TGenSecondSignMsgParams,
  IPersonalSignParams,
  ISp,
  IUpdateSpsPubKeyParams,
} from '../types/storage';

const delay = (ms: number, value: { code: number; nonce?: null | number; message?: any }) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const promiseRaceAll = async (
  promises: Promise<unknown>[],
  timeout = 5000,
  timeoutValue: any = { code: -1 },
) => {
  return Promise.all(
    promises.map((p: Promise<unknown>) => {
      return Promise.race([p, delay(timeout, timeoutValue)]);
    }),
  );
};

export const genLocalSignMsg = (sps: ISp[], domain: string) => {
  const spMsg = sps
    .map((sp: ISp) => {
      return `- SP ${sp.endpoint} (name:${sp.name || ''}) with nonce:${sp.nonce}`;
    })
    .join('\n');
  const firstSign = `Sign this message to let dapp ${domain} access the following SPs:
    ${spMsg}`;

  return firstSign;
};

export const fetchNonces = async ({ sps, address, domain }: IFetchNonces): Promise<any> => {
  const promises = sps.map((sp: ISp) =>
    fetchNonce({
      spEndpoint: sp.endpoint,
      spAddress: sp.address,
      spName: sp.name,
      address,
      domain,
    }),
  );
  const res = await promiseRaceAll(promises, 5000, { code: -1, nonce: null });

  return res;
};

export const updateSpsPubKey = async ({
  address,
  sps,
  domain,
  pubKey,
  expireDate,
  authorization,
}: IUpdateSpsPubKeyParams) => {
  const promises = sps.map((sp: ISp) =>
    updateOneSpPubKey({
      address,
      domain,
      sp,
      pubKey,
      expireDate,
      authorization,
    }),
  );
  const res = await promiseRaceAll(promises, 3000);

  return res;
};

export const getSpsEndpoint = (sps: ISp[]) => {
  const spsEndpoint = sps.map((sp) => sp.endpoint);

  return spsEndpoint;
};

export const genSecondSignMsg = ({
  domain,
  address,
  pubKey,
  chainId,
  issuedDate,
  expireDate,
  sps,
}: TGenSecondSignMsgParams): string => {
  let resourceList = '';
  const spsMsg: string[] = [];
  sps.forEach((sp: ISp) => {
    const spMsg = `- SP ${sp.address} (name: ${sp.name || ''}) with nonce: ${sp.nonce}`;
    spsMsg.push(spMsg);
  });
  resourceList = spsMsg.join('\n');
  // NOTICE: DO NOT CHANGE THE TEMPLATE FORMAT
  const unSignedContentTemplate = `${domain} wants you to sign in with your BNB Greenfield account:${address}
Register your identity public key ${pubKey}
URI: ${domain}
Version: 1
Chain ID: ${chainId}
Issued At: ${issuedDate}
Expiration Time: ${expireDate}
Resources:
${resourceList}`;

  return unSignedContentTemplate;
};

export const personalSign = async ({ message, address, provider }: IPersonalSignParams) => {
  const sign = await provider.request({
    method: 'personal_sign',
    params: [message, address],
  });

  return sign;
};

export const genSeedSignMsg = (timestamp: number) => {
  return `InvokeSPAPI_offChainSign_${timestamp}`;
};
