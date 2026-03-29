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
    [hoodi.id]:    fallback([http('https://0xrpc.io/hoodi'), http('https://0xrpc.io/hoodi')]),
    [mainnet.id]:  fallback([http('https://cloudflare-eth.com'), http('https://rpc.ankr.com/eth')]),
    [sepolia.id]:  fallback([http('https://rpc.sepolia.org'), http('https://rpc.ankr.com/eth_sepolia'), http('https://ethereum-sepolia-rpc.publicnode.com')]),
    [polygon.id]:  fallback([http('https://polygon-rpc.com'), http('https://rpc.ankr.com/polygon'), http('https://polygon.publicnode.com')]),
    [bsc.id]:      fallback([http('https://bsc-dataseed1.binance.org'), http('https://rpc.ankr.com/bsc'), http('https://bsc.publicnode.com')]),
    [arbitrum.id]: fallback([http('https://arb1.arbitrum.io/rpc'), http('https://rpc.ankr.com/arbitrum'), http('https://arbitrum-one.publicnode.com')]),
    [base.id]:     fallback([http('https://mainnet.base.org'), http('https://rpc.ankr.com/base'), http('https://base.publicnode.com')]),
  },
});
