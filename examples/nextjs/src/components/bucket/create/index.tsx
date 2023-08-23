import { client, selectSp } from '@/client';
import { ACCOUNT_PRIVATEKEY } from '@/config/env';
import { getOffchainAuthKeys } from '@/utils/offchainAuth';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const CreateBucket = () => {
  const { address, connector } = useAccount();
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
          console.log('spInfo', spInfo);

          const provider = await connector?.getProvider();
          const offChainData = await getOffchainAuthKeys(address, provider);
          if (!offChainData) {
            alert('No offchain, please create offchain pairs first');
            return;
          }

          const createBucketTx = await client.bucket.createBucket(
            {
              bucketName: createBucketInfo.bucketName,
              creator: address,
              visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
              chargedReadQuota: '0',
              spInfo: {
                primarySpAddress: spInfo.primarySpAddress,
              },
              paymentAddress: address,
            },
            {
              // type: 'ECDSA',
              // privateKey: ACCOUNT_PRIVATEKEY,
              type: 'EDDSA',
              domain: window.location.origin,
              seed: offChainData.seedString,
              address,
            },
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
    </>
  );
};
