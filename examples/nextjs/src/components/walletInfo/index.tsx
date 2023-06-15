import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDisconnect } from 'wagmi';

export const WalletInfo = () => {
  const { disconnect } = useDisconnect();

  return (
    <div>
      <ConnectButton accountStatus="address" />
    </div>
  );
};
