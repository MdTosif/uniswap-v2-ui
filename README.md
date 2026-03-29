# Uniswap V2 UI

A multi-network Uniswap V2 interface built with **Next.js 16**, **wagmi v3**, **viem**, and **RainbowKit**. Swap tokens, add/remove liquidity, and explore live pool data across multiple EVM networks — all from a single UI.

---

## Features

| Feature | Details |
|---|---|
| **Token Swap** | ETH ↔ Token and Token ↔ Token via `swapExactETHForTokens`, `swapExactTokensForETH`, `swapExactTokensForTokens` |
| **Liquidity Management** | Add liquidity (`addLiquidity`, `addLiquidityETH`) and remove liquidity (`removeLiquidity`, `removeLiquidityETH`) with LP token management |
| **Pool Explorer** | Live on-chain reserve data, total LP supply, and pair addresses from the factory contract |
| **Multi-network** | Hoodi testnet (default), Ethereum, Sepolia, Polygon, BNB Chain, Arbitrum, Base |
| **Wallet Support** | MetaMask, Coinbase Wallet, WalletConnect, and any injected wallet via RainbowKit |
| **Slippage Control** | Configurable slippage tolerance (0.1% – 50%) with minimum output enforcement |
| **Price Impact** | Live price impact calculation with high-impact warnings (> 5%) |
| **Token Allowance** | Automatic ERC-20 approval detection and approve flow before swap/liquidity |

---

## Supported Networks

| Network | Chain ID | DEX | Default |
|---|---|---|---|
| **Hoodi** | 560048 | Uniswap V2 | ✅ |
| Ethereum | 1 | Uniswap V2 | |
| Sepolia | 11155111 | Uniswap V2 | |
| Polygon | 137 | QuickSwap V2 | |
| BNB Chain | 56 | PancakeSwap V2 | |
| Arbitrum One | 42161 | SushiSwap V2 | |
| Base | 8453 | BaseSwap | |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A WalletConnect project ID (free at [cloud.walletconnect.com](https://cloud.walletconnect.com))
- MetaMask or another EVM wallet browser extension

### Installation

```bash
git clone <repo-url>
cd uniswap-v2-ui
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

> Without a project ID, WalletConnect QR-code connections are disabled, but MetaMask and Coinbase Wallet still work.

### Run

```bash
npm run dev      # development server at http://localhost:3000
npm run build    # production build
npm start        # serve production build
```

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — mounts providers and header
│   ├── page.tsx            # Home / landing page
│   ├── swap/page.tsx       # Swap page
│   ├── liquidity/page.tsx  # Add/Remove liquidity page
│   └── pools/page.tsx      # Pool explorer page
│
├── components/
│   ├── layout/Header.tsx           # Nav bar with wallet connect button
│   ├── providers/Providers.tsx     # wagmi + RainbowKit + TanStack Query setup
│   ├── SwapInterface.tsx           # Full swap UI (quote, approve, swap)
│   ├── LiquidityManager.tsx        # Add/Remove liquidity tabs
│   ├── PoolCard.tsx                # Single pool data card (reserves, supply)
│   └── TokenSelector.tsx           # Searchable token picker modal
│
├── config/
│   ├── wagmi.ts        # Chain list, RPC transports, wallet config
│   ├── contracts.ts    # Uniswap V2 ABIs + factory/router/WETH per chain
│   └── tokens.ts       # Token lists and popular pool pairs per chain
│
└── lib/
    └── utils.ts        # formatAmount, calcPriceImpact, slippageMultiplier, txDeadline
```

---

## Adding a New Network

**1. Add the chain to `src/config/wagmi.ts`:**

```ts
import { myChain } from 'wagmi/chains';

chains: [hoodi, myChain, ...],
transports: {
  [myChain.id]: http('https://rpc.mychain.example'),
  ...
},
```

**2. Add contract addresses to `src/config/contracts.ts`:**

```ts
export const CONTRACTS: Record<number, NetworkContracts> = {
  [myChain.id]: {
    factory: '0x...',
    router:  '0x...',
    weth:    '0x...',
    dexName: 'MyDex V2',
  },
};
```

**3. Add tokens to `src/config/tokens.ts`:**

```ts
export const TOKENS: Record<number, Token[]> = {
  [myChain.id]: [
    { address: NATIVE_ADDRESS, symbol: 'ETH', name: 'Ether', decimals: 18, chainId: myChain.id, isNative: true },
    { address: '0x...', symbol: 'USDC', name: 'USD Coin', decimals: 6, chainId: myChain.id },
  ],
};
```

**4. (Optional) Add popular pools to `POPULAR_POOLS` in `tokens.ts`.**

---

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| Next.js | 16.2.1 | React framework (App Router) |
| wagmi | 3.6.0 | Ethereum hooks |
| viem | 2.x | Low-level EVM client |
| RainbowKit | 2.2.10 | Wallet connection UI |
| TanStack Query | 5.x | Async state management |
| Tailwind CSS | 4.x | Styling |

---

## Disclaimer

This is an open-source UI for educational and development purposes. Always verify contract addresses and transaction details before signing. Not affiliated with Uniswap Labs.
