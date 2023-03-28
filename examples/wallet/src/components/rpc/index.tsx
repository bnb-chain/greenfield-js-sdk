import { getBalance } from '@bnb-chain/greenfield-chain-js-sdk';
import { getSpStoragePriceByTime, getStorageProviders } from '@/client';
import { useAccount } from 'wagmi';
import { GRPC_URL } from '@/config';

export const RpcComponent = () => {
  const { address } = useAccount();
  return (
    <>
      <button
        onClick={async () => {
          const res = await getStorageProviders();

          console.log('res', res);
        }}
      >
        get storage providers
      </button>

      <button
        onClick={async () => {
          if (!address) return;

          const balance = await getBalance(GRPC_URL, {
            address,
            denom: 'BNB',
          });
          console.log('balance', balance);
        }}
      >
        get balance
      </button>
    </>
  );
};
