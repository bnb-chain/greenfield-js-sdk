import { client, selectSp } from '@/client';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const MigrateBucket = () => {
  const { address } = useAccount();
  const [bucketName, setBucketName] = useState('');

  return (
    <>
      <h4>Migrate Bucket</h4>
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

          const spInfo = await selectSp();

          const migrateBucketTx = await client.bucket.migrateBucket({
            params: {
              bucketName,
              operator: address,
              dstPrimarySpId: spInfo.id,
            },
            spInfo,
            signType: 'authTypeV2',
          });

          const simulateInfo = await migrateBucketTx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await migrateBucketTx.broadcast({
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
