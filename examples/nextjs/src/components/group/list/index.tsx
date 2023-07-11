import { client } from '@/client';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const ListGroup = () => {
  const { address } = useAccount();
  const [groupName, setGroupName] = useState('');
  const [prefix, setPrefix] = useState('');

  return (
    <div>
      <h3>group list</h3>
      <input
        placeholder="prefix"
        onChange={(e) => {
          setPrefix(e.target.value);
        }}
      />
      <input
        placeholder="group name"
        onChange={(e) => {
          setGroupName(e.target.value);
        }}
      />
      <button
        onClick={async () => {
          if (!address) return;

          const groupList = await client.sp.listGroup(groupName, prefix, {
            sourceType: 'SOURCE_TYPE_ORIGIN',
            limit: 1000,
            offset: 0,
          });

          console.log(groupList);
        }}
      >
        get group list
      </button>
    </div>
  );
};
