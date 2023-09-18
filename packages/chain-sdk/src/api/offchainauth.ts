import { NORMAL_ERROR_CODE } from '@/constants/http';
import {
  fetchNonces,
  genLocalSignMsg,
  genSecondSignMsg,
  getCurrentAccountPublicKey,
  getCurrentSeedString,
  personalSign,
  updateSpsPubKey,
} from '@/offchainauth';
import { hexlify } from '@ethersproject/bytes';
import { injectable } from 'tsyringe';
import { convertTimeStampToDate, getUtcZeroTimestamp, SpResponse } from '..';
import {
  IGenOffChainAuthKeyPairAndUpload,
  IReturnOffChainAuthKeyPairAndUpload,
  ISp,
} from '../types/storage';

export interface IOffChainAuth {
  /**
   * generate off-chain auth key pair and upload the public key to meta service, return the seedString for signing message when user need to get approval from sp.
   */
  genOffChainAuthKeyPairAndUpload(
    params: IGenOffChainAuthKeyPairAndUpload,
    provider: any,
  ): Promise<SpResponse<IReturnOffChainAuthKeyPairAndUpload>>;
}

@injectable()
export class OffChainAuth implements IOffChainAuth {
  public async genOffChainAuthKeyPairAndUpload(
    { sps, address, domain, expirationMs, chainId }: IGenOffChainAuthKeyPairAndUpload,
    provider: any,
  ) {
    try {
      // 1. first sign, generate seed string and public key
      const spsNonceRaw = await fetchNonces({ sps, address, domain });
      const fetchSpsNonceFailed = spsNonceRaw
        .filter((item: ISp) => item.nonce === null)
        .map((item: ISp) => item.address);
      if (fetchSpsNonceFailed.length === spsNonceRaw.length) {
        throw new Error(`No SP service is available. Please try again later.`);
      }
      const spsWithNonce = spsNonceRaw.filter((item: ISp) => item.nonce !== null);
      // 2. generate signature key pair
      const seedMsg = genLocalSignMsg(spsWithNonce, domain);
      // Uint8Array
      const seed = await getCurrentSeedString({ message: seedMsg, address, chainId, provider });
      const seedString = hexlify(seed);
      const pubKey = await getCurrentAccountPublicKey(seedString);

      // 3. second sign for upload public key to server
      const curUtcZeroTimestamp = getUtcZeroTimestamp();
      const expirationTime = curUtcZeroTimestamp + expirationMs;
      const issuedDate = convertTimeStampToDate(curUtcZeroTimestamp);
      const expireDate = convertTimeStampToDate(expirationTime);
      const signMsg = genSecondSignMsg({
        domain,
        address,
        pubKey,
        chainId,
        issuedDate,
        expireDate,
        sps: spsWithNonce,
      });
      const signRes = await personalSign({ message: signMsg, address, provider });
      const jsonSignMsg = JSON.stringify(signMsg).replace(/\"/g, '');
      const authorization = `GNFD1-ETH-PERSONAL_SIGN,SignedMsg=${jsonSignMsg},Signature=${signRes}`;
      // 4. upload signature and pubKey to server
      const res = await updateSpsPubKey({
        address,
        sps: spsWithNonce,
        domain,
        pubKey,
        expireDate,
        authorization,
      });
      const uploadSpsPubkeyFailed = res
        .filter((item: any) => item.code !== 0)
        .map((item: any) => item.data.address);
      if (uploadSpsPubkeyFailed.length === spsWithNonce.length) {
        throw new Error(`No SP service is available. Please try again later.`);
      }
      const successSps: string[] = [];
      res.forEach((item: any) => {
        if (item.code === 0) {
          successSps.push(item.data.address);
        }
      });

      return {
        code: 0,
        body: {
          seedString,
          pubKey,
          expirationTime,
          spAddresses: successSps,
          failedSpAddresses: [...fetchSpsNonceFailed, ...uploadSpsPubkeyFailed],
        },
        message: 'Sign and upload public key success',
      };
    } catch (error: any) {
      return { code: -1, message: error.message, statusCode: error?.status || NORMAL_ERROR_CODE };
    }
  }
}
