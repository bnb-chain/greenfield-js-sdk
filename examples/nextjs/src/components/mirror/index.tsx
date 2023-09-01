import { client } from '@/client';
import { BSC_CHAIN_ID } from '@/config';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const Mirror = () => {
  const { address, connector } = useAccount();
  const [groupName, setGroupName] = useState('');

  return (
    <div>
      <h2>Mirror</h2>
      <h3>mirror group</h3>
      <input
        placeholder="group name"
        onChange={(e) => {
          setGroupName(e.target.value);
        }}
      />
      <button
        onClick={async () => {
          if (!address) return;

          const { groupInfo } = await client.group.headGroup(groupName, address);
          console.log(groupInfo, groupName);

          if (!groupInfo) return;

          const mirrorGroupTx = await client.crosschain.mirrorGroup({
            groupName: '',
            id: groupInfo.id,
            operator: address,
            destChainId: BSC_CHAIN_ID,
          });

          const simulateInfo = await mirrorGroupTx.simulate({
            denom: 'BNB',
          });

          console.log(simulateInfo);

          const res = await mirrorGroupTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo.gasLimit),
            gasPrice: simulateInfo.gasPrice,
            payer: address,
            granter: '',
            signTypedDataCallback: async (addr: string, message: string) => {
              const provider = await connector?.getProvider();
              return await provider?.request({
                method: 'eth_signTypedData_v4',
                params: [addr, message],
              });
            },
          });

          if (res.code === 0) {
            alert('mirror group success');
          }

          console.log('res', res);
        }}
      >
        mirror group
      </button>
    </div>
  );
};
