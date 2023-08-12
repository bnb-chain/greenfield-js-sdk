import { client } from '@/client';
import { getRelayFeeBySimulate } from '@/utils/simulate';
import { ISimulateGasFee } from '@bnb-chain/greenfield-js-sdk';
import { useState } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';

export const Withdraw = () => {
  const { address } = useAccount();

  const [transferoutInfo, setTransferoutInfo] = useState({
    to: '0x0000000000000000000000000000000000000001',
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
      <button
        onClick={async () => {
          if (!address) return;
          const transferOutTx = await client.crosschain.transferOut({
            from: address,
            to: transferoutInfo.to,
            amount: {
              amount: parseEther(`${Number(transferoutInfo.amount)}`).toString(),
              denom: 'BNB',
            },
          });

          const simulateGasFee = await transferOutTx.simulate({
            denom: 'BNB',
          });

          const relayFeeInfo = await client.crosschain.getParams();
          console.log('transferout simuluate relayFee', relayFeeInfo);
          console.log('transferout simulate gasFee', simulateGasFee);

          const relayFee = relayFeeInfo.params
            ? getRelayFeeBySimulate(
                relayFeeInfo.params.bscTransferOutAckRelayerFee,
                relayFeeInfo.params.bscTransferOutRelayerFee,
              )
            : '0';
          setTransferOutRelayFee(relayFee.toString());
          setSimulateInfo(simulateGasFee);

          const res = await transferOutTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateGasFee.gasLimit),
            gasPrice: simulateGasFee.gasPrice,
            payer: address,
            granter: '',
          });
          if (res.code === 0) {
            alert('broadcast success');
          }
        }}
      >
        broadcast with simulate
      </button>
      <br />
      relay fee: {transferOutRelayFee}
      <br />
      gas fee: {simulateInfo?.gasFee}
      <br />
    </div>
  );
};
