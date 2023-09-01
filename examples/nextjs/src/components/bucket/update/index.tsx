import { client } from '@/client';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const UpdateBucket = () => {
  const { address } = useAccount();
  const [bucketName, setBucketName] = useState('');

  return (
    <>
      <h4>Update Bucket</h4>
      <div>
        bucket name:
        <input
          onChange={(e) => {
            setBucketName(e.target.value);
          }}
        />
      </div>
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const updateBucketTx = await client.bucket.updateBucketInfo({
            bucketName: bucketName,
            operator: address,
            visibility: 1,
            paymentAddress: address,
            chargedReadQuota: '100',
          });

          const simulateInfo = await updateBucketTx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await updateBucketTx.broadcast({
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
