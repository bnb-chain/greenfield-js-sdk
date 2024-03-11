import { arrayify, hexlify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import { TGetCurrentSeedStringParams } from '../../types/storage';

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

export { getCurrentSeedString };
