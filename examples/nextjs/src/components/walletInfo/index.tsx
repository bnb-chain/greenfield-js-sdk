import {
  BSC_CHAIN_ID,
  GREEN_CHAIN_ID,
  coinbaseWalletConnector,
  metaMaskWalletConnector,
  trustWalletConnector,
} from '@/config';
import { createWalletClient, custom } from 'viem';
import { mainnet } from 'viem/chains';
import {
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
  useWalletClient,
} from 'wagmi';

export const WalletInfo = () => {
  const { address, connector, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { connect: metaMaskConnect } = useConnect({
    connector: metaMaskWalletConnector,
  });
  const { connect: trustWalletConnect } = useConnect({
    connector: trustWalletConnector,
  });
  const { connect: coinbaseWalletConnect } = useConnect({
    connector: coinbaseWalletConnector,
  });

  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork: switchToGreenField } = useSwitchNetwork({
    chainId: GREEN_CHAIN_ID,
  });

  const { switchNetwork: switchToBSC } = useSwitchNetwork({
    chainId: BSC_CHAIN_ID,
  });

  const balance = useBalance({
    address,
    watch: true,
  });

  if (!isConnected) {
    return (
      <>
        <button onClick={() => metaMaskConnect()}>Connect MetaMask</button>
        <button onClick={() => trustWalletConnect()}>Connect trustWallet</button>
        <button onClick={() => coinbaseWalletConnect()}>Connect coinbase wallet</button>
      </>
    );
  }

  return (
    <div>
      <div>
        <h2>address : {address}</h2>
        <h2>connector: {connector?.name} </h2>
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>

      <h2>change chain chainId {chain?.id}</h2>
      <h3>balance: {balance.data?.formatted}</h3>
      <button
        onClick={() => {
          switchToGreenField?.(GREEN_CHAIN_ID);
        }}
      >
        switch to green field
      </button>
      <br />
      <button
        onClick={() => {
          switchToBSC?.(BSC_CHAIN_ID);
        }}
      >
        switch to bsc
      </button>
    </div>
  );
};
