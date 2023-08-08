import { client } from '@/client';
import { useState } from 'react';
import { parseEther } from 'viem';
import { useAccount } from 'wagmi';

export const PaymentComponent = () => {
  const { address } = useAccount();
  const [paymentAccount, setPaymentAccount] = useState<string>('');
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

          const res = await client.payment.getStreamRecord(address);
          console.log('res', res);
        }}
      >
        getStreamRecord
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
      <br />
      payment account:
      <input
        onChange={(e) => {
          setPaymentAccount(e.target.value);
        }}
      />
      <h3>payment account deposit</h3>
      <button
        onClick={async () => {
          if (!address) return;

          const tx = await client.payment.deposit({
            amount: parseEther('0.05').toString(),
            creator: address,
            to: paymentAccount,
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

          if (res.code === 0) {
            alert('payment account deposit success');
          }
        }}
      >
        deposit
      </button>
      <br />
      <h3>payment account withdraw</h3>
      <button
        onClick={async () => {
          if (!address) return;

          const tx = await client.payment.withdraw({
            amount: parseEther('0.05').toString(),
            creator: address,
            from: paymentAccount,
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

          if (res.code === 0) {
            alert('payment account withdraw success');
          }
        }}
      >
        withdraw
      </button>
      <br />
      <h3>payment account disableRefund</h3>
      <button
        onClick={async () => {
          if (!address) return;

          const tx = await client.payment.disableRefund({
            owner: address,
            addr: paymentAccount,
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

          if (res.code === 0) {
            alert('disableRefund success');
          }
        }}
      >
        disableRefund
      </button>
    </>
  );
};
