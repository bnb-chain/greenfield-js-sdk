import { client } from '@/client';
import { ACCOUNT_PRIVATEKEY } from '@/config/env';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';
import {
  bytesFromBase64,
  Long,
  RedundancyType,
  VisibilityType,
  OnProgressEvent,
} from '@bnb-chain/greenfield-js-sdk';
import { ReedSolomon } from '@bnb-chain/reed-solomon';
import { ChangeEvent, useState } from 'react';
import { useAccount } from 'wagmi';

export const DelegrateObject = () => {
  const { address, connector } = useAccount();
  const [file, setFile] = useState<File>();
  const [txHash, setTxHash] = useState<string>();
  const [createObjectInfo, setCreateObjectInfo] = useState({
    bucketName: '',
    objectName: '',
  });

  return (
    <div>
      <>
        <h4>Create Object and uploading by delegated agent</h4>
        bucket name :
        <input
          value={createObjectInfo.bucketName}
          placeholder="bucket name"
          onChange={(e) => {
            setCreateObjectInfo({ ...createObjectInfo, bucketName: e.target.value });
          }}
        />
        <br />
        object name :
        <input
          value={createObjectInfo.objectName}
          placeholder="object name"
          onChange={(e) => {
            setCreateObjectInfo({ ...createObjectInfo, objectName: e.target.value });
          }}
        />
        <br />
        <input
          type="file"
          placeholder="select a file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
        />
        <br />
        <button
          onClick={async () => {
            if (!address || !file) return;

            const provider = await connector?.getProvider();
            const offChainData = await getOffchainAuthKeys(address, provider);
            if (!offChainData) {
              alert('No offchain, please create offchain pairs first');
              return;
            }

            const uploadRes = await client.object.delegateUploadObject(
              {
                bucketName: createObjectInfo.bucketName,
                objectName: createObjectInfo.objectName,
                body: file,
                delegatedOpts: {
                  visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
                },
                onProgress: (e: OnProgressEvent) => {
                  console.log('progress: ', e.percent);
                },
              },
              {
                type: 'ECDSA',
                privateKey: ACCOUNT_PRIVATEKEY,
                // type: 'EDDSA',
                // domain: window.location.origin,
                // seed: offChainData.seedString,
                // address,
              },
            );
            console.log('uploadRes', uploadRes);

            if (uploadRes.code === 0) {
              alert('success');
            }
          }}
        >
          * delegated upload
        </button>{' '}
        <button
          onClick={async () => {
            if (!address || !file) return;

            const provider = await connector?.getProvider();
            const offChainData = await getOffchainAuthKeys(address, provider);
            if (!offChainData) {
              alert('No offchain, please create offchain pairs first');
              return;
            }

            const uploadRes = await client.object.delegateUploadObject(
              {
                bucketName: createObjectInfo.bucketName,
                objectName: createObjectInfo.objectName,
                body: file,
                timeout: 20000,
                delegatedOpts: {
                  visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
                },
                resumableOpts: {
                  partSize: 1024 * 1024 * 16,
                  disableResumable: false,
                },
              },
              {
                type: 'EDDSA',
                domain: window.location.origin,
                seed: offChainData.seedString,
                address,
              },
            );
            console.log('uploadRes', uploadRes);

            if (uploadRes.code === 0) {
              alert('success');
            }
          }}
        >
          * delegated resumable upload (part size is 16mb)
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

            const res = await client.object.getObjectUploadProgress(
              createObjectInfo.bucketName,
              createObjectInfo.objectName,
              {
                type: 'EDDSA',
                domain: window.location.origin,
                seed: offChainData.seedString,
                address,
              },
            );

            alert('progress: ' + res);
          }}
        >
          get object's upload progress
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

            const res = await client.object.delegateCreateFolder(
              {
                bucketName: createObjectInfo.bucketName,
                objectName: createObjectInfo.objectName,
                delegatedOpts: {
                  visibility: VisibilityType.VISIBILITY_TYPE_PUBLIC_READ,
                },
              },
              {
                type: 'EDDSA',
                domain: window.location.origin,
                seed: offChainData.seedString,
                address,
              },
            );

            console.log('res', res);

            if (res.code === 0) {
              alert('success');
            }
          }}
        >
          delegate create folder
        </button>
      </>
    </div>
  );
};
