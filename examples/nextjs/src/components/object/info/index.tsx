import { client, selectSp } from '@/client';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const ObjectInfo = () => {
  const { address, connector } = useAccount();
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
          get object info (headObject)
        </button>

        <br />

        <button
          onClick={async () => {
            const sp = await selectSp();
            const objInfo = await client.object.getObjectMeta({
              bucketName,
              objectName,
              endpoint: sp.endpoint,
            });
            console.log(objInfo);
          }}
        >
          get object meta info
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

            const res = await client.object.downloadFile(
              {
                bucketName,
                objectName,
              },
              {
                type: 'EDDSA',
                address,
                domain: window.location.origin,
                seed: offChainData.seedString,
              },
            );

            console.log(res);
          }}
        >
          download object info
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

            const res = await client.object.getObjectPreviewUrl(
              {
                bucketName,
                objectName,
                queryMap: {
                  view: '1',
                  'X-Gnfd-User-Address': address,
                  'X-Gnfd-App-Domain': window.location.origin,
                  'X-Gnfd-Expiry-Timestamp': '2023-09-03T09%3A23%3A39Z',
                },
              },
              {
                type: 'EDDSA',
                address,
                domain: window.location.origin,
                seed: offChainData.seedString,
              },
            );

            console.log(res);
          }}
        >
          get object preview url
        </button>

        <br />

        <div>
          listObjectPolicies by bucket name and object name
          <br />
          <button
            onClick={async () => {
              const res = await client.object.listObjectPolicies({
                bucketName,
                objectName,
                actionType: 'ACTION_GET_OBJECT',
              });

              console.log('res', res);
            }}
          >
            listObjectPolicies
          </button>
        </div>

        <div>
          get objects list by bucket name
          <br />
          <button
            onClick={async () => {
              const spInfo = await selectSp();

              const res = await client.object.listObjects({
                bucketName,
                endpoint: spInfo.endpoint,
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
