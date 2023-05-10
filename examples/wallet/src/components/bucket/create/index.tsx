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
  const [xGnfdSignedMsg, setXGnfdSignedMsg] = useState<IApprovalCreateBucket | null>(null);
  const [gasPrice, setGasPrice] = useState('');

  return (
    <>
      <h4>Create Bucket</h4>

      <button
        onClick={async () => {
          await client.bucket.getCreateBucketApproval();
          // const approval = await client.bucket.getCreateBucketApproval({
          //   bucketName: '',
          //   creator: '',
          //   paymentAddress: '',
          //   primarySpAddress: '',
          //   visibility: StorageEnums.VisibilityType.UNRECOGNIZED,
          //   primarySpApproval: {
          //     expiredHeight: Long.fromNumber(0),
          //     sig: Uint8Array.from([]),
          //   },
          //   chargedReadQuota: Long.fromNumber(11),
          // });
          // console.log('approval', approval);
        }}
      >
        test
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
            from: xGnfdSignedMsg.value.creator,
            bucketName: xGnfdSignedMsg.value.bucket_name,
            denom: 'BNB',
            primarySpAddress: xGnfdSignedMsg.value.primary_sp_address,
            expiredHeight: xGnfdSignedMsg.value.primary_sp_approval.expired_height,
            sig: xGnfdSignedMsg.value.primary_sp_approval.sig,
            chargedReadQuota: xGnfdSignedMsg.value.charged_read_quota,
            visibility: xGnfdSignedMsg.value.visibility,
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
          if (address !== xGnfdSignedMsg.value.creator) {
            alert('account is not creator');
          }

          const { sequence, accountNumber } = await getAccount(GRPC_URL!, address!);
          const sign = await createBucketTx.signTx({
            from: xGnfdSignedMsg.value.creator,
            bucketName: xGnfdSignedMsg.value.bucket_name,
            sequence: sequence + '',
            accountNumber: accountNumber + '',
            denom: 'BNB',
            gasLimit,
            gasPrice,
            primarySpAddress: xGnfdSignedMsg.value.primary_sp_address,
            expiredHeight: xGnfdSignedMsg.value.primary_sp_approval.expired_height,
            sig: xGnfdSignedMsg.value.primary_sp_approval.sig,
            chargedReadQuota: xGnfdSignedMsg.value.charged_read_quota ?? 0,
            visibility: xGnfdSignedMsg.value.visibility,
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
          if (address !== xGnfdSignedMsg.value.creator) {
            alert('account is not creator');
          }

          const { sequence, accountNumber } = await getAccount(GRPC_URL, address);

          const pk = recoverPk({
            signature: signInfo.signature,
            messageHash: signInfo.messageHash,
          });
          const pubKey = makeCosmsPubKey(pk);

          const rawBytes = await createBucketTx.getRawTxInfo({
            bucketName: xGnfdSignedMsg.value.bucket_name,
            denom: 'BNB',
            from: address,
            gasLimit,
            gasPrice,
            primarySpAddress: xGnfdSignedMsg.value.primary_sp_address,
            pubKey,
            sequence: sequence + '',
            accountNumber: accountNumber + '',
            sign: signInfo.signature,
            expiredHeight: xGnfdSignedMsg.value.primary_sp_approval.expired_height,
            sig: xGnfdSignedMsg.value.primary_sp_approval.sig,
            chargedReadQuota: xGnfdSignedMsg.value.charged_read_quota,
            visibility: xGnfdSignedMsg.value.visibility,
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
