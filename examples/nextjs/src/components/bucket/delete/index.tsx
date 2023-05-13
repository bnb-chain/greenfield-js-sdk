import { client } from '@/client';
import { ISimulateGasFee } from '@bnb-chain/greenfield-chain-sdk';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const DeleteBucket = () => {
  const { address } = useAccount();
  const [bucketName, setBucketName] = useState('');
  const [simulateInfo, setSimulateInfo] = useState<ISimulateGasFee | null>(null);

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
      <button
        onClick={async () => {
          if (!address) return;

          const res = await client.bucket.deleteBucket(
            {
              bucketName: bucketName,
              operator: address,
            },
            {
              simulate: true,
              denom: 'BNB',
              gasLimit: 210000,
              gasPrice: '5000000000',
              payer: address,
              granter: '',
            },
          );
          setSimulateInfo(res);
          console.log('res', res);
        }}
      >
        simulate
      </button>
      <br />
      gasFee {simulateInfo?.gasFee}
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const res = await client.bucket.deleteBucket(
            {
              bucketName: bucketName,
              operator: address,
            },
            {
              simulate: false,
              denom: 'BNB',
              gasLimit: 210000,
              gasPrice: '5000000000',
              payer: address,
              granter: '',
            },
          );
          console.log('res', res);

          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        broadcast
      </button>
    </>
  );
};
