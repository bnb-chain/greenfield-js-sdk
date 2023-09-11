import { client } from '@/client';
import { useAccount } from 'wagmi';
import { MsgSend } from '@bnb-chain/greenfield-cosmos-types/cosmos/bank/v1beta1/tx';
import { parseEther } from 'viem';

export const CustomTx = () => {
  const { address } = useAccount();

  return (
    <>
      <h4>Custome Tx</h4>

      <br />
      <button
        onClick={async () => {
          if (!address) return;
          const transferParams: MsgSend = {
            amount: [
              {
                denom: 'BNB',
                amount: '100000000',
              },
            ],
            fromAddress: address,
            toAddress: '0x0000000000000000000000000000000000000001',
          };

          const transferTx = await client.txClient.tx(
            '/cosmos.bank.v1beta1.MsgSend',
            address,
            {
              Msg1: [
                {
                  name: 'type',
                  type: 'string',
                },
                {
                  name: 'from_address',
                  type: 'string',
                },
                {
                  name: 'to_address',
                  type: 'string',
                },
                {
                  name: 'amount',
                  type: 'TypeMsg1Amount[]',
                },
              ],
              TypeMsg1Amount: [
                {
                  name: 'denom',
                  type: 'string',
                },
                {
                  name: 'amount',
                  type: 'string',
                },
              ],
            },
            MsgSend.toSDK(transferParams),
            MsgSend.encode(transferParams).finish(),
          );

          const simulateInfo = await transferTx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await transferTx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || '5000000000',
            payer: address,
            granter: '',
          });

          console.log('res', res);

          if (res.code === 0) {
            alert('success');
          }
        }}
      >
        broadcast with simulate
      </button>
    </>
  );
};
