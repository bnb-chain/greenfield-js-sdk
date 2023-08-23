import { client } from '@/client';
import { ACCOUNT_PRIVATEKEY } from '@/config/env';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';
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
        <button
          onClick={async () => {
            if (!address || !file) {
              alert('Please select a file or address');
              return;
            }

            const provider = await connector?.getProvider();
            const offChainData = await getOffchainAuthKeys(address, provider);
            if (!offChainData) {
              alert('No offchain, please create offchain pairs first');
              return;
            }

            const fileBytes = await file.arrayBuffer();
            const hashResult = await (window as any).FileHandle.getCheckSums(
              new Uint8Array(fileBytes),
            );
            const { contentLength, expectCheckSums } = hashResult;

            console.log('offChainData', offChainData);
            console.log('hashResult', hashResult);

            const createObjectTx = await client.object.createObject(
              {
                bucketName: createObjectInfo.bucketName,
                objectName: createObjectInfo.objectName,
                creator: address,
                visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
                fileType: file.type,
                redundancyType: 'REDUNDANCY_EC_TYPE',
                contentLength,
                expectCheckSums: JSON.parse(expectCheckSums),
              },
              {
                type: 'EDDSA',
                domain: window.location.origin,
                seed: offChainData.seedString,
                address,
                // type: 'ECDSA',
                // privateKey: ACCOUNT_PRIVATEKEY,
              },
            );

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
        </button>
        <br />
        <button
          onClick={async () => {
            if (!address || !file || !txHash) return;
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
          2. upload
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

            const createFolderTx = await client.object.createFolder(
              {
                bucketName: createObjectInfo.bucketName,
                objectName: createObjectInfo.objectName + '/',
                creator: address,
              },
              {
                type: 'EDDSA',
                domain: window.location.origin,
                seed: offChainData.seedString,
                address,
              },
            );

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
        </button>
      </>
    </div>
  );
};
