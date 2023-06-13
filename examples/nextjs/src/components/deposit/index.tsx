import { CROSS_CHAIN_CONTRACT_ADDRESS, TOKEN_HUB_CONTRACT_ADDRESS } from '@/config';
import { CROSS_CHAIN_ABI, TOKENHUB_ABI } from '@/constants/abi';
import { useState } from 'react';
import { formatEther, formatGwei, parseEther, parseGwei } from 'viem';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';

export const Deposit = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [depositAmount, setDepositAmount] = useState(0);

  return (
    <div>
      <h2> Deposit </h2>
      amount:
      <input
        onChange={(e) => {
          setDepositAmount(parseFloat(e.target.value));
        }}
      />
      <br />
      <button
        onClick={async () => {
          if (!walletClient || !address) return;
          const relayFees = await publicClient.readContract({
            abi: CROSS_CHAIN_ABI,
            address: CROSS_CHAIN_CONTRACT_ADDRESS,
            functionName: 'getRelayFees',
          });
          console.log('relayFees', relayFees);
          const [relayFee, ackRelayFee] = relayFees;
          console.log('relayFee', relayFee);
          console.log('ackRelayFee', ackRelayFee);

          const amount = parseEther(`${depositAmount}`);
          const amount_with_relay_fee = relayFee + ackRelayFee + amount;
          console.log('amount_with_relay_fee', amount_with_relay_fee);

          const estimateGas = await publicClient.estimateContractGas({
            address: TOKEN_HUB_CONTRACT_ADDRESS,
            abi: TOKENHUB_ABI,
            functionName: 'transferOut',
            args: [address, amount],
            account: address,
            value: amount_with_relay_fee,
          });
          console.log('estimateGas', estimateGas);

          const gasPrice = await publicClient.getGasPrice();

          console.log('gasPrice', gasPrice);

          const gasFee = estimateGas * gasPrice;
          console.log('estimate gas fee: gas price * gas = ', formatEther(gasFee), 'ETH');

          const txHash = await walletClient.writeContract({
            address: TOKEN_HUB_CONTRACT_ADDRESS,
            abi: TOKENHUB_ABI,
            functionName: 'transferOut',
            args: [address, amount],
            account: address,
            value: amount_with_relay_fee,
          });

          console.log(txHash);
        }}
      >
        deposit
      </button>
    </div>
  );
};
