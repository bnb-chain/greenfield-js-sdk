import { client } from '@/client';
import { useAccount } from 'wagmi';

export const PaymentComponent = () => {
  const { address } = useAccount();
  return (
    <>
      <h2>Payment</h2>

      <button
        onClick={async () => {
          if (!address) return;

          const tx = await client.account.createPaymentAccount({
            creator: address,
          });

          const simulateInfo = await tx.simulate({
            denom: 'BNB',
          });

          console.log('simulateInfo', simulateInfo);

          const res = await tx.broadcast({
            denom: 'BNB',
            gasLimit: Number(simulateInfo?.gasLimit),
            gasPrice: simulateInfo?.gasPrice || '5000000000',
            payer: address,
            granter: '',
          });

          console.log('res', res);

          if (res.code === 0) {
            alert('create payment account success');
          }
        }}
      >
        createPaymentAccount
      </button>

      <br />

      <button
        onClick={async () => {
          if (!address) return;

          const res = await client.payment.getPaymentAccountsByOwner({
            owner: address,
          });

          console.log(res);
        }}
      >
        getPaymentAccountsByOwner
      </button>
    </>
  );
};
