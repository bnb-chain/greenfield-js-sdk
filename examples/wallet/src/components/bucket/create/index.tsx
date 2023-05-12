import { client, selectSp } from '@/client';
import { ISimulateGasFee } from '@bnb-chain/greenfield-chain-sdk';
import { useState } from 'react';
import { useAccount } from 'wagmi';

interface IApprovalCreateBucket {
  type: string;
  value: {
    bucket_name: string;
    creator: string;
    visibility: string;
    primary_sp_address: string;
    primary_sp_approval: {
      expired_height: string;
      sig: string;
    };
    charged_read_quota: number;
    redundancy_type: string;
  };
}

export const CreateBucket = () => {
  const { address } = useAccount();
  const [createBucketInfo, setCreateBucketInfo] = useState<{
    bucketName: string;
  }>({
    bucketName: '',
  });
  const [simulateInfo, setSimulateInfo] = useState<ISimulateGasFee | null>(null);

  return (
    <>
      <h4>Create Bucket</h4>
      bucket name :
      <input
        value={createBucketInfo.bucketName}
        placeholder="bucket name"
        onChange={(e) => {
          setCreateBucketInfo({ ...createBucketInfo, bucketName: e.target.value });
        }}
      />
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const spInfo = await selectSp();
          const res = await client.bucket.createBucket(
            {
              bucketName: createBucketInfo.bucketName,
              creator: address,
              visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
              chargedReadQuota: '0',
              spInfo,
            },
            {
              simulate: true,
              denom: 'BNB',
              gasLimit: 210000,
              gasPrice: '5000000000',
              payer: address,
              granter: '',
            },
          );
          setSimulateInfo(res);
          console.log('res', res);
        }}
      >
        simulate
      </button>
      <br />
      gasFee: {simulateInfo?.gasFee}
      <br />
      <button
        onClick={async () => {
          if (!address) {
            return;
          }

          const spInfo = await selectSp();
          const res = await client.bucket.createBucket(
            {
              bucketName: createBucketInfo.bucketName,
              creator: address,
              visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
              chargedReadQuota: '0',
              spInfo,
            },
            {
              simulate: false,
              denom: 'BNB',
              gasLimit: Number(simulateInfo?.gasLimit),
              gasPrice: simulateInfo?.gasPrice || '5000000000',
              payer: address,
              granter: '',
            },
          );
          setSimulateInfo(res);
          console.log('res', res);
          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        broadcast
      </button>
    </>
  );
};
