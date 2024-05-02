import { hexlify } from '@ethersproject/bytes';
import { ed25519 } from '@noble/curves/ed25519';
import { injectable } from 'tsyringe';
import { convertTimeStampToDate, getUtcZeroTimestamp, SpResponse } from '..';
import { NORMAL_ERROR_CODE } from '../constants/http';
import { genSecondSignMsg, personalSign, updateSpsPubKey } from '../offchainauth';
import {
  IGenOffChainAuthKeyPairAndUpload,
  IReturnOffChainAuthKeyPairAndUpload,
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
      const { privateKey, publicKey } = this.generateKeys();

      const curUtcZeroTimestamp = getUtcZeroTimestamp();
      const expirationTime = curUtcZeroTimestamp + expirationMs;
      const issuedDate = convertTimeStampToDate(curUtcZeroTimestamp);
      const expireDate = convertTimeStampToDate(expirationTime);
      const signMsg = genSecondSignMsg({
        domain,
        address,
        pubKey: hexlify(publicKey).slice(2),
        chainId,
        issuedDate,
        expireDate,
      });
      const signRes = await personalSign({ message: signMsg, address, provider });
      const jsonSignMsg = JSON.stringify(signMsg).replace(/\"/g, '');
      const authorization = `GNFD1-ETH-PERSONAL_SIGN,SignedMsg=${jsonSignMsg},Signature=${signRes}`;

      const res = await updateSpsPubKey({
        address,
        sps,
        domain,
        pubKey: hexlify(publicKey).slice(2),
        expireDate,
        authorization,
      });

      const uploadSpsPubkeyFailed = res
        .filter((item: any) => item.code !== 0)
        .map((item: any) => item.data.address);
      if (uploadSpsPubkeyFailed.length === sps.length) {
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
          seedString: hexlify(privateKey),
          keypairs: {
            privateKey: hexlify(privateKey).slice(2),
            publicKey: hexlify(publicKey).slice(2),
          },
          expirationTime,
          spAddresses: successSps,
          failedSpAddresses: uploadSpsPubkeyFailed,
        },
        message: 'Sign and upload public key success',
      };
    } catch (error: any) {
      return { code: -1, message: error.message, statusCode: error?.status || NORMAL_ERROR_CODE };
    }
  }

  private generateKeys() {
    const privateKey = ed25519.utils.randomPrivateKey();
    const publicKey = ed25519.getPublicKey(privateKey);

    return {
      privateKey,
      publicKey,
    };
  }
}
