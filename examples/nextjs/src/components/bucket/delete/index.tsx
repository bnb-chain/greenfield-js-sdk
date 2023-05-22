import { client } from '@/client';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const DeleteBucket = () => {
  const { address } = useAccount();
  const [bucketName, setBucketName] = useState('');

  return (
    <>
      <h4>Delete Bucket</h4>
      <div>
        bucket name:
        <input
          onChange={(e) => {
            setBucketName(e.target.value);
          }}
        />
        <br />
      </div>
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const deleteBucketTx = await client.bucket.deleteBucket({
            bucketName: bucketName,
            operator: address,
          });

          const simulateInfo = await deleteBucketTx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await deleteBucketTx.broadcast({
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
    </>
  );
};
