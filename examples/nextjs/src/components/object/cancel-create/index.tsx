import { useState } from 'react';
import {
  CancelCreateObjectTx,
  getAccount,
  ISignature712,
  ZERO_PUBKEY,
  makeCosmsPubKey,
  recoverPk,
} from '@bnb-chain/greenfield-chain-sdk';
import { GRPC_URL } from '@/config';
import { useAccount, useNetwork } from 'wagmi';

export const CancelCreateObject = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [gasLimit, setGasLimit] = useState(0);
  const [bucketName, setBucketName] = useState('');
  const [objectName, setObjectName] = useState('');
  const [signInfo, setSignInfo] = useState<ISignature712>({
    messageHash: Uint8Array.from([]),
    signature: '',
  });

  const cancelCteObjTx = new CancelCreateObjectTx(GRPC_URL, String(chain?.id)!);

  const [gasPrice, setGasPrice] = useState('');

  return (
    <>
      <h4>Cancel Create Object</h4>
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

            const { sequence } = await getAccount(GRPC_URL!, address!);

            const simulateBytes = cancelCteObjTx.getSimulateBytes({
              bucketName,
              objectName,
              from: address,
            });

            const authInfoBytes = cancelCteObjTx.getAuthInfoBytes({
              sequence: sequence + '',
              denom: 'BNB',
              gasLimit: 0,
              pubKey: makeCosmsPubKey(ZERO_PUBKEY),
              gasPrice: '0',
            });

            const gasfee = await cancelCteObjTx.simulateTx(simulateBytes, authInfoBytes);
            console.log('gasfee', gasfee);

            const gasPri = gasfee.gasInfo?.minGasPrice.replaceAll('BNB', '');
            setGasPrice(gasPri!);

            setGasLimit(gasfee.gasInfo?.gasUsed.toNumber() || 0);
          }}
        >
          0. simulate
        </button>
        <br />
        <button
          onClick={async () => {
            if (!address) return;

            const { sequence, accountNumber } = await getAccount(GRPC_URL!, address!);

            const sign = await cancelCteObjTx.signTx({
              accountNumber: accountNumber + '',
              bucketName,
              from: address,
              sequence: sequence + '',
              gasLimit,
              objectName,
              denom: 'BNB',
              gasPrice,
            });

            console.log('cancel create object 712 sign', sign);
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

            const rawBytes = await cancelCteObjTx.getRawTxInfo({
              accountNumber: accountNumber + '',
              bucketName,
              from: address,
              sequence: sequence + '',
              gasLimit,
              pubKey,
              sign: signInfo.signature,
              objectName,
              denom: 'BNB',
              gasPrice,
            });

            console.log('cancel create object rawBytes', rawBytes);

            const txRes = await cancelCteObjTx.broadcastTx(rawBytes.bytes);

            console.log(txRes);

            if (txRes.code === 0) {
              alert('cancel create object success');
            }
          }}
        >
          2. broadcast tx
        </button>
      </div>
    </>
  );
};
