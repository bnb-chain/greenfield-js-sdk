import { client } from '@/client';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';

export const MultiMsg = () => {
  const { address } = useAccount();
  return (
    <div>
      <h2>send multi msgs</h2>
      <div>
        <button
          onClick={async () => {
            if (!address) return;

            const transferTx = await client.account.transfer({
              fromAddress: address,
              toAddress: '0x0000000000000000000000000000000000000001',
              amount: [
                {
                  denom: 'BNB',
                  amount: parseEther('0.00001').toString(),
                },
              ],
            });

            console.log(transferTx.metaTxInfo);

            const transferOutTx = await client.crosschain.transferOut({
              from: address,
              to: '0x0000000000000000000000000000000000000001',
              amount: {
                amount: parseEther('0.00001').toString(),
                denom: 'BNB',
              },
            });

            console.log(transferOutTx.metaTxInfo);

            const txs = await client.basic.multiTx([transferTx, transferOutTx]);

            const simuluateInfo = await txs.simulate({
              denom: 'BNB',
            });

            console.log('simuluateInfo', simuluateInfo);

            const res = await txs.broadcast({
              denom: 'BNB',
              gasLimit: Number(210000),
              gasPrice: '5000000000',
              payer: address,
              granter: '',
            });

            if (res.code === 0) {
              alert('success');
            }

            console.log('res', res);
          }}
        >
          multi msg
        </button>
      </div>
    </div>
  );
};
