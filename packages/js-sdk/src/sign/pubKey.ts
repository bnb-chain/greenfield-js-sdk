import { PubKey } from '@bnb-chain/greenfield-cosmos-types/cosmos/crypto/secp256k1/keys';
import { arrayify } from '@ethersproject/bytes';
import { computePublicKey, recoverPublicKey } from '@ethersproject/signing-key';
import { SignTypedDataVersion, TypedDataUtils } from '@metamask/eth-sig-util';
import { ISignature712 } from '.';

/**
 * recover public key from signature
 *
 * @messageHash message hash
 * @signature message signature
 *
 * @returns uncompressed public key
 */
export const recoverPk = ({ messageHash, signature }: ISignature712) => {
  const uncompressedPubKey = recoverPublicKey(messageHash, signature);
  return computePublicKey(uncompressedPubKey, true);
};

/**
 * @pk compressed public key from signature
 * @return eg. { typeUrl: '/ethermint.crypto.v1.ethsecp256k1.PubKey', value: 'CiEC+hp2uVKio9T7x0goOPyHgwUYiRsZ8MeYUrfRX8MxrzM=' }
 */
export const makeCosmsPubKey = (pk: string) => {
  const pubKey = PubKey.fromPartial({
    key: arrayify(pk),
  });

  return {
    typeUrl: '/cosmos.crypto.eth.ethsecp256k1.PubKey',
    value: PubKey.encode(pubKey).finish(),
  };
};

export const eip712Hash = (message: string) => {
  return TypedDataUtils.eip712Hash(JSON.parse(message), SignTypedDataVersion.V4);
};
