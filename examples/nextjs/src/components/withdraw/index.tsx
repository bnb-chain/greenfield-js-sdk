import { client } from '@/client';
import { getRelayFeeBySimulate } from '@/utils/simulate';
import { ISimulateGasFee } from '@bnb-chain/greenfield-chain-sdk';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const Withdraw = () => {
  const { address } = useAccount();

  const [transferoutInfo, setTransferoutInfo] = useState({
    to: '0x0000000000000000000000000000000000000001',
    denom: 'BNB',
    amount: '1',
    gasLimit: '210000',
  });

  const [simulateInfo, setSimulateInfo] = useState<ISimulateGasFee | null>(null);
  const [transferOutRelayFee, setTransferOutRelayFee] = useState('');

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
          const simulateGasFee = await client.crosschain.transferOut(
            {
              from: address,
              to: transferoutInfo.to,
              amount: {
                amount: transferoutInfo.amount,
                denom: 'BNB',
              },
            },
            {
              simulate: true,
              denom: 'BNB',
              gasLimit: Number(transferoutInfo.gasLimit),
              gasPrice: '5000000000',
              payer: address,
              granter: '',
            },
          );
          const relayFeeInfo = await client.crosschain.getParams();
          console.log('transferout simuluate relayFee', relayFeeInfo);
          console.log('transferout simulate gasFee', simulateGasFee);

          const relayFee = getRelayFeeBySimulate(relayFeeInfo);
          setTransferOutRelayFee(relayFee.toString());
          setSimulateInfo(simulateGasFee);
        }}
      >
        simulate
      </button>
      <br />
      relay fee: {transferOutRelayFee}
      <br />
      gas fee: {simulateInfo?.gasFee}
      <br />
      <br />
      <button
        onClick={async () => {
          if (!address || !simulateInfo) return;
          const res = await client.crosschain.transferOut(
            {
              from: address,
              to: transferoutInfo.to,
              amount: {
                amount: transferoutInfo.amount,
                denom: 'BNB',
              },
            },
            {
              simulate: false,
              denom: 'BNB',
              gasLimit: Number(simulateInfo.gasLimit),
              gasPrice: simulateInfo.gasPrice,
              payer: address,
              granter: '',
            },
          );

          if (res.code === 0) {
            alert('broadcast success');
          }
        }}
      >
        broadcast
      </button>
    </div>
  );
};
