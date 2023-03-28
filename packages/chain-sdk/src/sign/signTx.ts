import { TypedDataUtils, SignTypedDataVersion } from '@metamask/eth-sig-util';
import { ISignature712 } from '.';

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

  const messageHash = TypedDataUtils.eip712Hash(JSON.parse(message), SignTypedDataVersion.V4);

  return {
    signature,
    messageHash,
  };
};
