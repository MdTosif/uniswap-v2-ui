import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, bsc, arbitrum, base } from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'Uniswap V2 UI',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
  chains: [mainnet, sepolia, polygon, bsc, arbitrum, base],
  ssr: true,
  // Explicit transports so contract reads never go through WalletConnect nodes.
  // These are stable, rate-limit-tolerant public endpoints.
  // Swap in Alchemy/Infura URLs for production use.
  transports: {
    [mainnet.id]:  http('https://eth.llamarpc.com'),
    [sepolia.id]:  http('https://rpc.sepolia.org'),
    [polygon.id]:  http('https://polygon.llamarpc.com'),
    [bsc.id]:      http('https://bsc-dataseed1.binance.org'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [base.id]:     http('https://mainnet.base.org'),
  },
});
