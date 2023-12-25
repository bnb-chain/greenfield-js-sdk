import { Wallet } from '@rainbow-me/rainbowkit';
import { Chain, configureChains, mainnet } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { publicProvider } from 'wagmi/providers/public';
import { BSC_CHAIN_ID, BSC_RPC_URL, GREEN_CHAIN_ID, GREENFIELD_RPC_URL } from './env';

const greenFieldChain: Chain = {
  id: GREEN_CHAIN_ID,
  network: 'greenfield',
  rpcUrls: {
    default: {
      http: [GREENFIELD_RPC_URL],
    },
    public: {
      http: [GREENFIELD_RPC_URL],
    },
  },
  name: 'greenfield',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
};

const bscChain: Chain = {
  id: BSC_CHAIN_ID,
  name: 'BSC',
  network: 'QA - bsc smart chain',
  rpcUrls: {
    default: {
      http: [BSC_RPC_URL],
    },
    public: {
      http: [BSC_RPC_URL],
    },
  },
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
  // blockExplorers: {
  //   default: { name: '', url: 'https://testnet.bscscan.com/' },
  // },
  // testnet: true,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    {
      ...greenFieldChain,
      iconUrl:
        'https://github.com/wagmi-dev/wagmi/assets/5653652/44446c8c-5c72-4e89-b8eb-3042ef618eed',
    },
    bscChain,
  ],
  [publicProvider()],
);

const coinbaseWalletConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: 'wagmi',
  },
});

const trustWalletConnector = new InjectedConnector({
  chains,
  options: {
    name: 'GN',
    shimDisconnect: true,
    // TODO: rainbowkit conflict
    getProvider: () => (typeof window !== 'undefined' ? (window as any).trustwallet : undefined),
  },
});

const metaMaskWalletConnector = new MetaMaskConnector({ chains });

export interface MyWalletOptions {
  projectId: string;
  chains: Chain[];
}

const RainbowTrustWalletConnector = ({ chains, projectId }: MyWalletOptions): Wallet => ({
  id: '_trust-wallet',
  name: 'Trust Wallet',
  iconUrl: 'https://my-image.xyz',
  iconBackground: '#0c2f78',
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=my.wallet',
    ios: 'https://apps.apple.com/us/app/my-wallet',
    chrome: 'https://chrome.google.com/webstore/detail/my-wallet',
    qrCode: 'https://my-wallet/qr',
  },
  createConnector: () => {
    return {
      connector: trustWalletConnector,
    };
  },
});

export {
  chains,
  coinbaseWalletConnector,
  metaMaskWalletConnector,
  publicClient,
  RainbowTrustWalletConnector,
  trustWalletConnector,
  webSocketPublicClient,
};
