import { GRPC_URL } from '@/config';
import {
  makeCosmsPubKey,
  recoverPk,
  getAccount,
  IRawTxInfo,
  ISignature712,
  TransferTx,
} from '@bnb-chain/greenfield-chain-js-sdk';
import { getGasFeeBySimulate } from '@/utils/simulate';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

export const Transfer = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const tTx = new TransferTx(GRPC_URL!, String(chain?.id)!);
  const [transferInfo, setTransferInfo] = useState({
    to: '0x0000000000000000000000000000000000000001',
    amount: '1',
    gasLimit: '210000',
  });
  const [transferSignInfo, setTransferSignInfo] = useState<ISignature712>({
    messageHash: Uint8Array.from([]),
    signature: '',
  });
  const [transferGasFee, setTransferGasFee] = useState('');
  const [transferTxSignInfo, setTransferTxSignInfo] = useState<IRawTxInfo>({
    bytes: Uint8Array.from([]),
    hex: '',
  });
  // transfer end

  return (
    <div>
      <h2>Transfer</h2>
      to :
      <input
        value={transferInfo.to}
        placeholder="0x00000000000000000"
        onChange={(e) => {
          setTransferInfo({ ...transferInfo, to: e.target.value });
        }}
      />
      <br />
      amount:
      <input
        value={transferInfo.amount}
        placeholder="amount"
        onChange={(e) => {
          setTransferInfo({ ...transferInfo, amount: e.target.value });
        }}
      />
      <br />
      gas limit:
      <input
        value={transferInfo.gasLimit}
        placeholder="gas limit"
        onChange={(e) => {
          setTransferInfo({ ...transferInfo, gasLimit: e.target.value });
        }}
      />
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const bodyBytes = tTx.getSimulateBytes({
            from: address,
            to: transferInfo.to,
            amount: ethers.utils.parseEther(transferInfo.amount).toString(),
            denom: 'BNB',
          });

          console.log(address, bodyBytes);
          const simulateTxInfo = await tTx.simulateTx(address, bodyBytes);

          console.log('transfer simulate', simulateTxInfo);
          const gasFee = getGasFeeBySimulate(simulateTxInfo);
          setTransferGasFee(gasFee);
        }}
      >
        simulate
      </button>
      gas fee: {transferGasFee}
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const account = await getAccount(GRPC_URL!, address);
          const { accountNumber, sequence } = account;

          const signInfo = await tTx.signTx({
            from: address,
            to: transferInfo.to,
            amount: ethers.utils.parseEther(transferInfo.amount).toString(),
            sequence: sequence + '',
            accountNumber: accountNumber + '',
            gasLimit: parseInt(transferInfo.gasLimit),
            denom: 'BNB',
          });

          setTransferSignInfo(signInfo);
        }}
      >
        1. sign transfer data(EIP-712) by wallet
      </button>
      <p>transferSignInfo: {transferSignInfo.signature}</p>
      <button
        onClick={async () => {
          if (!address) return;
          const account = await getAccount(GRPC_URL!, address);
          const { sequence } = account;

          const pk = recoverPk({
            signature: transferSignInfo.signature,
            messageHash: transferSignInfo.messageHash,
          });
          const pubKey = makeCosmsPubKey(pk);

          const rawTxInfo = await tTx.getRawTxInfo({
            sign: transferSignInfo.signature,
            pubKey,
            sequence: String(sequence),
            from: address,
            to: transferInfo.to,
            amount: ethers.utils.parseEther(transferInfo.amount).toString(),
            gasLimit: parseInt(transferInfo.gasLimit),
            denom: 'BNB',
          });

          setTransferTxSignInfo(rawTxInfo);
        }}
      >
        2. get TX bytes
      </button>
      <p>
        transferTxSignInfo:
        <textarea disabled value={transferTxSignInfo.hex}></textarea>
      </p>
      <button
        onClick={async () => {
          const res = await tTx.broadcastTx(transferTxSignInfo.bytes);
          if (res.code === 0) {
            alert('broadcast success');
            console.log('tx res', res);
          }
        }}
      >
        3. broadcast TX
      </button>
    </div>
  );
};
