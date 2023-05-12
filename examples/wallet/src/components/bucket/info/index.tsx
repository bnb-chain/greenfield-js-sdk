import { client } from '@/client';
import { useState } from 'react';

export const BucketInfo = () => {
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
    </div>
  );
};
