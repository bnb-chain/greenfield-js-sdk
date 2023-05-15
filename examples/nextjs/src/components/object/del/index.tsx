import { client } from '@/client';
import { ISimulateGasFee } from '@bnb-chain/greenfield-chain-sdk';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const DeleteObject = () => {
  const { address } = useAccount();
  const [bucketName, setBucketName] = useState('');
  const [objectName, setObjectName] = useState('');
  const [simulateInfo, setSimulateInfo] = useState<ISimulateGasFee | null>(null);

  return (
    <>
      <h4>Delete Object</h4>
      <div>
        bucket name:
        <input
          onChange={(e) => {
            setBucketName(e.target.value);
          }}
        />
        <br />
        object name:
        <input
          onChange={(e) => {
            setObjectName(e.target.value);
          }}
        />
        <br />
        <button
          onClick={async () => {
            if (!address) return;

            const res = await client.object.deleteObject(
              {
                bucketName,
                objectName,
                operator: address,
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

            console.log('res', res);
            setSimulateInfo(res);
          }}
        >
          simulate
        </button>
        <br />
        gasFee: {simulateInfo?.gasFee}
        <br />
        <button
          onClick={async () => {
            if (!address) return;

            const res = await client.object.deleteObject(
              {
                bucketName,
                objectName,
                operator: address,
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

            console.log('res', res);

            if (res.code === 0) {
              alert('success');
            }
          }}
        >
          broadcast
        </button>
      </div>
    </>
  );
};
