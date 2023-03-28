import { getSpStoragePriceByTime, getBucketInfo } from '@/client';
import { GRPC_URL } from '@/config';
import { useState } from 'react';

export const BucketInfo = () => {
  const [bucketName, setBucketName] = useState('');

  return (
    <div>
      <h4>bucket info</h4>
      <div>
        bucket name:
        <input type="text" value={bucketName} onChange={(e) => setBucketName(e.target.value)} />
        <br />
        <button
          onClick={async () => {
            await getSpStoragePriceByTime();
            const bucketInfo = await getBucketInfo(GRPC_URL, bucketName);
            console.log(bucketInfo);
          }}
        >
          get bucket info
        </button>
      </div>
    </div>
  );
};
