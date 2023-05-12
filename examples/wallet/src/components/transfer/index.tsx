import { client } from '@/client';
import { ISimulateGasFee } from '@bnb-chain/greenfield-chain-sdk';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const Transfer = () => {
  const { address } = useAccount();
  const [transferInfo, setTransferInfo] = useState({
    to: '0x0000000000000000000000000000000000000001',
    amount: '1',
    gasLimit: '210000',
  });
  const [simulateInfo, setSimulateInfo] = useState<ISimulateGasFee | null>(null);

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

          const res = await client.account.transfer(
            {
              fromAddress: address,
              toAddress: transferInfo.to,
              amount: [
                {
                  denom: 'BNB',
                  amount: transferInfo.amount,
                },
              ],
            },
            {
              simulate: true,
              denom: 'BNB',
              gasLimit: Number(transferInfo.gasLimit),
              gasPrice: '5000000000',
              payer: address,
              granter: '',
            },
          );

          console.log('res', res);
          setSimulateInfo(res);
        }}
      >
        simulate
      </button>
      {simulateInfo?.gasFee}
      <br />
      <button
        onClick={async () => {
          if (!address || !simulateInfo) return;

          const res = await client.account.transfer(
            {
              fromAddress: address,
              toAddress: transferInfo.to,
              amount: [
                {
                  denom: 'BNB',
                  amount: transferInfo.amount,
                },
              ],
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
            alert('transfer success!!');
          }
        }}
      >
        broadcast
      </button>
    </div>
  );
};
