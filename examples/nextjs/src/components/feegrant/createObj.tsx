import { client } from '@/client';
import { ACCOUNT_PRIVATEKEY } from '@/config/env';
import {
  GRNToString,
  MsgCreateObjectTypeUrl,
  newBucketGRN,
  PermissionTypes,
  toTimestamp,
} from '@bnb-chain/greenfield-js-sdk';
import { Wallet } from '@ethersproject/wallet';
import { ChangeEvent, useState } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';

/**
 * fee grant for creat object
 */
export const CreateObj = () => {
  const { address } = useAccount();
  const [file, setFile] = useState<File>();
  const [bucketName, setBucketName] = useState<string>('');
  const [objectName, setObjectName] = useState<string>('');
  const [wallet, setWallet] = useState<Wallet | null>(null);

  return (
    <>
      <h3>grant account for creating object</h3>
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
          if (!address) return;

          // 1. create temporary account
          const wallet = Wallet.createRandom();
          console.log('wallet', wallet.address, wallet.privateKey);
          setWallet(wallet);

          // 2. allow temporary account to submit specified tx and amount
          const date = new Date();
          date.setDate(date.getMinutes() + 10);
          const grantAllowanceTx = await client.feegrant.grantAllowance({
            granter: address,
            grantee: wallet.address,
            allowedMessages: [MsgCreateObjectTypeUrl],
            amount: parseEther('0.01').toString(),
            denom: 'BNB',
            expirationTime: toTimestamp(date),
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
            expirationTime: toTimestamp(date),
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
          if (!address || !wallet || !file) return;

          const granteeAddr = wallet.address;
          const privateKey = wallet.privateKey;

          console.log('temp account', granteeAddr, privateKey);

          const fileBytes = await file.arrayBuffer();
          const hashResult = await (window as any).FileHandle.getCheckSums(
            new Uint8Array(fileBytes),
          );
          const { contentLength, expectCheckSums } = hashResult;

          const createObjectTx = await client.object.createObject(
            {
              creator: granteeAddr,
              bucketName: bucketName,
              objectName: objectName,
              visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
              redundancyType: 'REDUNDANCY_EC_TYPE',
              contentLength,
              expectCheckSums,
              fileType: file.type,
            },
            {
              type: 'ECDSA',
              privateKey: ACCOUNT_PRIVATEKEY,
            },
          );

          const simulateInfo = await createObjectTx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await createObjectTx.broadcast({
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

          // const uploadRes = await client.object.uploadObject({
          //   bucketName: bucketName,
          //   objectName: objectName,
          //   body: file,
          //   txnHash: res.transactionHash,
          //   endpoint: spInfo.endpoint,
          //   signType: 'authTypeV2',
          // });
          // console.log('uploadRes', uploadRes);

          // if (uploadRes.code === 0) {
          //   alert('success');
          // }
          // const txres = await createFolderTx.broadcast({
          //   denom: 'BNB',
          //   gasLimit: Number(simulateInfo?.gasLimit),
          //   gasPrice: simulateInfo?.gasPrice || '5000000000',
          //   payer: granteeAddr,
          //   granter: address,
          //   privateKey,
          // });
        }}
      >
        2. create object
      </button>
    </>
  );
};
