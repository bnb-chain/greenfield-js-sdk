import { client } from '@/client';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export const Transfer = () => {
  const { address, connector } = useAccount();
  const [transferInfo, setTransferInfo] = useState({
    to: '0x0000000000000000000000000000000000000001',
    amount: '1',
    gasLimit: '210000',
  });

  return (
    <div>
      <button
        onClick={async () => {
          const account = await client.account.getAccount(
            '0x1C893441AB6c1A75E01887087ea508bE8e07AAae',
          );

          console.log(account);
        }}
      >
        click
      </button>
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

          const transferTx = await client.account.transfer({
            fromAddress: address,
            toAddress: transferInfo.to,
            amount: [
              {
                denom: 'BNB',
                amount: ethers.utils.parseEther(transferInfo.amount).toString(),
              },
            ],
          });

          const simulateInfo = await transferTx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await transferTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo.gasLimit),
            gasPrice: simulateInfo.gasPrice,
            payer: address,
            granter: '',
            signTypedDataCallback: async (addr: string, message: string) => {
              const provider = await connector?.getProvider();
              return await provider?.request({
                method: 'eth_signTypedData_v4',
                params: [addr, message],
              });
            },
          });

          if (res.code === 0) {
            alert('transfer success!!');
          }
        }}
      >
        broadcast with simulate
      </button>
    </div>
  );
};
