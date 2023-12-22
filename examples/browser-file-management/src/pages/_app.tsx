import { chains, publicClient, webSocketPublicClient } from '@/config/wallet';
import '@/styles/globals.css';
import {
  RainbowKitProvider,
  connectorsForWallets,
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { WagmiConfig, createConfig } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const projectId = '9bf3510aab08be54d5181a126967ee71';
const { wallets } = getDefaultWallets({
  projectId,
  appName: 'greenfield js sdk demo',
  chains,
});

const connectors = connectorsForWallets([...wallets]);

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
