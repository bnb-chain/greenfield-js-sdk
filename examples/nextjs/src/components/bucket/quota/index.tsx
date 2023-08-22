import { client } from '@/client';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const BucketQuota = () => {
  const { address, connector } = useAccount();
  const [bucketName, setBucketName] = useState('');

  return (
    <div>
      <h4>bucket quota</h4>
      <div>
        bucket name:
        <input type="text" value={bucketName} onChange={(e) => setBucketName(e.target.value)} />
        <br />
        <button
          onClick={async () => {
            if (!address) return;

            const provider = await connector?.getProvider();
            const offChainData = await getOffchainAuthKeys(address, provider);
            if (!offChainData) {
              alert('No offchain, please create offchain pairs first');
              return;
            }

            const bucketQuota = await client.bucket.getBucketReadQuota(
              {
                bucketName,
              },
              {
                type: 'EDDSA',
                seed: offChainData.seedString,
                domain: window.location.origin,
                address,
              },
            );
            console.log(bucketQuota);
          }}
        >
          get bucket quota info
        </button>
      </div>
    </div>
  );
};
