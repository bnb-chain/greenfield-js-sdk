import { hexlify, arrayify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import { TGetCurrentSeedStringParams } from '../../types/storage';
import { getEddsaCompressedPublicKey, eddsaSign } from '@bnb-chain/greenfield-zk-crypto';

const getCurrentAccountPublicKey = async (seedString: string) => {
  if ((window as any).getEddsaCompressedPublicKey) {
    return (window as any).getEddsaCompressedPublicKey(seedString);
  }
  return await getEddsaCompressedPublicKey(seedString);
};

const signSignatureByEddsa = async (seedString: string, message: string) => {
  if ((window as any).eddsaSign) {
    return (window as any).eddsaSign(seedString, message);
  }
  return await eddsaSign(seedString, message);
};

const signMessagePersonalAPI = async (
  provider: any,
  message: Uint8Array,
  address: string,
): Promise<string> => {
  return provider.send('personal_sign', [hexlify(message), address]).then(
    (sign: string) => sign,
    (err: Error) => {
      throw err;
    },
  );
};

const generateSeed = async (
  { message, address }: { message: string; address: string },
  provider: any,
) => {
  const signedBytes = typeof message === 'string' ? toUtf8Bytes(message) : arrayify(message);
  const res = (await signMessagePersonalAPI(provider, signedBytes, address)) as any;
  const seed = arrayify(res?.result);

  return { seed };
};

const getCurrentSeedString = async ({
  message,
  address,
  chainId,
  provider,
}: TGetCurrentSeedStringParams) => {
  const seedKey = `${chainId}-${address}`;
  const seeds: { [id: string]: any } = {};
  if (!seeds[seedKey]) {
    seeds[seedKey] = await generateSeed({ message, address }, provider);
    seeds[seedKey].seed = seeds[seedKey].seed
      .toString()
      .split(',')
      .map((x: string) => +x);
  }

  seeds[seedKey].seed = Uint8Array.from(seeds[seedKey].seed);
  return seeds[seedKey].seed;
};

export { getCurrentAccountPublicKey, signSignatureByEddsa, getCurrentSeedString };
