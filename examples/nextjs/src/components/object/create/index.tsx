import { client, selectSp } from '@/client';
import { ACCOUNT_PRIVATEKEY } from '@/config/env';
import { FileHandler } from '@bnb-chain/greenfiled-file-handle';
import { ChangeEvent, useState } from 'react';
import { useAccount } from 'wagmi';

export const CreateObject = () => {
  const { address } = useAccount();
  const [file, setFile] = useState<File>();
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

            /* const spInfo = await selectSp();
            console.log('spInfo', spInfo); */

            const fileBytes = await file.arrayBuffer();
            const hashResult = await FileHandler.getPieceHashRoots(new Uint8Array(fileBytes));
            const { contentLength, expectCheckSums } = hashResult;

            const createObjectTx = await client.object.createObject({
              bucketName: createObjectInfo.bucketName,
              objectName: createObjectInfo.objectName,
              creator: address,
              visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
              fileType: file.type,
              redundancyType: 'REDUNDANCY_EC_TYPE',
              contentLength,
              expectCheckSums,
              signType: 'authTypeV1',
              privateKey: ACCOUNT_PRIVATEKEY,
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
            }

            // const uploadRes = await client.object.uploadObject({
            //   bucketName: createObjectInfo.bucketName,
            //   objectName: createObjectInfo.objectName,
            //   body: file,
            //   txnHash: res.transactionHash,
            //   endpoint: spInfo.endpoint,
            //   signType: 'authTypeV2',
            // });
            // console.log('uploadRes', uploadRes);

            // if (uploadRes.code === 0) {
            //   alert('success');
            // }
          }}
        >
          create object and upload file
        </button>
        <br />
        <button
          onClick={async () => {
            if (!address) return;

            const createFolderTx = await client.object.createFolder(
              {
                bucketName: createObjectInfo.bucketName,
                objectName: createObjectInfo.objectName + '/',
                creator: address,
              },
              {
                signType: 'authTypeV1',
                privateKey: ACCOUNT_PRIVATEKEY,
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
