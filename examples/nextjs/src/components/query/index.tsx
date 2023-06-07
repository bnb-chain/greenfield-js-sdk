import { client } from '@/client';
import { useAccount } from 'wagmi';

export const QueryComponent = () => {
  const { address } = useAccount();
  return (
    <>
      <h2>open console panel</h2>

      <h3>account</h3>
      <ul>
        <li>
          <button
            onClick={async () => {
              if (!address) return;

              const account = await client.account.getAccount(address);

              console.log('account', account);
            }}
          >
            get account
          </button>
        </li>
      </ul>

      <h3>sp</h3>
      <ul>
        <li>
          <button
            onClick={async () => {
              const res = await client.sp.getStorageProviders();
              console.log('res', res);
            }}
          >
            get storage providers
          </button>
        </li>
      </ul>
    </>
  );
};
