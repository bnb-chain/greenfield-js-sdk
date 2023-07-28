import { client } from '@/client';
import { useState } from 'react';
import { CreateObj } from './createObj';
import { DelObj } from './delObj';

export const FeeGrant = () => {
  const [account, setAccount] = useState('');

  return (
    <>
      <h2>fee grant</h2>
      <h3>Query grant of account</h3>
      account:
      <input
        value={account}
        placeholder="account"
        onChange={(e) => {
          setAccount(e.target.value);
        }}
      />
      <button
        onClick={async () => {
          if (!account) return;

          const res = await client.feegrant.getAllowences({
            grantee: account,
          });
          console.log('res', res);
        }}
      >
        get grant of account
      </button>
      <CreateObj />
      <DelObj />
    </>
  );
};
