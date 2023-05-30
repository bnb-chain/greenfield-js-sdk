import { client, selectSp } from '@/client';
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
            const objInfo = await client.object.headObject(bucketName, objectName);
            console.log(objInfo);
          }}
        >
          get obj info
        </button>

        <br />

        <div>
          get object by bucket name
          <br />
          <button
            onClick={async () => {
              const spInfo = await selectSp();

              const res = await client.object.listObjects({
                bucketName,
                endpoint: spInfo.endpoint,
                signType: 'authTypeV2',
              });
              console.log('res', res);
            }}
          >
            list objects
          </button>
        </div>
      </div>
    </div>
  );
};
