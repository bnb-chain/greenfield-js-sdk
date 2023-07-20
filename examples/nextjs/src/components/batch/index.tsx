import { client, selectSp } from '@/client';
import {
  GRNToString,
  MsgCreateObjectTypeUrl,
  newBucketGRN,
  PermissionTypes,
} from '@bnb-chain/greenfield-chain-sdk';
import { Wallet } from '@ethersproject/wallet';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const FeeGrant = () => {
  const { address } = useAccount();
  const [bucketName, setBucketName] = useState<string>('');

  return (
    <>
      <h4>Feegrant</h4>
      bucket name :
      <input
        value={bucketName}
        placeholder="bucket name"
        onChange={(e) => {
          setBucketName(e.target.value);
        }}
      />
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          // 1. create temporary account
          const wallet = Wallet.createRandom();
          console.log('wallet', wallet, wallet.privateKey);

          // 2. allow temporary account to submit specified tx and amount
          const grantAllowanceTx = await client.feegrant.grantAllowance({
            granter: address,
            grantee: wallet.address,
            allowedMessages: [MsgCreateObjectTypeUrl],
            amount: '100000000000000000',
            denom: 'BNB',
          });

          // 3. Put bucket policy so that the temporary account can create objects within this bucket
          const statement: PermissionTypes.Statement = {
            effect: PermissionTypes.Effect.EFFECT_ALLOW,
            actions: [PermissionTypes.ActionType.ACTION_CREATE_OBJECT],
            resources: [GRNToString(newBucketGRN(bucketName))],
          };
          const putPolicyTx = await client.bucket.putBucketPolicy(bucketName, {
            operator: address,
            statements: [statement],
            principal: {
              type: PermissionTypes.PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
              value: wallet.address,
            },
          });

          // 4. broadcast txs include 2 msg
          const txs = await client.basic.multiTx([grantAllowanceTx, putPolicyTx]);
          const simuluateInfo = await txs.simulate({
            denom: 'BNB',
          });

          console.log('simuluateInfo', simuluateInfo);
          const res = await txs.broadcast({
            denom: 'BNB',
            gasLimit: Number(210000),
            gasPrice: '5000000000',
            payer: address,
            granter: '',
          });

          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        feegrant
      </button>
    </>
  );
};
