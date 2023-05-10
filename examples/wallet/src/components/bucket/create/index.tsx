import { GRPC_URL } from '@/config';
import { decodeFromHex } from '@/utils/encoding';
import {
  Long,
  makeCosmsPubKey,
  recoverPk,
  StorageEnums,
  ZERO_PUBKEY,
} from '@bnb-chain/greenfield-chain-sdk';
import { getGasFeeBySimulate } from '@/utils/simulate';
import { CreateBucketTx, getAccount, ISignature712 } from '@bnb-chain/greenfield-chain-sdk';
import { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { client } from '@/client';

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
  const { chain } = useNetwork();
  const createBucketTx = new CreateBucketTx(GRPC_URL!, String(chain?.id)!);
  const [signInfo, setSignInfo] = useState<ISignature712>({
    messageHash: Uint8Array.from([]),
    signature: '',
  });
  const [gasLimit, setGasLimit] = useState(0);
  const [textarea, setTextArea] = useState('');
  const [xGnfdSignedMsg, setXGnfdSignedMsg] = useState<IApprovalCreateBucket['value'] | null>(null);
  const [gasPrice, setGasPrice] = useState('');

  return (
    <>
      <h4>Create Bucket</h4>

      <button
        onClick={async () => {
          if (!address) return;

          const sps = await client.sp.getStorageProviders();
          const finalSps = (sps ?? []).filter((v: any) => v?.description?.moniker !== 'QATest');
          const selectIndex = 0;
          const secondarySpAddresses = [
            ...finalSps.slice(0, selectIndex),
            ...finalSps.slice(selectIndex + 1),
          ].map((item) => item.operatorAddress);

          const res = await client.bucket.createBucket(
            {
              bucketName: 'buckettttestname',
              creator: address,
              visibility: 'VISIBILITY_TYPE_PUBLIC_READ',
              chargedReadQuota: '0',
              spInfo: {
                endpoint: finalSps[selectIndex].endpoint,
                primarySpAddress: finalSps[selectIndex]?.operatorAddress,
                sealAddress: finalSps[selectIndex].sealAddress,
                secondarySpAddresses,
              },
            },
            {
              simulate: false,
              denom: 'BNB',
              gasLimit: 210000,
              gasPrice: '5000000000',
              payer: address,
              granter: '',
            },
          );
          console.log('res', res);
        }}
      >
        create bucket
      </button>

      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <textarea
          value={textarea}
          rows={14}
          placeholder="signed msg from Storage SDK"
          onChange={(e) => {
            setTextArea(e.target.value);

            try {
              const storageSignedMsg = decodeFromHex(e.target.value);
              const json = JSON.parse(storageSignedMsg) as IApprovalCreateBucket;

              console.log('storageSignedMsg', json);
              setXGnfdSignedMsg(json);
            } catch (err) {
              setXGnfdSignedMsg(null);
            }
          }}
        ></textarea>
        <div> {'=>'} </div>
        <div>
          <textarea
            placeholder="decode signed msg"
            rows={14}
            cols={30}
            disabled
            value={JSON.stringify(xGnfdSignedMsg, null, 2)}
          ></textarea>
        </div>
      </div>
      <button
        onClick={async () => {
          if (!xGnfdSignedMsg || !address) return;

          const { sequence } = await getAccount(GRPC_URL!, address!);

          const simulateBytes = createBucketTx.getSimulateBytes({
            from: xGnfdSignedMsg.creator,
            bucketName: xGnfdSignedMsg.bucket_name,
            denom: 'BNB',
            primarySpAddress: xGnfdSignedMsg.primary_sp_address,
            expiredHeight: xGnfdSignedMsg.primary_sp_approval.expired_height,
            sig: xGnfdSignedMsg.primary_sp_approval.sig,
            chargedReadQuota: xGnfdSignedMsg.charged_read_quota,
            visibility: xGnfdSignedMsg.visibility,
            paymentAddress: '',
          });

          const authInfoBytes = createBucketTx.getAuthInfoBytes({
            sequence: sequence + '',
            denom: 'BNB',
            gasLimit: 0,
            gasPrice: '0',
            pubKey: makeCosmsPubKey(ZERO_PUBKEY),
          });

          const simulateGas = await createBucketTx.simulateTx(simulateBytes, authInfoBytes);
          console.log('simulateGas', simulateGas, getGasFeeBySimulate(simulateGas));

          const gasPri = simulateGas.gasInfo?.minGasPrice.replaceAll('BNB', '');
          setGasPrice(gasPri!);

          setGasLimit(simulateGas.gasInfo?.gasUsed.toNumber() || 0);
        }}
      >
        0. simulate
      </button>
      <br />
      <button
        onClick={async () => {
          if (!xGnfdSignedMsg) return;
          if (address !== xGnfdSignedMsg.creator) {
            alert('account is not creator');
          }

          const { sequence, accountNumber } = await getAccount(GRPC_URL!, address!);
          const sign = await createBucketTx.signTx({
            from: xGnfdSignedMsg.creator,
            bucketName: xGnfdSignedMsg.bucket_name,
            sequence: sequence + '',
            accountNumber: accountNumber + '',
            denom: 'BNB',
            gasLimit,
            gasPrice,
            primarySpAddress: xGnfdSignedMsg.primary_sp_address,
            expiredHeight: xGnfdSignedMsg.primary_sp_approval.expired_height,
            sig: xGnfdSignedMsg.primary_sp_approval.sig,
            chargedReadQuota: xGnfdSignedMsg.charged_read_quota ?? 0,
            visibility: xGnfdSignedMsg.visibility,
            paymentAddress: '',
          });

          console.log('712 sign', sign);
          setSignInfo(sign);
        }}
      >
        1. sign 712
      </button>
      <br />
      <button
        onClick={async () => {
          if (!address || !xGnfdSignedMsg) return;
          if (address !== xGnfdSignedMsg.creator) {
            alert('account is not creator');
          }

          const { sequence, accountNumber } = await getAccount(GRPC_URL, address);

          const pk = recoverPk({
            signature: signInfo.signature,
            messageHash: signInfo.messageHash,
          });
          const pubKey = makeCosmsPubKey(pk);

          const rawBytes = await createBucketTx.getRawTxInfo({
            bucketName: xGnfdSignedMsg.bucket_name,
            denom: 'BNB',
            from: address,
            gasLimit,
            gasPrice,
            primarySpAddress: xGnfdSignedMsg.primary_sp_address,
            pubKey,
            sequence: sequence + '',
            accountNumber: accountNumber + '',
            sign: signInfo.signature,
            expiredHeight: xGnfdSignedMsg.primary_sp_approval.expired_height,
            sig: xGnfdSignedMsg.primary_sp_approval.sig,
            chargedReadQuota: xGnfdSignedMsg.charged_read_quota,
            visibility: xGnfdSignedMsg.visibility,
            paymentAddress: '',
          });

          console.log('rawBytes', rawBytes.hex);

          const txRes = await createBucketTx.broadcastTx(rawBytes.bytes);
          console.log('txRes', txRes);
          if (txRes.code === 0) {
            alert('success');
          }
        }}
      >
        2. broadcast tx
      </button>
    </>
  );
};
