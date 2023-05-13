import { GRPC_URL } from '@/config';
import { makeCosmsPubKey, recoverPk, ZERO_PUBKEY } from '@bnb-chain/greenfield-chain-sdk';
import { getGasFeeBySimulate, getRelayFeeBySimulate } from '@/utils/simulate';
import { IRawTxInfo, ISignature712, TransferOutTx } from '@bnb-chain/greenfield-chain-sdk';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { client } from '@/client';

export const Withdraw = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const toutTx = new TransferOutTx(GRPC_URL, String(chain?.id)!);
  const [transferoutInfo, setTransferoutInfo] = useState({
    to: '0x0000000000000000000000000000000000000001',
    denom: 'BNB',
    amount: '1',
    gasLimit: '210000',
  });
  const [transferoutSignInfo, setTransferoutSignInfo] = useState<ISignature712>({
    messageHash: Uint8Array.from([]),
    signature: '',
  });
  const [transferOutGasFee, setTransferOutGasFee] = useState('');
  const [transferOutRelayFee, setTransferOutRelayFee] = useState('');
  const [transferoutTxSignInfo, setTransferoutTxSignInfo] = useState<IRawTxInfo>({
    bytes: Uint8Array.from([]),
    hex: '',
  });
  const [gasPrice, setGasPrice] = useState('');

  return (
    <div>
      <h2>Withdraw</h2>
      to :
      <input
        value={transferoutInfo.to}
        placeholder="0x00000000000000000"
        onChange={(e) => {
          setTransferoutInfo({ ...transferoutInfo, to: e.target.value });
        }}
      />
      <br />
      amount:
      <input
        value={transferoutInfo.amount}
        placeholder="amount"
        onChange={(e) => {
          setTransferoutInfo({ ...transferoutInfo, amount: e.target.value });
        }}
      />
      <br />
      gas limit:
      <input
        value={transferoutInfo.gasLimit}
        placeholder="gas limit"
        onChange={(e) => {
          setTransferoutInfo({ ...transferoutInfo, gasLimit: e.target.value });
        }}
      />
      <br />
      denom:
      <input
        placeholder="BNB"
        value={transferoutInfo.denom}
        onChange={(e) => {
          setTransferoutInfo({ ...transferoutInfo, denom: e.target.value });
        }}
      />
      <br />
      <button
        onClick={async () => {
          if (!address) return;

          const { sequence } = await client.account.getAccount(address);

          const bodyBytes = toutTx.getSimulateBytes({
            from: address,
            to: transferoutInfo.to,
            amount: ethers.utils.parseEther(transferoutInfo.amount).toString(),
            denom: 'BNB',
          });

          const authInfoBytes = toutTx.getAuthInfoBytes({
            sequence: sequence + '',
            denom: 'BNB',
            gasLimit: 0,
            gasPrice: '0',
            pubKey: makeCosmsPubKey(ZERO_PUBKEY),
          });

          const simulateTxInfo = await toutTx.simulateTx(bodyBytes, authInfoBytes);
          const relayFeeInfo = await toutTx.simulateRelayFee();
          console.log('transferout simuluate relayFee', relayFeeInfo);
          console.log('transferout simulate gasFee', simulateTxInfo);

          const gasFee = getGasFeeBySimulate(simulateTxInfo);
          const relayFee = getRelayFeeBySimulate(relayFeeInfo);
          setTransferOutGasFee(gasFee);
          setTransferOutRelayFee(relayFee.toString());

          const gasPri = simulateTxInfo.gasInfo?.minGasPrice.replaceAll('BNB', '');
          setGasPrice(gasPri!);
        }}
      >
        simulate
      </button>
      <br />
      relay fee: {transferOutRelayFee}
      <br />
      gas fee: {transferOutGasFee}
      <br />
      <button
        onClick={async () => {
          if (!address) return;
          const { sequence, accountNumber } = await client.account.getAccount(address);

          const signInfo = await toutTx.signTx({
            from: address,
            to: transferoutInfo.to,
            amount: ethers.utils.parseEther(transferoutInfo.amount).toString(),
            sequence: sequence + '',
            accountNumber: accountNumber + '',
            denom: transferoutInfo.denom,
            gasLimit: parseInt(transferoutInfo.gasLimit),
            gasPrice,
          });

          setTransferoutSignInfo(signInfo);
        }}
      >
        1. sign transferout data(EIP-712) by wallet
      </button>
      <p>transferoutSignInfo: {transferoutSignInfo.signature}</p>
      <button
        onClick={async () => {
          if (!address) return;
          const { sequence } = await client.account.getAccount(address);

          if (!transferoutSignInfo) alert('wallet sign errors');

          const pk = recoverPk({
            signature: transferoutSignInfo.signature,
            messageHash: transferoutSignInfo.messageHash,
          });
          const pubKey = makeCosmsPubKey(pk);
          const rawTxInfo = await toutTx.getRawTxInfo({
            sign: transferoutSignInfo.signature,
            pubKey,
            sequence: String(sequence),
            from: address,
            to: transferoutInfo.to,
            amount: ethers.utils.parseEther(transferoutInfo.amount).toString(),
            denom: transferoutInfo.denom,
            gasLimit: parseInt(transferoutInfo.gasLimit),
            gasPrice,
          });

          setTransferoutTxSignInfo(rawTxInfo);
        }}
      >
        2. get TX bytes
      </button>
      <p>
        transferOutTxSignInfo:
        <textarea disabled value={transferoutTxSignInfo.hex}></textarea>
      </p>
      <button
        onClick={async () => {
          const res = await toutTx.broadcastTx(transferoutTxSignInfo.bytes);

          console.log('tx res', res);

          if (res.code === 0) {
            alert('broadcast success');
          }
        }}
      >
        3. broadcast TX
      </button>
    </div>
  );
};
