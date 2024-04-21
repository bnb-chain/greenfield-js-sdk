import { client } from '@/client';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';
import {
  bytesFromBase64,
  Long,
  RedundancyType,
  VisibilityType,
} from '@bnb-chain/greenfield-js-sdk';
import { ReedSolomon } from '@bnb-chain/reed-solomon';
import { ChangeEvent, useState } from 'react';
import { useAccount } from 'wagmi';

export const CreateObject = () => {
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
        <h4>Create Object</h4>
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
        upload object with tx:{' '}
        <button
          onClick={async () => {
            if (!address || !file) {
              alert('Please select a file or address');
              return;
            }

            // const checksumWorker = getCheckSumsWorker();
            // const multiCal = await checksumWorker.generateCheckSumV2(file);
            // console.log('multiCal', multiCal);

            const rs = new ReedSolomon();
            const fileBytes = await file.arrayBuffer();
            const expectCheckSums = rs.encode(new Uint8Array(fileBytes));

            const createObjectTx = await client.object.createObject({
              bucketName: createObjectInfo.bucketName,
              objectName: createObjectInfo.objectName,
              creator: address,
              visibility: VisibilityType.VISIBILITY_TYPE_PRIVATE,
              contentType: file.type,
              redundancyType: RedundancyType.REDUNDANCY_EC_TYPE,
              payloadSize: Long.fromInt(fileBytes.byteLength),
              expectChecksums: expectCheckSums.map((x) => bytesFromBase64(x)),
            });

            const simulateInfo = await createObjectTx.simulate({
              denom: 'BNB',
            });

            console.log('simulateInfo', simulateInfo);

            const res = await createObjectTx.broadcast({
              denom: 'BNB',
              gasLimit: Number(simulateInfo?.gasLimit),
              gasPrice: simulateInfo?.gasPrice || '5000000000',
              payer: address,
              granter: '',
            });

            console.log('res', res);

            if (res.code === 0) {
              alert('create object tx success');

              setTxHash(res.transactionHash);
            }
          }}
        >
          1. create object tx
        </button>{' '}
        <button
          onClick={async () => {
            if (!address || !file) return;
            console.log(file);

            const provider = await connector?.getProvider();
            const offChainData = await getOffchainAuthKeys(address, provider);
            if (!offChainData) {
              alert('No offchain, please create offchain pairs first');
              return;
            }

            const uploadRes = await client.object.uploadObject(
              {
                bucketName: createObjectInfo.bucketName,
                objectName: createObjectInfo.objectName,
                body: file,
                txnHash: txHash,
                duration: 20000,
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
          * upload
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

            const uploadRes = await client.object.uploadObject(
              {
                bucketName: createObjectInfo.bucketName,
                objectName: createObjectInfo.objectName,
                body: file,
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
          * resumable upload(part size is 16MB)
        </button>
        <br />
        or uploaded by delegated agent :{' '}
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

            const createFolderTx = await client.object.createFolder({
              bucketName: createObjectInfo.bucketName,
              objectName: createObjectInfo.objectName + '/',
              creator: address,
              redundancyType: RedundancyType.REDUNDANCY_EC_TYPE,
              visibility: VisibilityType.VISIBILITY_TYPE_PRIVATE,
            });

            const simulateInfo = await createFolderTx.simulate({
              denom: 'BNB',
            });

            console.log('simulateInfo', simulateInfo);

            const res = await createFolderTx.broadcast({
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
          create folder
        </button>{' '}
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
