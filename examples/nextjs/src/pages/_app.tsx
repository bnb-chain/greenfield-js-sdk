import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { createClient, WagmiConfig } from 'wagmi';
import {
  metaMaskWalletConnector,
  provider,
  trustWalletConnector,
  webSocketProvider,
} from '@/config';

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [metaMaskWalletConnector, trustWalletConnector],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}
