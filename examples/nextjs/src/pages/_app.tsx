import { chains, publicClient, webSocketPublicClient } from '@/config';
import '@/styles/globals.css';
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { createConfig, WagmiConfig } from 'wagmi';

const projectId = '9bf3510aab08be54d5181a126967ee71';
const { wallets } = getDefaultWallets({
  projectId,
  appName: 'greenfield js sdk demo',
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  // {
  //   groupName: 'Recommended',
  //   wallets: [
  //     trustWallet({ projectId, chains, shimDisconnect: true }),
  //     // RainbowTrustWalletConnector({ projectId, chains }),
  //   ],
  // },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  webSocketPublicClient,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider modalSize="compact" chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
