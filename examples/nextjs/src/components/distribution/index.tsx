import { client } from '@/client';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const Distribution = () => {
  const { address, connector } = useAccount();
  const [createGroupInfo, setCreateGroupInfo] = useState({
    groupName: '',
  });

  return (
    <div>
      <h3>distribution</h3>

      <button
        onClick={async () => {
          if (!address) return;

          const tx = await client.distribution.setWithdrawAddress({
            delegatorAddress: address,
            withdrawAddress: '0xCdB16f541e1445150f9211Dd564668eb01b26E75',
          });

          // const simuluateInfo = await tx.simulate({
          //   denom: 'BNB',
          // });

          // console.log('simuluateInfo', simuluateInfo);
          const res = await tx.broadcast({
            denom: 'BNB',
            gasLimit: Number(210000),
            gasPrice: '5000000000',
            payer: address,
            granter: '',
          });

          console.log('res', res);

          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        setWithdrawAddress
      </button>
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const tx = await client.distribution.withdrawDelegatorReward({
            delegatorAddress: address,
            validatorAddress: '0xCdB16f541e1445150f9211Dd564668eb01b26E75',
          });

          // const simuluateInfo = await tx.simulate({
          //   denom: 'BNB',
          // });

          // console.log('simuluateInfo', simuluateInfo);
          const res = await tx.broadcast({
            denom: 'BNB',
            gasLimit: Number(210000),
            gasPrice: '5000000000',
            payer: address,
            granter: '',
          });

          console.log('res', res);

          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        withdrawDelegatorReward
      </button>
    </div>
  );
};
