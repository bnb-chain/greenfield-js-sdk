import { client } from '@/client';
import { PermissionTypes } from '@bnb-chain/greenfield-js-sdk';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const GroupPolicy = () => {
  const { address } = useAccount();
  const [policyGroupInfo, setPolicyGroupInfo] = useState({
    groupName: '',
  });

  return (
    <>
      <h4>Group Policy</h4>
      group name :
      <input
        value={policyGroupInfo.groupName}
        placeholder="group name"
        onChange={(e) => {
          setPolicyGroupInfo({ ...policyGroupInfo, groupName: e.target.value });
        }}
      />
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const statement: PermissionTypes.Statement = {
            effect: PermissionTypes.Effect.EFFECT_ALLOW,
            actions: [PermissionTypes.ActionType.ACTION_UPDATE_GROUP_MEMBER],
            resources: [''],
          };

          const tx = await client.group.putGroupPolicy(address, policyGroupInfo.groupName, {
            operator: address,
            statements: [statement],
            principal: {
              type: PermissionTypes.PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
              value: '0x0000000000000000000000000000000000000001',
            },
          });

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
        put group policy
      </button>
    </>
  );
};
