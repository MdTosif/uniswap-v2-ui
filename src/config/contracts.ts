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

// ─── Contract Addresses & Types — re-exported from the combined chains config ─
export type { NetworkContracts } from './chains';
export { CONTRACTS } from './chains';
