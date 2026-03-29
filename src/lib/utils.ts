import { formatUnits } from 'viem';

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

export function formatAmount(
  value: bigint,
  decimals: number,
  displayDecimals = 6,
): string {
  const formatted = formatUnits(value, decimals);
  const num = parseFloat(formatted);
  if (num === 0) return '0';
  if (num < 0.000001) return '< 0.000001';
  return num.toLocaleString('en-US', {
    maximumFractionDigits: displayDecimals,
    minimumFractionDigits: 0,
  });
}

export function formatUSD(value: number): string {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });
}

/**
 * Compute price impact % given reserves (in the same unit) and amount in.
 * Formula: (amountIn / (reserveIn + amountIn)) * 100
 */
export function calcPriceImpact(
  amountIn: bigint,
  reserveIn: bigint,
  decimalsIn: number,
): number {
  if (reserveIn === 0n) return 0;
  const ai = Number(formatUnits(amountIn, decimalsIn));
  const ri = Number(formatUnits(reserveIn, decimalsIn));
  return (ai / (ri + ai)) * 100;
}

/** Convert a slippage % to a basis-points multiplier as 1000ths: 0.5% → 995n */
export function slippageMultiplier(slippage: number): bigint {
  return BigInt(Math.floor(1000 - slippage * 10));
}

/** EVM deadline: current unix timestamp + seconds */
export function txDeadline(seconds = 1200): bigint {
  return BigInt(Math.floor(Date.now() / 1000) + seconds);
}

export const MAX_UINT256 =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n;
