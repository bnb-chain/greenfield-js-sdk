import { client } from '@/client';
import { Long } from '@bnb-chain/greenfield-js-sdk';
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

      <h3>tx</h3>
      <ul>
        <li>
          <button
            onClick={async () => {
              const gasfeeList = await client.gashub.getMsgGasParams({
                msgTypeUrls: [],
                pagination: {
                  countTotal: true,
                  key: Uint8Array.from([]),
                  limit: Long.fromInt(10),
                  offset: Long.fromInt(0),
                  reverse: false,
                },
              });

              console.log('gasfeeList', gasfeeList);
            }}
          >
            get gasfeeList
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
        <li>
          <button
            onClick={async () => {
              const res = await client.sp.getSPUrlByBucket('dfggdf');
              console.log('res', res);
            }}
          >
            getSPUrlByBucket
          </button>
        </li>
      </ul>
    </>
  );
};
