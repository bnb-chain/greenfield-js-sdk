import { client, selectSp } from '@/client';
import { Long } from '@bnb-chain/greenfield-chain-sdk';
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
      </ul>
      <button
        onClick={async () => {
          const xx = await client.payment.params();
          console.log(xx);
        }}
      >
        test222
      </button>

      <button
        onClick={async () => {
          const updateGroupTx = await client.group.updateGroupExtra({
            groupName: 'sdfsdfsdf2',
            groupOwner: address!,
            operator: address!,
            extra: 'sdsd',
          });

          const simulateInfo = await updateGroupTx.simulate({
            denom: 'BNB',
          });

          console.log(simulateInfo);

          const res = await updateGroupTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo.gasLimit),
            gasPrice: simulateInfo.gasPrice,
            payer: address!,
            granter: '',
          });

          console.log(res);
        }}
      >
        test
      </button>
    </>
  );
};
