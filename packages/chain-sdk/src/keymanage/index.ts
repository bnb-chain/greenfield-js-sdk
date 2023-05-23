import { createEIP712, generateFee, generateMessage, generateTypes } from '@/messages';
import { typeWrapper } from '@/tx/utils';
import { bufferToHex, toBuffer } from '@ethereumjs/util';
import { SignTypedDataVersion, signTypedData } from '@metamask/eth-sig-util';
import { publicKeyCreate } from 'ethereum-cryptography/secp256k1-compat';
import { BroadcastOptions, makeCosmsPubKey } from '..';

/**
 * @priKey 0x prefix
 */
export const getPubKeyByPriKey = (priKey: string) => {
  const privateKeyBytes = toBuffer(priKey);
  const publicKeyBytes = publicKeyCreate(privateKeyBytes);
  const pk = bufferToHex(toBuffer(publicKeyBytes));
  const pubKey = makeCosmsPubKey(pk);
  return pubKey;
};

export const createEIP712Data = (
  chainId: string,
  accountNumber: string,
  sequence: string,
  typeUrl: string,
  MsgSDKTypeEIP712: object,
  MsgSDK: object,
  txOption: BroadcastOptions,
) => {
  const { gasLimit, gasPrice, denom, payer } = txOption;
  const fee = generateFee(
    String(BigInt(gasLimit) * BigInt(gasPrice)),
    denom,
    String(gasLimit),
    payer,
    '',
  );
  const wrapperTypes = generateTypes(MsgSDKTypeEIP712);
  const wrapperMsg = typeWrapper(typeUrl, MsgSDK);
  const messages = generateMessage(accountNumber, sequence, chainId, '', fee, wrapperMsg, '0');
  return createEIP712(wrapperTypes, chainId, messages);
};

export const signEIP712Data = (
  chainId: string,
  accountNumber: string,
  sequence: string,
  typeUrl: string,
  MsgSDKTypeEIP712: object,
  MsgSDK: object,
  txOption: BroadcastOptions,
) => {
  const data = createEIP712Data(
    chainId,
    accountNumber,
    sequence,
    typeUrl,
    MsgSDKTypeEIP712,
    MsgSDK,
    txOption,
  );

  if (!txOption.privateKey) {
    throw new Error('private key is required');
  }

  return signTypedData({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data,
    version: SignTypedDataVersion.V4,
    privateKey: toBuffer(txOption.privateKey),
  });
};
