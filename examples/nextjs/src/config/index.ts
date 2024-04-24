import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { rainbowWallet, walletConnectWallet, trustWallet } from '@rainbow-me/rainbowkit/wallets';
import { createConfig, http } from 'wagmi';
import { Chain, mainnet, bscGreenfield } from 'wagmi/chains';
import * as env from './env';

export const GRPC_URL = env.GRPC_URL;
export const GREENFIELD_RPC_URL = env.GREENFIELD_RPC_URL;
export const GREEN_CHAIN_ID = env.GREEN_CHAIN_ID;
export const BSC_RPC_URL = env.BSC_RPC_URL;
export const BSC_CHAIN_ID = env.BSC_CHAIN_ID;
export const TOKEN_HUB_CONTRACT_ADDRESS = env.TOKEN_HUB_CONTRACT_ADDRESS;
export const CROSS_CHAIN_CONTRACT_ADDRESS = env.CROSS_CHAIN_CONTRACT_ADDRESS;

const greenFieldChain: Chain = {
  id: GREEN_CHAIN_ID,
  name: 'greenfield',
  rpcUrls: {
    default: {
      http: [GREENFIELD_RPC_URL],
    },
    public: {
      http: [GREENFIELD_RPC_URL],
    },
  },
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18,
  },
};

export const bscChain: Chain = {
  id: BSC_CHAIN_ID,
  name: 'BSC',
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

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [rainbowWallet, walletConnectWallet, trustWallet],
    },
  ],
  {
    appName: 'gnfd demo',
    projectId: '9bf3510aab08be54d5181a126967ee71',
  },
);

export const wagmiConfig = createConfig({
  chains: [mainnet, bscChain, greenFieldChain],
  transports: {
    [mainnet.id]: http(),
    [bscChain.id]: http(),
  },
  connectors,
});
