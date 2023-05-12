import { client } from '@/client';
import { GRPC_URL } from '@/config';
import { decodeFromHex } from '@/utils/encoding';
import { getGasFeeBySimulate } from '@/utils/simulate';
import {
  CreateObjectTx,
  getAccount,
  ISignature712,
  ISpInfo,
  makeCosmsPubKey,
  recoverPk,
  ZERO_PUBKEY,
} from '@bnb-chain/greenfield-chain-sdk';
import { ChangeEvent, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

interface IApprovalCreateObject {
  bucket_name: string;
  content_type: string;
  creator: string;
  expect_checksums: string[];
  visibility: number;
  object_name: string;
  payload_size: string;
  primary_sp_approval: {
    expired_height: string;
    sig: string;
  };
  expect_secondary_sp_addresses: string[];
  redundancy_type: number;
}

export const CreateObject = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const createObjectTx = new CreateObjectTx(GRPC_URL!, String(chain?.id)!);
  const [signInfo, setSignInfo] = useState<ISignature712>({
    messageHash: Uint8Array.from([]),
    signature: '',
  });
  const [gasLimit, setGasLimit] = useState(0);
  const [textarea, setTextArea] = useState('');
  const [gasPrice, setGasPrice] = useState('');
  const [file, setFile] = useState<File>();
  const [xGnfdSignedMsg, setXGnfdSignedMsg] = useState<IApprovalCreateObject | null>(null);
  const [spInfo, setSpInfo] = useState<ISpInfo | null>(null);

  return (
    <div>
      <h4>Create Object</h4>

      <input
        type="file"
        placeholder="select a file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <button
        onClick={async () => {
          // select sp info
          const sps = await client.sp.getStorageProviders();
          const finalSps = (sps ?? []).filter((v: any) => v?.description?.moniker !== 'QATest');
          const selectIndex = 0;
          const secondarySpAddresses = [
            ...finalSps.slice(0, selectIndex),
            ...finalSps.slice(selectIndex + 1),
          ].map((item) => item.operatorAddress);
          const selectSpInfo = {
            endpoint: finalSps[selectIndex].endpoint,
            primarySpAddress: finalSps[selectIndex]?.operatorAddress,
            sealAddress: finalSps[selectIndex].sealAddress,
            secondarySpAddresses,
          };

          setSpInfo(selectSpInfo);
        }}
      >
        select sp
      </button>

      <button
        onClick={async () => {
          if (!address || !file) {
            alert('Please select a file and address');
            return;
          }
          if (!spInfo) {
            alert('Please select a sp info');
            return;
          }

          const res = await client.object.createObject(
            {
              bucketName: 'buckettttestname',
              objectName: 'obj2ccec22ttttestname',
              spInfo,
              file,
              creator: address,
              expectSecondarySpAddresses: [],
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

          const uploadRes = await client.object.uploadObject({
            bucketName: 'buckettttestname',
            objectName: 'obj2ccec22ttttestname',
            body: file,
            txnHash: res.transactionHash,
            endpoint: spInfo.endpoint,
          });
          console.log('uploadRes', uploadRes);
        }}
      >
        create
      </button>

      <button
        onClick={async () => {
          const res = await client.object.downloadFile({
            bucketName: 'buckettttestname',
            objectName: 'obj2ccec22ttttestname',
            endpoint: spInfo?.endpoint,
          });
          console.log('res', res);
        }}
      >
        get object
      </button>

      <button
        onClick={async () => {
          const res = await client.object.listObjects({
            bucketName: 'buckettttestname',
            endpoint: spInfo?.endpoint,
          });

          console.log('res', res);
        }}
      >
        get object list
      </button>

      <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
        <textarea
          value={textarea}
          rows={14}
          placeholder="signed msg from Storage SDK"
          onChange={(e) => {
            setTextArea(e.target.value);
            const storageSignedMsg = decodeFromHex(e.target.value);

            try {
              const json = JSON.parse(storageSignedMsg) as IApprovalCreateObject;

              console.log('storageSignedMsg', json);
              setXGnfdSignedMsg(json);
            } catch (e) {
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

          const simulateBytes = createObjectTx.getSimulateBytes({
            objectName: xGnfdSignedMsg.object_name,
            contentType: xGnfdSignedMsg.content_type,
            from: xGnfdSignedMsg.creator,
            bucketName: xGnfdSignedMsg.bucket_name,
            expiredHeight: xGnfdSignedMsg.primary_sp_approval.expired_height,
            sig: xGnfdSignedMsg.primary_sp_approval.sig,
            visibility: xGnfdSignedMsg.visibility,
            payloadSize: xGnfdSignedMsg.payload_size,
            expectChecksums: xGnfdSignedMsg.expect_checksums,
            redundancyType: xGnfdSignedMsg.redundancy_type,
            expectSecondarySpAddresses: xGnfdSignedMsg.expect_secondary_sp_addresses,
          });

          const authInfoBytes = createObjectTx.getAuthInfoBytes({
            sequence: sequence + '',
            denom: 'BNB',
            gasLimit: 0,
            gasPrice: '0',
            pubKey: makeCosmsPubKey(ZERO_PUBKEY),
          });

          const simulateGas = await createObjectTx.simulateTx(simulateBytes, authInfoBytes);
          console.log('simulateGas', simulateGas);

          const gasPri = simulateGas.gasInfo?.minGasPrice.replaceAll('BNB', '');
          setGasPrice(gasPri!);

          console.log('gas fee', getGasFeeBySimulate(simulateGas));
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

          const sign = await createObjectTx.signTx({
            accountNumber: accountNumber + '',
            bucketName: xGnfdSignedMsg.bucket_name,
            contentType: xGnfdSignedMsg.content_type,
            denom: 'BNB',
            expectChecksums: xGnfdSignedMsg.expect_checksums,
            expectSecondarySpAddresses: xGnfdSignedMsg.expect_secondary_sp_addresses,
            expiredHeight: xGnfdSignedMsg.primary_sp_approval.expired_height,
            from: xGnfdSignedMsg.creator,
            gasLimit,
            visibility: xGnfdSignedMsg.visibility,
            objectName: xGnfdSignedMsg.object_name,
            payloadSize: xGnfdSignedMsg.payload_size,
            redundancyType: xGnfdSignedMsg.redundancy_type,
            sequence: sequence + '',
            sig: xGnfdSignedMsg.primary_sp_approval.sig,
            gasPrice,
          });

          console.log('create object 712 sign', sign);
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

          const rawBytes = await createObjectTx.getRawTxInfo({
            bucketName: xGnfdSignedMsg.bucket_name,
            denom: 'BNB',
            from: address,
            gasLimit,
            pubKey,
            sequence: sequence + '',
            accountNumber: accountNumber + '',
            sign: signInfo.signature,
            expiredHeight: xGnfdSignedMsg.primary_sp_approval.expired_height,
            sig: xGnfdSignedMsg.primary_sp_approval.sig,
            visibility: xGnfdSignedMsg.visibility,
            contentType: xGnfdSignedMsg.content_type,
            expectChecksums: xGnfdSignedMsg.expect_checksums,
            objectName: xGnfdSignedMsg.object_name,
            payloadSize: xGnfdSignedMsg.payload_size,
            redundancyType: xGnfdSignedMsg.redundancy_type,
            expectSecondarySpAddresses: xGnfdSignedMsg.expect_secondary_sp_addresses,
            gasPrice,
          });

          console.log('rawBytes', rawBytes);

          const txRes = await createObjectTx.broadcastTx(rawBytes.bytes);
          console.log('txRes', txRes);
          if (txRes.code === 0) {
            alert('success');
          }
        }}
      >
        2. broadcast tx
      </button>
    </div>
  );
};
