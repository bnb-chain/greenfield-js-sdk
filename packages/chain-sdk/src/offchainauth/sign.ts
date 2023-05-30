import { hexlify, arrayify } from '@ethersproject/bytes';
import { toUtf8Bytes } from '@ethersproject/strings';
import { TGetCurrentSeedStringParams } from '../types/storage';

const getZkCrypto = (function () {
  let instance: any;
  return async function () {
    if (!instance) {
      const { ZkCrypto } = await import('@bnb-chain/zkbas-js-sdk/zkCrypto/web');
      instance = ZkCrypto;
    }

    return instance;
  };
})();

const getCurrentAccountPublicKey = async (seedString: string) => {
  const ZkCrypto = await getZkCrypto();
  const Z = await ZkCrypto();

  return Z.getEddsaCompressedPublicKey(seedString);
};

const signSignatureByEddsa = async (seed: string, message: string) => {
  const ZkCrypto = await getZkCrypto();
  const Z = await ZkCrypto();
  const signature = Z.eddsaSign(seed, message);

  return signature;
};

const verifySignature = async (pubKey: string, signRes: string, msg: string) => {
  const ZkCrypto = await getZkCrypto();
  const Z = await ZkCrypto();

  const verifyRes = Z.eddsaVerify(pubKey, signRes, msg);
  return verifyRes;
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

export { getCurrentAccountPublicKey, signSignatureByEddsa, verifySignature, getCurrentSeedString };
