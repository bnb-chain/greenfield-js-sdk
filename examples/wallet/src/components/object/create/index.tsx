import { GRPC_URL } from '@/config';
import { decodeFromHex } from '@/utils/encoding';
import {
  makeCosmsPubKey,
  recoverPk,
  CreateObjectTx,
  getAccount,
  ISignature712,
} from '@bnb-chain/greenfield-chain-js-sdk';
import { getGasFeeBySimulate } from '@/utils/simulate';
import { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

interface IApprovalCreateObject {
  type: string;
  value: {
    bucket_name: string;
    content_type: string;
    creator: string;
    expect_checksums: string[];
    is_public: boolean;
    object_name: string;
    payload_size: string;
    primary_sp_approval: {
      expired_height: string;
      sig: string;
    };
    expect_secondary_sp_addresses: string[];
    redundancy_type: number;
  };
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
  const [xGnfdSignedMsg, setXGnfdSignedMsg] = useState<IApprovalCreateObject | null>(null);

  return (
    <div>
      <h4>Create Object</h4>
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
          const simulateBytes = createObjectTx.getSimulateBytes({
            objectName: xGnfdSignedMsg.value.object_name,
            contentType: xGnfdSignedMsg.value.content_type,
            from: xGnfdSignedMsg.value.creator,
            bucketName: xGnfdSignedMsg.value.bucket_name,
            denom: 'BNB',
            expiredHeight: xGnfdSignedMsg.value.primary_sp_approval.expired_height,
            sig: xGnfdSignedMsg.value.primary_sp_approval.sig,
            isPublic: xGnfdSignedMsg.value.is_public,
            payloadSize: xGnfdSignedMsg.value.payload_size,
            expectChecksums: xGnfdSignedMsg.value.expect_checksums,
            redundancyType: xGnfdSignedMsg.value.redundancy_type,
            expectSecondarySpAddresses: xGnfdSignedMsg.value.expect_secondary_sp_addresses,
          });

          const simulateGas = await createObjectTx.simulateTx(address, simulateBytes);
          console.log('simulateGas', simulateGas);

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
          if (address !== xGnfdSignedMsg.value.creator) {
            alert('account is not creator');
          }

          const { sequence, accountNumber } = await getAccount(GRPC_URL!, address!);
          const sign = await createObjectTx.signTx({
            accountNumber: accountNumber + '',
            bucketName: xGnfdSignedMsg.value.bucket_name,
            contentType: xGnfdSignedMsg.value.content_type,
            denom: 'BNB',
            expectChecksums: xGnfdSignedMsg.value.expect_checksums,
            expectSecondarySpAddresses: xGnfdSignedMsg.value.expect_secondary_sp_addresses,
            expiredHeight: xGnfdSignedMsg.value.primary_sp_approval.expired_height,
            from: xGnfdSignedMsg.value.creator,
            gasLimit,
            isPublic: xGnfdSignedMsg.value.is_public,
            objectName: xGnfdSignedMsg.value.object_name,
            payloadSize: xGnfdSignedMsg.value.payload_size,
            redundancyType: xGnfdSignedMsg.value.redundancy_type,
            sequence: sequence + '',
            sig: xGnfdSignedMsg.value.primary_sp_approval.sig,
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
          if (address !== xGnfdSignedMsg.value.creator) {
            alert('account is not creator');
          }

          const { sequence, accountNumber } = await getAccount(GRPC_URL, address);

          const pk = recoverPk({
            signature: signInfo.signature,
            messageHash: signInfo.messageHash,
          });
          const pubKey = makeCosmsPubKey(pk);

          const rawBytes = await createObjectTx.getRawTxInfo({
            bucketName: xGnfdSignedMsg.value.bucket_name,
            denom: 'BNB',
            from: address,
            gasLimit,
            pubKey,
            sequence: sequence + '',
            accountNumber: accountNumber + '',
            sign: signInfo.signature,
            expiredHeight: xGnfdSignedMsg.value.primary_sp_approval.expired_height,
            sig: xGnfdSignedMsg.value.primary_sp_approval.sig,
            isPublic: xGnfdSignedMsg.value.is_public,
            contentType: xGnfdSignedMsg.value.content_type,
            expectChecksums: xGnfdSignedMsg.value.expect_checksums,
            objectName: xGnfdSignedMsg.value.object_name,
            payloadSize: xGnfdSignedMsg.value.payload_size,
            redundancyType: xGnfdSignedMsg.value.redundancy_type,
            expectSecondarySpAddresses: xGnfdSignedMsg.value.expect_secondary_sp_addresses,
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
