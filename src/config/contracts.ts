// ─── ABIs ────────────────────────────────────────────────────────────────────

export const ERC20_ABI = [
  { inputs: [], name: 'name', outputs: [{ type: 'string' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'symbol', outputs: [{ type: 'string' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'decimals', outputs: [{ type: 'uint8' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'totalSupply', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], name: 'allowance', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'approve', outputs: [{ type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'transfer', outputs: [{ type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'from', type: 'address' }, { name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'transferFrom', outputs: [{ type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
] as const;

export const UNISWAP_V2_FACTORY_ABI = [
  { inputs: [{ name: 'tokenA', type: 'address' }, { name: 'tokenB', type: 'address' }], name: 'getPair', outputs: [{ name: 'pair', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: '', type: 'uint256' }], name: 'allPairs', outputs: [{ name: 'pair', type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'allPairsLength', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'tokenA', type: 'address' }, { name: 'tokenB', type: 'address' }], name: 'createPair', outputs: [{ name: 'pair', type: 'address' }], stateMutability: 'nonpayable', type: 'function' },
] as const;

export const UNISWAP_V2_ROUTER_ABI = [
  { inputs: [], name: 'WETH', outputs: [{ type: 'address' }], stateMutability: 'pure', type: 'function' },
  { inputs: [], name: 'factory', outputs: [{ type: 'address' }], stateMutability: 'pure', type: 'function' },
  {
    inputs: [{ name: 'amountIn', type: 'uint256' }, { name: 'amountOutMin', type: 'uint256' }, { name: 'path', type: 'address[]' }, { name: 'to', type: 'address' }, { name: 'deadline', type: 'uint256' }],
    name: 'swapExactTokensForTokens', outputs: [{ name: 'amounts', type: 'uint256[]' }], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: 'amountOutMin', type: 'uint256' }, { name: 'path', type: 'address[]' }, { name: 'to', type: 'address' }, { name: 'deadline', type: 'uint256' }],
    name: 'swapExactETHForTokens', outputs: [{ name: 'amounts', type: 'uint256[]' }], stateMutability: 'payable', type: 'function',
  },
  {
    inputs: [{ name: 'amountIn', type: 'uint256' }, { name: 'amountOutMin', type: 'uint256' }, { name: 'path', type: 'address[]' }, { name: 'to', type: 'address' }, { name: 'deadline', type: 'uint256' }],
    name: 'swapExactTokensForETH', outputs: [{ name: 'amounts', type: 'uint256[]' }], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: 'tokenA', type: 'address' }, { name: 'tokenB', type: 'address' }, { name: 'amountADesired', type: 'uint256' }, { name: 'amountBDesired', type: 'uint256' }, { name: 'amountAMin', type: 'uint256' }, { name: 'amountBMin', type: 'uint256' }, { name: 'to', type: 'address' }, { name: 'deadline', type: 'uint256' }],
    name: 'addLiquidity', outputs: [{ name: 'amountA', type: 'uint256' }, { name: 'amountB', type: 'uint256' }, { name: 'liquidity', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: 'token', type: 'address' }, { name: 'amountTokenDesired', type: 'uint256' }, { name: 'amountTokenMin', type: 'uint256' }, { name: 'amountETHMin', type: 'uint256' }, { name: 'to', type: 'address' }, { name: 'deadline', type: 'uint256' }],
    name: 'addLiquidityETH', outputs: [{ name: 'amountToken', type: 'uint256' }, { name: 'amountETH', type: 'uint256' }, { name: 'liquidity', type: 'uint256' }], stateMutability: 'payable', type: 'function',
  },
  {
    inputs: [{ name: 'tokenA', type: 'address' }, { name: 'tokenB', type: 'address' }, { name: 'liquidity', type: 'uint256' }, { name: 'amountAMin', type: 'uint256' }, { name: 'amountBMin', type: 'uint256' }, { name: 'to', type: 'address' }, { name: 'deadline', type: 'uint256' }],
    name: 'removeLiquidity', outputs: [{ name: 'amountA', type: 'uint256' }, { name: 'amountB', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: 'token', type: 'address' }, { name: 'liquidity', type: 'uint256' }, { name: 'amountTokenMin', type: 'uint256' }, { name: 'amountETHMin', type: 'uint256' }, { name: 'to', type: 'address' }, { name: 'deadline', type: 'uint256' }],
    name: 'removeLiquidityETH', outputs: [{ name: 'amountToken', type: 'uint256' }, { name: 'amountETH', type: 'uint256' }], stateMutability: 'nonpayable', type: 'function',
  },
  {
    inputs: [{ name: 'amountIn', type: 'uint256' }, { name: 'path', type: 'address[]' }],
    name: 'getAmountsOut', outputs: [{ name: 'amounts', type: 'uint256[]' }], stateMutability: 'view', type: 'function',
  },
  {
    inputs: [{ name: 'amountOut', type: 'uint256' }, { name: 'path', type: 'address[]' }],
    name: 'getAmountsIn', outputs: [{ name: 'amounts', type: 'uint256[]' }], stateMutability: 'view', type: 'function',
  },
] as const;

export const UNISWAP_V2_PAIR_ABI = [
  { inputs: [], name: 'token0', outputs: [{ type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'token1', outputs: [{ type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'totalSupply', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'getReserves', outputs: [{ name: 'reserve0', type: 'uint112' }, { name: 'reserve1', type: 'uint112' }, { name: 'blockTimestampLast', type: 'uint32' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'approve', outputs: [{ type: 'bool' }], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], name: 'allowance', outputs: [{ type: 'uint256' }], stateMutability: 'view', type: 'function' },
] as const;

// ─── Contract Addresses Per Network ──────────────────────────────────────────

export interface NetworkContracts {
  factory: `0x${string}`;
  router: `0x${string}`;
  weth: `0x${string}`;
  /** Human-readable DEX name (Uniswap V2, QuickSwap, PancakeSwap …) */
  dexName: string;
}

/** Maps chainId → Uniswap-V2-compatible contract addresses */
export const CONTRACTS: Record<number, NetworkContracts> = {
  // Ethereum Mainnet — Uniswap V2
  1: {
    factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    weth: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    dexName: 'Uniswap V2',
  },
  // Sepolia testnet — Uniswap V2 test deployment
  11155111: {
    factory: '0xF62c03E08ada871A0bEb309762E260a7a6a880E6',
    router: '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3',
    weth: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
    dexName: 'Uniswap V2 (Sepolia)',
  },
  // Polygon — QuickSwap V2 (same interface)
  137: {
    factory: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
    router: '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
    weth: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    dexName: 'QuickSwap V2',
  },
  // BNB Smart Chain — PancakeSwap V2
  56: {
    factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    router: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    weth: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    dexName: 'PancakeSwap V2',
  },
  // Arbitrum One — SushiSwap V2
  42161: {
    factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    weth: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    dexName: 'SushiSwap V2',
  },
  // Base — BaseSwap
  8453: {
    factory: '0xFDa619b6d20975be80A10332cD39b9a4b0FAa8BB',
    router: '0x327Df1E6de05895d2ab08513aaDD9313Fe505d86',
    weth: '0x4200000000000000000000000000000000000006',
    dexName: 'BaseSwap',
  },

  560048:{
    factory: '0xF34A3BAA33752C8F2279F4AD553312Ca84A8B712',
    router: '0x46a4f71243bf75bfd96d97ddb9512ADdb0e74e2b',
    weth: '0x15a35CbEF19fce41BCA5Fa86e5F90be37b03AFE8',
    dexName: 'Uniswap V2 (Hoodi)',
  }
};
