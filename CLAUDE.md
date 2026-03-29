# CLAUDE.md — Coding Agent Guide

This file tells AI coding agents how this codebase is structured, what rules to follow, and common pitfalls to avoid.

---

## Project Overview

**Uniswap V2 UI** — a Next.js 16 (App Router) TypeScript app for interacting with Uniswap V2-compatible DEXes across multiple EVM networks.

Default network: **Hoodi testnet** (chain ID 560048).

---

## Build & Dev Commands

```bash
npm run dev      # start dev server on http://localhost:3000
npm run build    # production build (must pass with 0 errors before committing)
npm run lint     # ESLint
npm start        # serve production build
```

Always run `npm run build` after making changes to confirm there are no TypeScript or compile errors.

---

## Architecture

### Config layer (`src/config/`)

| File | Purpose |
|---|---|
| `wagmi.ts` | Chain list, RPC transports, WalletConnect project ID |
| `contracts.ts` | Uniswap V2 ABIs (ERC20, Factory, Router, Pair) + addresses per chain ID |
| `tokens.ts` | `Token[]` per chain ID, `POPULAR_POOLS` per chain ID |

### Component layer (`src/components/`)

| Component | Responsibility |
|---|---|
| `providers/Providers.tsx` | Mounts `WagmiProvider`, `QueryClientProvider`, `RainbowKitProvider` |
| `layout/Header.tsx` | Nav + `<ConnectButton />` |
| `SwapInterface.tsx` | Quote → Approve → Swap flow |
| `LiquidityManager.tsx` | Add / Remove liquidity tabs |
| `PoolCard.tsx` | Reads reserves + supply for a single pair |
| `TokenSelector.tsx` | Modal for picking a token with balance display |

### Pages (`src/app/`)

All pages are **server components** except those using wagmi hooks (marked `'use client'` at the top of their components, not the page file).

---

## Critical Rules

### 1. `ssr: true` in wagmi config — NEVER change to `false`

```ts
// src/config/wagmi.ts
export const config = getDefaultConfig({
  ssr: true,  // ← must stay true for Next.js App Router
  ...
});
```

Setting `ssr: false` silently breaks provider hydration in Next.js App Router, causes the wallet connect modal to not open, and generates `-32603` Internal JSON-RPC errors on every contract read.

### 2. Always define explicit `transports`

```ts
transports: {
  [mainnet.id]: http('https://eth.llamarpc.com'),
  [hoodi.id]:   fallback([http('https://rpc.hoodi.ethpandaops.io'), http('https://hoodi.drpc.org')]),
  // ... every chain in the chains array must have a transport
}
```

Without explicit transports, wagmi routes all RPC reads through WalletConnect relay nodes, which causes `-32603` errors and throttling. Every chain in the `chains` array **must** have a corresponding entry in `transports`.

### 3. `retry: false` on QueryClient

```ts
new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 10_000 } }
})
```

Uniswap V2 contracts revert (returning a JSON-RPC error) when a pair has no liquidity. Without `retry: false`, TanStack Query retries those calls 3 times, flooding the console with `-32603` errors.

### 4. Guard `useReadContract` query `enabled` conditions tightly

When calling `getAmountsOut`, ensure the path tokens are distinct:
```ts
enabled: !!contracts && amountInWei > 0n && swapPath[0] !== swapPath[1]
```

When calling pair data, ensure the pair address is non-zero:
```ts
enabled: !!pairExists  // pairExists = address !== '0x000...000'
```

### 5. BigInt literals require `target: "ES2020"` minimum

`tsconfig.json` must have `"target": "ES2020"` (or higher). `ES2017` or lower will fail to compile BigInt literal syntax (`0n`, `1n`, etc.).

### 6. `suppressHydrationWarning` on `<body>`

Browser extensions (Grammarly, etc.) inject attributes onto `<body>` after SSR, causing harmless but noisy React hydration warnings. The `<body>` tag in `src/app/layout.tsx` has `suppressHydrationWarning` to silence them.

---

## Adding a New Chain — Checklist

1. **`src/config/wagmi.ts`** — import chain from `wagmi/chains`, add to `chains` array, add `http(rpcUrl)` to `transports`
2. **`src/config/contracts.ts`** — add entry to `CONTRACTS` with `factory`, `router`, `weth`, `dexName`
3. **`src/config/tokens.ts`** — add `Token[]` to `TOKENS[chainId]` (include native + WETH at minimum)
4. **`src/config/tokens.ts`** — optionally add popular pairs to `POPULAR_POOLS[chainId]`

The first chain in the `chains` array is the **default network**.

---

## Common Pitfalls

| Symptom | Cause | Fix |
|---|---|---|
| Wallet modal doesn't open, `-32603` everywhere | `ssr: false` | Set `ssr: true` |
| `-32603` on pools/swap page | Missing `transports` entry | Add `http()` for all chains |
| `-32603` spam in console | TanStack Query retrying reverted calls | `retry: false` on QueryClient |
| "Insufficient liquidity" button shows when pair exists | Same token selected for in/out | Guard: `swapPath[0] !== swapPath[1]` |
| BigInt compile error | TypeScript target too low | `"target": "ES2020"` in tsconfig |
| MetaMask not in wallet list | Using `createConfig` without `connectorsForWallets` | Use `getDefaultConfig` from RainbowKit |
| Hydration mismatch on `<body>` | Browser extension attributes | `suppressHydrationWarning` on `<body>` |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Optional | WalletConnect v2 project ID. Without it, WC QR codes are disabled but injected wallets (MetaMask) still work. |

Set in `.env.local` (not committed). See `.env.example` for reference.

---

## Dependencies

| Package | Notes |
|---|---|
| `wagmi` v3 | Use `useReadContract`, `useWriteContract`, `useWaitForTransactionReceipt`. No `usePrepareContractWrite` (removed in v2+). |
| `viem` v2 | Use `parseUnits`, `formatUnits`, `maxUint256`. Import from `'viem'`, not `'ethers'`. |
| `@rainbow-me/rainbowkit` v2 | Use `getDefaultConfig` for wallet list. `createConfig` alone loses the wallet modal. |
| `@tanstack/react-query` v5 | `useQuery` options are nested under `query: { enabled, retry, staleTime }` inside wagmi hooks. |
