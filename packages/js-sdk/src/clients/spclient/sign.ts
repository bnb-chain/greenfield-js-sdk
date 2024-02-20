import { hexlify, arrayify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import { TGetCurrentSeedStringParams } from '../../types/storage';

const getCurrentAccountPublicKey = async (seedString: string) => {
  // TODO: this way will be deprecated
  if ((window as any).getEddsaCompressedPublicKey) {
    return (window as any).getEddsaCompressedPublicKey(seedString);
  }

  // NEW METHOD: lazy load @bnb-chain/greenfield-zk-crypto
  const { zkGetEddsaCompressedPublicKey } = await import('./zkWrapper');
  return await zkGetEddsaCompressedPublicKey(seedString);
};

const signSignatureByEddsa = async (seedString: string, message: string) => {
  // TODO: this way will be deprecated
  if ((window as any).eddsaSign) {
    return (window as any).eddsaSign(seedString, message);
  }

  // NEW METHOD: lazy load @bnb-chain/greenfield-zk-crypto
  const { zkEddsaSign } = await import('./zkWrapper');
  return await zkEddsaSign(seedString, message);
};

const signMessagePersonalAPI = async (
  provider: any,
  message: Uint8Array,
  address: string,
): Promise<string> => {
  return provider.request({
    method: 'personal_sign',
    params: [hexlify(message), address],
  });
};

const generateSeed = async (
  { message, address }: { message: string; address: string },
  provider: any,
) => {
  const signedBytes = typeof message === 'string' ? toUtf8Bytes(message) : arrayify(message);
  const res = (await signMessagePersonalAPI(provider, signedBytes, address)) as any;
  const seed = arrayify(res);

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
