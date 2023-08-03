import { client } from '@/client';
import { PermissionTypes, TimestampTypes } from '@bnb-chain/greenfield-js-sdk';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const ObjectPolicy = () => {
  const { address } = useAccount();
  const [policyObjectInfo, setPolicyObjectInfo] = useState({
    bucketName: '',
    objectName: '',
  });

  return (
    <>
      <h4>Put Object Policy</h4>
      bucket name :
      <input
        value={policyObjectInfo.bucketName}
        placeholder="bucket name"
        onChange={(e) => {
          setPolicyObjectInfo({ ...policyObjectInfo, bucketName: e.target.value });
        }}
      />
      <br />
      object name :
      <input
        value={policyObjectInfo.objectName}
        placeholder="object name"
        onChange={(e) => {
          setPolicyObjectInfo({ ...policyObjectInfo, objectName: e.target.value });
        }}
      />
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const statement: PermissionTypes.Statement = {
            effect: PermissionTypes.Effect.EFFECT_ALLOW,
            actions: [PermissionTypes.ActionType.ACTION_GET_OBJECT],
            resources: [''],
          };

          const tx = await client.object.putObjectPolicy(
            policyObjectInfo.bucketName,
            policyObjectInfo.objectName,
            {
              operator: address,
              statements: [statement],
              principal: {
                type: PermissionTypes.PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
                value: '0x0000000000000000000000000000000000000001',
              },
            },
          );

          const simulateInfo = await tx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await tx.broadcast({
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
        put object policy
      </button>
    </>
  );
};
