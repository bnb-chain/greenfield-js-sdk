import {
  coinbaseWalletConnector,
  metaMaskWalletConnector,
  publicClient,
  trustWalletConnector,
  webSocketPublicClient,
} from '@/config';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { createConfig, WagmiConfig } from 'wagmi';

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [metaMaskWalletConnector, trustWalletConnector, coinbaseWalletConnector],
  webSocketPublicClient,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}
