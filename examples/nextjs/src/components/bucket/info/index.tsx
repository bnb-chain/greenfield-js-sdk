import { client, selectSp } from '@/client';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const BucketInfo = () => {
  const { address, connector } = useAccount();
  const [bucketName, setBucketName] = useState('');
  const [bucketId, setBucketId] = useState('');

  return (
    <div>
      <h4>bucket info</h4>
      <div>
        bucket name:
        <input type="text" value={bucketName} onChange={(e) => setBucketName(e.target.value)} />
        <br />
        <button
          onClick={async () => {
            const bucketInfo = await client.bucket.headBucket(bucketName);
            console.log(bucketInfo);
          }}
        >
          get bucket info by name
        </button>
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

            const startTimeStamp = Math.round(Date.now() / 1000) - 3600 * 24 * 2;
            const endTimeStamp = Math.round(Date.now() / 1000);

            const bucketInfo = await client.bucket.listBucketReadRecords(
              {
                bucketName,
                startTimeStamp,
                endTimeStamp,
                maxRecords: 1000,
              },
              {
                type: 'EDDSA',
                domain: window.location.origin,
                seed: offChainData.seedString,
                address,
              },
            );
            console.log(bucketInfo);
          }}
        >
          get bucket read records
        </button>
        <br />
        <button
          onClick={async () => {
            const sp = await selectSp();
            const bucketInfo = await client.bucket.getBucketMeta({
              bucketName,
              endpoint: sp.endpoint,
            });
            console.log(bucketInfo);
          }}
        >
          get bucket meta info by name
        </button>
      </div>

      <div>
        bucket id:
        <input type="text" value={bucketId} onChange={(e) => setBucketId(e.target.value)} />
        <br />
        <button
          onClick={async () => {
            const bucketInfo = await client.bucket.headBucketById(bucketId);
            console.log(bucketInfo);
          }}
        >
          get bucket info by id
        </button>
      </div>

      <div style={{ marginTop: 15 }} />

      <div>
        get bucket by address:
        <div>
          <button
            onClick={async () => {
              if (!address) return;

              const spInfo = await selectSp();

              const res = await client.bucket.listBuckets({
                address,
                endpoint: spInfo.endpoint,
              });
              console.log(res);
            }}
          >
            get buckets
          </button>
        </div>
      </div>
    </div>
  );
};
