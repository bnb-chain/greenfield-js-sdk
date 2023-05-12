import { client } from '@/client';
import { GRPC_URL } from '@/config';
import { CreateObjectTx, ISignature712, ISpInfo } from '@bnb-chain/greenfield-chain-sdk';
import { ChangeEvent, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

interface IApprovalCreateObject {
  bucket_name: string;
  content_type: string;
  creator: string;
  expect_checksums: string[];
  visibility: number;
  object_name: string;
  payload_size: string;
  primary_sp_approval: {
    expired_height: string;
    sig: string;
  };
  expect_secondary_sp_addresses: string[];
  redundancy_type: number;
}

const selectSp = async () => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter((v: any) => v?.description?.moniker !== 'QATest');
  const selectIndex = 0;
  const secondarySpAddresses = [
    ...finalSps.slice(0, selectIndex),
    ...finalSps.slice(selectIndex + 1),
  ].map((item) => item.operatorAddress);
  const selectSpInfo = {
    endpoint: finalSps[selectIndex].endpoint,
    primarySpAddress: finalSps[selectIndex]?.operatorAddress,
    sealAddress: finalSps[selectIndex].sealAddress,
    secondarySpAddresses,
  };
  return selectSpInfo;
};

export const CreateObject = () => {
  const { address } = useAccount();
  const [file, setFile] = useState<File>();
  const [createObjectInfo, setCreateObjectInfo] = useState({
    bucketName: '',
    objectName: '',
  });

  return (
    <div>
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

          const spInfo = await selectSp();
          const res = await client.object.createObject(
            {
              bucketName: createObjectInfo.bucketName,
              objectName: createObjectInfo.objectName,
              spInfo,
              file,
              creator: address,
              expectSecondarySpAddresses: [],
            },
            {
              simulate: false,
              denom: 'BNB',
              gasLimit: 210000,
              gasPrice: '5000000000',
              payer: address,
              granter: '',
            },
          );

          console.log('res', res);

          const uploadRes = await client.object.uploadObject({
            bucketName: createObjectInfo.bucketName,
            objectName: createObjectInfo.objectName,
            body: file,
            txnHash: res.transactionHash,
            endpoint: spInfo.endpoint,
          });
          console.log('uploadRes', uploadRes);

          if (uploadRes.code === 0) {
            alert('success');
          }
        }}
      >
        create object and upload file
      </button>
    </div>
  );
};
