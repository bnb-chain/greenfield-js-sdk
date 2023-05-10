import { client, getStorageProviders } from '@/client';
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

      <button
        onClick={async () => {
          if (!address) return;

          const res = await client.account.transfer(
            {
              fromAddress: address,
              toAddress: '0x0000000000000000000000000000000000000001',
              amount: [
                {
                  denom: 'BNB',
                  amount: '10000000000000000',
                },
              ],
            },
            {
              simulate: false,
              denom: 'BNB',
              gasLimit: 210000,
              gasPrice: '5000000000',
              payer: address,
              granter: '',
            },
          );

          console.log('res', res);
        }}
      >
        transfer
      </button>
    </>
  );
};
