import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia, polygon, bsc, arbitrum, base, hoodi } from 'wagmi/chains';
import { TRANSPORTS } from './chains';

export const config = getDefaultConfig({
  appName: 'Uniswap V2 UI',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '',
  // hoodi is first → default chain for the app
  chains: [hoodi, mainnet, sepolia, polygon, bsc, arbitrum, base],
  ssr: true, // Required for Next.js App Router
  // Transports are defined alongside all other chain data in src/config/chains.ts
  transports: TRANSPORTS,
});
