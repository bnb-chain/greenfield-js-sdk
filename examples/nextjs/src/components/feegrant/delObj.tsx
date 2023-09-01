import { client } from '@/client';
import {
  GRNToString,
  MsgDeleteObjectTypeUrl,
  newObjectGRN,
  PermissionTypes,
  toTimestamp,
} from '@bnb-chain/greenfield-js-sdk';
import { Wallet } from '@ethersproject/wallet';
import { useState } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';

export const DelObj = () => {
  const { address } = useAccount();
  const [bucketName, setBucketName] = useState<string>('');
  const [objectName, setObjectName] = useState<string>('');
  const [wallet, setWallet] = useState<Wallet | null>(null);

  return (
    <>
      <h3>grant account for deleting object</h3>
      bucket name :
      <input
        value={bucketName}
        placeholder="bucket name"
        onChange={(e) => {
          setBucketName(e.target.value);
        }}
      />
      <br />
      object name :
      <input
        value={objectName}
        placeholder="object name"
        onChange={(e) => {
          setObjectName(e.target.value);
        }}
      />
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          console.log(GRNToString(newObjectGRN(bucketName, objectName)));

          // 1. create temporary account
          const wallet = Wallet.createRandom();
          console.log('wallet', wallet.address, wallet.privateKey);
          setWallet(wallet);

          // 2. allow temporary account to submit specified tx and amount
          const date = new Date();
          date.setDate(date.getDate() + 1);
          const grantAllowanceTx = await client.feegrant.grantAllowance({
            granter: address,
            grantee: wallet.address,
            allowedMessages: [MsgDeleteObjectTypeUrl],
            amount: parseEther('0.09').toString(),
            denom: 'BNB',
            expirationTime: toTimestamp(date),
          });

          // 3. Put bucket policy so that the temporary account can create objects within this bucket
          const statement: PermissionTypes.Statement = {
            effect: PermissionTypes.Effect.EFFECT_ALLOW,
            actions: [PermissionTypes.ActionType.ACTION_DELETE_OBJECT],
            resources: [GRNToString(newObjectGRN(bucketName, objectName))],
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

          console.log('res', res);

          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        1. feegrant
      </button>
      <br />
      <button
        onClick={async () => {
          if (!address || !wallet) return;

          const granteeAddr = wallet.address;
          const privateKey = wallet.privateKey;

          console.log('temp account', granteeAddr, privateKey);

          const deleteObjectTx = await client.object.deleteObject({
            bucketName,
            objectName,
            operator: granteeAddr,
          });

          const simulateInfo = await deleteObjectTx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await deleteObjectTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || '5000000000',
            payer: granteeAddr,
            granter: address,
            privateKey,
          });

          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        2. delete object
      </button>
    </>
  );
};
