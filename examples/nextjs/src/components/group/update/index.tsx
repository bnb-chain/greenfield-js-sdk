import { client } from '@/client';
import { GRNToString, newGroupGRN, toTimestamp } from '@bnb-chain/greenfield-js-sdk';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const GroupUpdate = () => {
  const { address } = useAccount();
  const [groupName, setGroupName] = useState('');

  return (
    <div>
      <h3>group update</h3>
      <input
        placeholder="group name"
        onChange={(e) => {
          setGroupName(e.target.value);
        }}
      />
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const date = new Date();
          date.setDate(date.getDate() + 1);

          const updateGroupTx = await client.group.updateGroupMember({
            operator: address,
            groupOwner: address,
            groupName: groupName,
            membersToAdd: [
              {
                expirationTime: toTimestamp(date),
                member: '0x903904936a4328fac5477c0d96acf2E2bCaCD33d',
              },
            ],
            membersToDelete: [],
          });

          const simulateInfo = await updateGroupTx.simulate({
            denom: 'BNB',
          });

          console.log(simulateInfo);

          const res = await updateGroupTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo.gasLimit),
            gasPrice: simulateInfo.gasPrice,
            payer: address,
            granter: '',
          });

          console.log('res', res);
        }}
      >
        update group (add)
      </button>
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const updateGroupTx = await client.group.updateGroupMember({
            operator: address,
            groupOwner: address,
            groupName: groupName,
            membersToAdd: [],
            membersToDelete: ['0x903904936a4328fac5477c0d96acf2E2bCaCD33d'],
          });

          const simulateInfo = await updateGroupTx.simulate({
            denom: 'BNB',
          });

          console.log(simulateInfo);

          const res = await updateGroupTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo.gasLimit),
            gasPrice: simulateInfo.gasPrice,
            payer: address,
            granter: '',
          });

          console.log('res', res);
        }}
      >
        update group (delete)
      </button>
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const updateGroupTx = await client.group.updateGroupExtra({
            operator: address,
            groupOwner: address,
            groupName: groupName,
            extra: String(Math.random() * 10000000000000),
          });

          const simulateInfo = await updateGroupTx.simulate({
            denom: 'BNB',
          });

          console.log(simulateInfo);

          const res = await updateGroupTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo.gasLimit),
            gasPrice: simulateInfo.gasPrice,
            payer: address,
            granter: '',
          });

          console.log('res', res);
        }}
      >
        updateGroupExtra
      </button>
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const resource = GRNToString(newGroupGRN(address, groupName));

          const updateGroupTx = await client.storage.setTag({
            operator: address,
            resource,
            // tags: {
            //   tags: [],
            // },
            tags: {
              tags: [
                {
                  key: 'x',
                  value: 'xx',
                },
              ],
            },
          });

          const simulateInfo = await updateGroupTx.simulate({
            denom: 'BNB',
          });

          console.log(simulateInfo);

          const res = await updateGroupTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo.gasLimit),
            gasPrice: simulateInfo.gasPrice,
            payer: address,
            granter: '',
          });

          console.log('res', res);
        }}
      >
        update group tags
      </button>
    </div>
  );
};
