import { getObjectInfo } from '@/client';
import { GRPC_URL } from '@/config';
import { useState } from 'react';

export const ObjectInfo = () => {
  const [bucketName, setBucketName] = useState('');
  const [objectName, setObjectName] = useState('');

  return (
    <div>
      <h4>object info</h4>
      <div>
        <div>
          bucket name:
          <input type="text" value={bucketName} onChange={(e) => setBucketName(e.target.value)} />
        </div>
        <div>
          object name:
          <input type="text" value={objectName} onChange={(e) => setObjectName(e.target.value)} />
        </div>
        <button
          onClick={async () => {
            const objInfo = await getObjectInfo(GRPC_URL, bucketName, objectName);
            console.log(objInfo);
          }}
        >
          get obj info
        </button>
      </div>
    </div>
  );
};
