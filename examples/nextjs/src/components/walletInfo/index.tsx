import { ConnectButton } from '@rainbow-me/rainbowkit';

export const WalletInfo = () => {
  return (
    <div>
      <ConnectButton accountStatus="address" />
    </div>
  );
};
