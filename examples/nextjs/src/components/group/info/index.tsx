import { client } from '@/client';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const GroupInfo = () => {
  const { address } = useAccount();
  const [groupName, setGroupName] = useState('');

  return (
    <div>
      <h3>group info</h3>
      <input
        placeholder="group name"
        onChange={(e) => {
          setGroupName(e.target.value);
        }}
      />
      <button
        onClick={async () => {
          if (!address) return;

          const groupInfo = await client.group.headGroup(groupName, address);
          console.log('groupInfo', groupInfo);
        }}
      >
        get group info
      </button>
      <button
        onClick={async () => {
          if (!address) return;

          const headGroupMember = await client.group.headGroupMember(
            groupName,
            address,
            '0x903904936a4328fac5477c0d96acf2E2bCaCD33d',
          );
          console.log('headGroupMember', headGroupMember);
        }}
      >
        get group member info
      </button>
    </div>
  );
};
