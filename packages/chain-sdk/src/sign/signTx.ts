import { TypedDataUtils, SignTypedDataVersion } from '@metamask/eth-sig-util';
import { ISignature712, makeCosmsPubKey, recoverPk } from '.';
import { eip712Hash } from './pubKey';

/**
 * @addr wallet address
 * @message sign typed v4 data
 */
export const sign712Tx = async (addr: string, message: string): Promise<ISignature712> => {
  // TODO: eth-sig-utils
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const signature = await (window as any).ethereum?.request({
    method: 'eth_signTypedData_v4',
    params: [addr, message],
  });

  const messageHash = eip712Hash(message);

  return {
    signature,
    messageHash,
  };
};

export const defaultSignTypedData = async (addr: string, message: string) => {
  const signature = await (window as any).ethereum?.request({
    method: 'eth_signTypedData_v4',
    params: [addr, message],
  });

  const messageHash = eip712Hash(message);

  const pk = recoverPk({
    signature,
    messageHash,
  });
  const pubKey = makeCosmsPubKey(pk);

  return {
    signature,
    messageHash,
    pubKey,
  };
};
