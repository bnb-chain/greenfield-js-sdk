import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Wallet = () => {
  return (
    <div>
      <ConnectButton accountStatus="address" />
    </div>
  );
};
