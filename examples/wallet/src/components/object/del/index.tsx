import { useState } from 'react';
import {
  DelObjectTx,
  getAccount,
  ISignature712,
  ZERO_PUBKEY,
} from '@bnb-chain/greenfield-chain-sdk';
import { GRPC_URL } from '@/config';
import { useAccount, useNetwork } from 'wagmi';
import { makeCosmsPubKey, recoverPk } from '@bnb-chain/greenfield-chain-sdk';

const GAS_LIMIT = 100000;

export const DeleteObject = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [bucketName, setBucketName] = useState('');
  const [objectName, setObjectName] = useState('');
  const [signInfo, setSignInfo] = useState<ISignature712>({
    messageHash: Uint8Array.from([]),
    signature: '',
  });
  const [gasPrice, setGasPrice] = useState('');

  const delObjTx = new DelObjectTx(GRPC_URL, String(chain?.id)!);

  return (
    <>
      <h4>Delete Object</h4>
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

            const simulateBytes = delObjTx.getSimulateBytes({
              bucketName,
              objectName,
              from: address,
            });

            const authInfoBytes = delObjTx.getAuthInfoBytes({
              sequence: sequence + '',
              denom: 'BNB',
              gasLimit: 0,
              gasPrice: '0',
              pubKey: makeCosmsPubKey(ZERO_PUBKEY),
            });

            const gasfee = await delObjTx.simulateTx(simulateBytes, authInfoBytes);
            console.log('gasfee', gasfee);

            const gasPri = gasfee.gasInfo?.minGasPrice.replaceAll('BNB', '');
            setGasPrice(gasPri!);
          }}
        >
          0. simulate
        </button>
        <br />
        <button
          onClick={async () => {
            if (!address) return;

            const { sequence, accountNumber } = await getAccount(GRPC_URL!, address!);

            const sign = await delObjTx.signTx({
              accountNumber: accountNumber + '',
              bucketName,
              from: address,
              sequence: sequence + '',
              gasLimit: GAS_LIMIT,
              objectName,
              denom: 'BNB',
              gasPrice,
            });

            console.log('delete object 712 sign', sign);
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

            const rawBytes = await delObjTx.getRawTxInfo({
              accountNumber: accountNumber + '',
              bucketName,
              from: address,
              sequence: sequence + '',
              gasLimit: GAS_LIMIT,
              pubKey,
              sign: signInfo.signature,
              objectName,
              denom: 'BNB',
              gasPrice,
            });

            console.log('delete object rawBytes', rawBytes);

            const txRes = await delObjTx.broadcastTx(rawBytes.bytes);

            console.log(txRes);

            if (txRes.code === 0) {
              alert('delete object success');
            }
          }}
        >
          2. broadcast tx
        </button>
      </div>
    </>
  );
};
