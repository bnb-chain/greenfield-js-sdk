import { client } from '@/client';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const DeleteObject = () => {
  const { address } = useAccount();
  const [bucketName, setBucketName] = useState('');
  const [objectName, setObjectName] = useState('');

  return (
    <>
      <h4>Delete Object</h4>
      <div>
        bucket name:
        <input
          onChange={(e) => {
            setBucketName(e.target.value);
          }}
        />
        <br />
        object name:
        <input
          onChange={(e) => {
            setObjectName(e.target.value);
          }}
        />
        <br />
        <button
          onClick={async () => {
            if (!address) return;

            const deleteObjectTx = await client.object.deleteObject({
              bucketName,
              objectName,
              operator: address,
            });

            const simulateInfo = await deleteObjectTx.simulate({
              denom: 'BNB',
            });

            console.log('simulateInfo', simulateInfo);

            const res = await deleteObjectTx.broadcast({
              denom: 'BNB',
              gasLimit: Number(simulateInfo?.gasLimit),
              gasPrice: simulateInfo?.gasPrice || '5000000000',
              payer: address,
              granter: '',
            });

            console.log('res', res);
            if (res.code === 0) {
              alert('success');
            }
          }}
        >
          broadcast with simulate
        </button>
      </div>
    </>
  );
};
