import { getStorageProviders } from '@/client';
import { GRPC_URL } from '@/config';
import { getBalance } from '@bnb-chain/greenfield-chain-sdk';
import { useAccount } from 'wagmi';

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
