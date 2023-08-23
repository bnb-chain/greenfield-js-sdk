import { client, selectSp } from '@/client';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const MigrateBucket = () => {
  const { address, connector } = useAccount();
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

          const destinationSpInfo = await selectSp();
          const provider = await connector?.getProvider();
          const offChainData = await getOffchainAuthKeys(address, provider);
          if (!offChainData) {
            alert('No offchain, please create offchain pairs first');
            return;
          }

          const migrateBucketTx = await client.bucket.migrateBucket(
            {
              bucketName,
              operator: address,
              dstPrimarySpId: destinationSpInfo.id,
            },
            {
              type: 'EDDSA',
              address,
              domain: window.location.origin,
              seed: offChainData.seedString,
            },
          );

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
