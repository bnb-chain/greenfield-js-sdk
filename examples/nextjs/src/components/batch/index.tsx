import { client, selectSp } from '@/client';
import { GRNToString, newBucketGRN, PermissionTypes } from '@bnb-chain/greenfield-chain-sdk';
import { Wallet } from '@ethersproject/wallet';
import { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

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

          // select sp to be primary sp
          const spInfo = await selectSp();
          const { primarySpAddress } = spInfo;

          /* await client.bucket.createBucket({
            bucketName,
            creator: address,
            visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
            chargedReadQuota: '0',
            spInfo,
            signType: 'authTypeV2',
          }); */

          const { sequence } = await client.account.getAccount(address);
          console.log('sequence', sequence);

          const wallet = Wallet.createRandom();
          console.log('wallet', wallet, wallet.privateKey);

          const grantAllowanceTx = await client.feegrant.grantAllowance({
            granter: address,
            grantee: wallet.address,
            // allowance: ,
          });

          const simulateInfo = await grantAllowanceTx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo:', simulateInfo);

          const res = await grantAllowanceTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || '5000000000',
            payer: address,
            granter: '',
          });

          console.log(res);

          // const statement: PermissionTypes.Statement = {
          //   effect: PermissionTypes.Effect.EFFECT_ALLOW,
          //   actions: [PermissionTypes.ActionType.ACTION_UPDATE_BUCKET_INFO],
          //   resources: [GRNToString(newBucketGRN(bucketName))],
          // };
          // const putPolicyTx = await client.bucket.putBucketPolicy(bucketName, {
          //   operator: address,
          //   statements: [statement],
          //   principal: {
          //     type: PermissionTypes.PrincipalType.PRINCIPAL_TYPE_GNFD_ACCOUNT,
          //     value: '0x0000000000000000000000000000000000000001',
          //   },
          // });
        }}
      >
        go batch
      </button>
    </>
  );
};
