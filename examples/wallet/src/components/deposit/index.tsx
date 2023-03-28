import { TOKEN_HUB_CONTRACT_ADDRESS, CROSS_CHAIN_CONTRACT_ADDRESS } from '@/config';
import { TOKENHUB_ABI, CROSS_CHAIN_ABI } from '@/constants/abi';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useAccount, useProvider, useSigner } from 'wagmi';

export const Deposit = () => {
  const { address, connector, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [depositAmount, setDepositAmount] = useState(0);
  const tokenHubContract = new ethers.Contract(TOKEN_HUB_CONTRACT_ADDRESS, TOKENHUB_ABI, signer!);

  const crossChainContract = new ethers.Contract(
    CROSS_CHAIN_CONTRACT_ADDRESS,
    CROSS_CHAIN_ABI,
    signer!,
  );

  return (
    <div>
      <h2> Deposit </h2>
      amount:
      <input
        onChange={(e) => {
          setDepositAmount(parseInt(e.target.value));
        }}
      />
      <br />
      <button
        onClick={async () => {
          const feeData = await provider.getFeeData();
          console.log('feeData', feeData);

          const relayFees = await crossChainContract.getRelayFees();
          console.log('relayFees', relayFees);

          const [relayFee, ackRelayFee] = relayFees;
          console.log('relayFee', relayFee);
          console.log('ackRelayFee', ackRelayFee);

          const amount = ethers.utils.parseEther(depositAmount.toString());

          const amount_with_relay_fee = relayFee.add(ackRelayFee).add(amount);

          // https://docs.ethers.org/v5/api/providers/provider/#Provider-estimateGas
          const estimateGas = await tokenHubContract.estimateGas.transferOut(address, amount, {
            value: amount_with_relay_fee,
          });
          console.log('estimateGas', estimateGas);
          console.log('gasPrice', ethers.utils.formatEther(feeData.gasPrice!));

          const gasFee = estimateGas.mul(feeData.gasPrice!);

          console.log('estimate gas fee: gas price * gas', ethers.utils.formatEther(gasFee), 'eth');
        }}
      >
        estimate gas
      </button>
      <br />
      <button
        onClick={async () => {
          if (!tokenHubContract || !crossChainContract) return;
          const amount = ethers.utils.parseEther(depositAmount.toString());

          const relayFees = await crossChainContract.getRelayFees();
          console.log('relayFees', relayFees);

          const [relayFee, ackRelayFee] = relayFees;
          console.log('relayFee', relayFee);
          console.log('ackRelayFee', ackRelayFee);

          const amount_with_relay_fee = relayFee.add(ackRelayFee).add(amount);
          console.log('relayFee', relayFee);
          console.log('ackRelayFee', ackRelayFee);
          console.log('amount_with_relay_fee', amount_with_relay_fee);

          const tx = await tokenHubContract.transferOut(address, amount, {
            value: amount_with_relay_fee,
          });

          const res = await tx.wait();

          console.log(res);
        }}
      >
        call contract
      </button>
      {/* {isLoading && <div>Check Wallet</div>}
          {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>} */}
    </div>
  );
};
