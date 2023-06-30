import { client, selectSp } from '@/client';
import { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

export const CreateBucket = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [createBucketInfo, setCreateBucketInfo] = useState<{
    bucketName: string;
  }>({
    bucketName: '',
  });

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

          const { body: signedMsg } = await client.bucket.getCreateBucketApproval({
            bucketName: createBucketInfo.bucketName,
            creator: address,
            visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
            chargedReadQuota: '0',
            spInfo,
            signType: 'authTypeV2',
          });

          if (!signedMsg) throw new Error('failed to get approval message');

          const createBucketTx = await client.bucket.createBucket(
            {
              bucketName: createBucketInfo.bucketName,
              creator: address,
              visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
              chargedReadQuota: '0',
              spInfo,
              signType: 'authTypeV2',
            },
            signedMsg.primary_sp_approval,
          );

          const simulateInfo = await createBucketTx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await createBucketTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || '5000000000',
            payer: address,
            granter: '',
          });

          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        broadcast with simulate
      </button>
      <br />
      {/*       <button
        onClick={async () => {
          if (!address) return;
          const domain = window.location.origin;
          const key = `${address}-${chain?.id}`;
          const spInfo = await selectSp();
          const { seedString } = JSON.parse(localStorage.getItem(key) || '{}');
          const createBucketTx = await client.bucket.createBucket({
            bucketName: createBucketInfo.bucketName,
            creator: address,
            visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
            chargedReadQuota: '0',
            spInfo,
            signType: 'offChainAuth',
            domain,
            seedString,
          });

          const simulateInfo = await createBucketTx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await createBucketTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || '5000000000',
            payer: address,
            granter: '',
          });

          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        broadcast with simulate with offChainAuth
      </button> */}
    </>
  );
};
