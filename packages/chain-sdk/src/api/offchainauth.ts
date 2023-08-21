import {
  fetchNonces,
  genLocalSignMsg,
  genSecondSignMsg,
  genSeedSignMsg,
  getCurrentAccountPublicKey,
  getCurrentSeedString,
  personalSign,
  signSignatureByEddsa,
  updateSpsPubKey,
} from '@/offchainauth';
import { getMsgToSign } from '@/utils/auth';
import { NORMAL_ERROR_CODE } from '@/utils/http';
import { hexlify } from '@ethersproject/bytes';
import { utf8ToBytes } from 'ethereum-cryptography/utils';
import { singleton } from 'tsyringe';
import { convertTimeStampToDate, getUtcZeroTimestamp } from '..';
import {
  IGenOffChainAuthKeyPairAndUpload,
  IObjectResultType,
  IReturnOffChainAuthKeyPairAndUpload,
  IReturnSignWithSeedString,
  ISp,
} from '../types/storage';

export interface IOffChainAuth {
  /**
   * generate off-chain auth key pair and upload the public key to meta service, return the seedString for signing message when user need to get approval from sp.
   */
  genOffChainAuthKeyPairAndUpload(
    params: IGenOffChainAuthKeyPairAndUpload,
    provider: any,
  ): Promise<IObjectResultType<IReturnOffChainAuthKeyPairAndUpload>>;

  /**
   * Sign a message with a seed string, return the authorization for sp authorizing the user.
   */
  sign(seedString: string): Promise<IObjectResultType<IReturnSignWithSeedString>>;
}

@singleton()
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

  public async sign(seedString: string) {
    try {
      // NOTICE: Smoothing local and server time gap
      // const expirationMs = 300000 - 100000;
      // const timestamp = getUtcZeroTimestamp();
      // const expireTimestamp = timestamp + expirationMs;
      // const signMsg = genSeedSignMsg(expireTimestamp);

      const unsignedMsg = '';

      const signRes = await signSignatureByEddsa(seedString, unsignedMsg);
      const authorization = `GNFD1-EDDSA,Signature=${signRes}`;

      return {
        code: 0,
        body: {
          unSignedMsg: unsignedMsg,
          signature: signRes,
          authorization,
        },
        message: 'Sign with seed string success',
      };
    } catch (error: any) {
      return {
        code: -1,
        message: error.message || 'Sign with seed string failed',
        statusCode: error?.status || NORMAL_ERROR_CODE,
      };
    }
  }
}
