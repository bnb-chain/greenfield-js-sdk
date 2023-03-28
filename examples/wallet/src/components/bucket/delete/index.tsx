import { useState } from 'react';
import {
  DelBucketTx,
  getAccount,
  ISignature712,
  makeCosmsPubKey,
  recoverPk,
} from '@bnb-chain/greenfield-chain-js-sdk';
import { GRPC_URL } from '@/config';
import { useAccount, useNetwork } from 'wagmi';

export const DeleteBucket = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [bucketName, setBucketName] = useState('');
  const [gasLimit, setGasLimit] = useState(0);
  const [signInfo, setSignInfo] = useState<ISignature712>({
    messageHash: Uint8Array.from([]),
    signature: '',
  });

  const delBucketTx = new DelBucketTx(GRPC_URL, String(chain?.id)!);

  return (
    <>
      <h4>Delete Bucket</h4>
      <div>
        bucket name:
        <input
          onChange={(e) => {
            setBucketName(e.target.value);
          }}
        />
        <br />
        <button
          onClick={async () => {
            if (!address) return;

            const simulateBytes = delBucketTx.getSimulateBytes({
              bucketName,
              from: address,
            });

            const simulateGas = await delBucketTx.simulateTx(address, simulateBytes);

            console.log(simulateGas);

            setGasLimit(simulateGas.gasInfo?.gasUsed.toNumber() || 0);
          }}
        >
          0. simulate
        </button>
        <br />
        <button
          onClick={async () => {
            if (!address) return;

            const { sequence, accountNumber } = await getAccount(GRPC_URL!, address!);

            const sign = await delBucketTx.signTx({
              accountNumber: accountNumber + '',
              bucketName,
              from: address,
              sequence: sequence + '',
              gasLimit,
              denom: 'BNB',
            });

            console.log('delete bucket 712 sign', sign);
            setSignInfo(sign);
          }}
        >
          1. sign 712
        </button>
        <br />
        <button
          onClick={async () => {
            if (!address) return;

            const { sequence, accountNumber } = await getAccount(GRPC_URL, address);

            const pk = recoverPk({
              signature: signInfo.signature,
              messageHash: signInfo.messageHash,
            });
            const pubKey = makeCosmsPubKey(pk);

            const rawBytes = await delBucketTx.getRawTxInfo({
              accountNumber: accountNumber + '',
              bucketName,
              from: address,
              sequence: sequence + '',
              gasLimit,
              pubKey,
              sign: signInfo.signature,
              denom: 'BNB',
            });

            console.log('delete rawBytes', rawBytes);

            const txRes = await delBucketTx.broadcastTx(rawBytes.bytes);

            console.log(txRes);

            if (txRes.code === 0) {
              alert('delete bucket success');
            }
          }}
        >
          2. broadcast tx
        </button>
      </div>
    </>
  );
};
