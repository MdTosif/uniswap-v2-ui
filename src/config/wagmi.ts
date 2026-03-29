import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, bsc, arbitrum, base, hoodi } from 'wagmi/chains';
import { http, fallback } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'Uniswap V2 UI',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
  // hoodi is first → default chain for the app
  chains: [hoodi, mainnet, sepolia, polygon, bsc, arbitrum, base],
  ssr: true, // Required for Next.js App Router
  // Explicit transports ensure all contract reads go directly to chain RPCs
  // and never through WalletConnect relay (which caused the -32603 errors).
  transports: {
    [hoodi.id]:    fallback([http('https://rpc.hoodi.ethpandaops.io'), http('https://hoodi.drpc.org')]),
    [mainnet.id]:  http('https://eth.llamarpc.com'),
    [sepolia.id]:  http('https://rpc.sepolia.org'),
    [polygon.id]:  http('https://polygon.llamarpc.com'),
    [bsc.id]:      http('https://bsc-dataseed1.binance.org'),
    [arbitrum.id]: http('https://arb1.arbitrum.io/rpc'),
    [base.id]:     http('https://mainnet.base.org'),
  },
});
