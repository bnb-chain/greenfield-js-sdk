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
    </div>
  );
};
