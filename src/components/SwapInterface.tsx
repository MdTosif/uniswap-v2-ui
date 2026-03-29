'use client';

import { useState, useMemo } from 'react';
import {
  useAccount,
  useChainId,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseUnits, formatUnits, maxUint256 } from 'viem';
import { CONTRACTS, UNISWAP_V2_ROUTER_ABI, ERC20_ABI } from '@/config/contracts';
import { TOKENS, Token } from '@/config/tokens';
import { formatAmount, slippageMultiplier, txDeadline, calcPriceImpact } from '@/lib/utils';
import { TokenSelector } from './TokenSelector';
import { useConnectModal } from '@rainbow-me/rainbowkit';

type TxStatus = 'idle' | 'approving' | 'swapping' | 'success' | 'error';

export function SwapInterface() {
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const contracts = CONTRACTS[chainId];
  const tokens = TOKENS[chainId] ?? [];

  const [tokenIn, setTokenIn] = useState<Token | null>(tokens[0] ?? null);
  const [tokenOut, setTokenOut] = useState<Token | null>(tokens[1] ?? null);
  const [amountIn, setAmountIn] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [showSettings, setShowSettings] = useState(false);

  // ── Balances ────────────────────────────────────────────────────────────────
  const { data: nativeBalance } = useBalance({ address, query: { enabled: !!address && !!tokenIn?.isNative } });
  const { data: erc20Balance } = useReadContract({
    address: tokenIn?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!tokenIn && !tokenIn.isNative },
  });

  const balanceRaw = tokenIn?.isNative ? nativeBalance?.value : (erc20Balance as bigint | undefined);
  const balanceDisplay = balanceRaw !== undefined && tokenIn
    ? formatAmount(balanceRaw, tokenIn.decimals, 6)
    : '—';

  // ── Amount helpers ───────────────────────────────────────────────────────────
  const amountInWei = useMemo(() => {
    if (!amountIn || !tokenIn) return 0n;
    try { return parseUnits(amountIn, tokenIn.decimals); } catch { return 0n; }
  }, [amountIn, tokenIn]);

  const swapPath = useMemo(() => {
    if (!tokenIn || !tokenOut || !contracts) return [] as `0x${string}`[];
    const inAddress = tokenIn.isNative ? contracts.weth : tokenIn.address as `0x${string}`;
    const outAddress = tokenOut.isNative ? contracts.weth : tokenOut.address as `0x${string}`;
    return [inAddress, outAddress] as `0x${string}`[];
  }, [tokenIn, tokenOut, contracts]);

  // ── Quote ────────────────────────────────────────────────────────────────────
  // Guard: only fetch when we have a non-zero amount AND the two tokens are
  // actually distinct (prevents calling getAmountsOut with a same-address path
  // which always reverts and produces -32603 JSON-RPC errors).
  const quoteEnabled =
    !!contracts &&
    amountInWei > 0n &&
    swapPath.length === 2 &&
    swapPath[0] !== swapPath[1];

  const { data: amountsOut, error: quoteError } = useReadContract({
    address: contracts?.router,
    abi: UNISWAP_V2_ROUTER_ABI,
    functionName: 'getAmountsOut',
    args: [amountInWei, swapPath],
    query: { enabled: quoteEnabled },
  });

  const amountOutWei = amountsOut ? (amountsOut as bigint[])[1] : 0n;
  const amountOutDisplay = amountOutWei && tokenOut
    ? formatAmount(amountOutWei, tokenOut.decimals, 6)
    : '';

  // ── Reserves for price impact ────────────────────────────────────────────────
  const priceImpact = useMemo(() => {
    if (!amountsOut || !tokenIn) return 0;
    const amounts = amountsOut as bigint[];
    // Approximate: input / (pool reserve) — rough estimate
    return calcPriceImpact(amountInWei, amounts[0] + amountInWei, tokenIn.decimals);
  }, [amountsOut, amountInWei, tokenIn]);

  // ── Allowance ────────────────────────────────────────────────────────────────
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenIn?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && contracts ? [address, contracts.router] : undefined,
    query: { enabled: !!address && !!contracts && !!tokenIn && !tokenIn.isNative },
  });

  const needsApproval = !tokenIn?.isNative && (allowance as bigint | undefined) !== undefined
    ? (allowance as bigint) < amountInWei
    : false;

  // ── Write hooks ──────────────────────────────────────────────────────────────
  const { writeContract: writeApprove, data: approveTxHash, isPending: isApproving } = useWriteContract();
  const { writeContract: writeSwap, data: swapTxHash, isPending: isSwapping } = useWriteContract();

  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed } = useWaitForTransactionReceipt({ hash: approveTxHash });
  const { isLoading: isSwapConfirming, isSuccess: isSwapConfirmed, isError: isSwapError } = useWaitForTransactionReceipt({ hash: swapTxHash });

  const txStatus: TxStatus = (() => {
    if (isApproving || isApproveConfirming) return 'approving';
    if (isSwapping || isSwapConfirming) return 'swapping';
    if (isSwapConfirmed) return 'success';
    if (isSwapError) return 'error';
    return 'idle';
  })();

  // ── Approve ──────────────────────────────────────────────────────────────────
  const handleApprove = () => {
    if (!tokenIn || !contracts) return;
    writeApprove(
      {
        address: tokenIn.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [contracts.router, maxUint256],
      },
      { onSuccess: () => void refetchAllowance() },
    );
  };

  // ── Swap ─────────────────────────────────────────────────────────────────────
  const handleSwap = () => {
    if (!tokenIn || !tokenOut || !contracts || !address || amountInWei === 0n || amountOutWei === 0n) return;

    const deadline = txDeadline();
    const multiplier = slippageMultiplier(slippage); // e.g. 995n for 0.5%
    const amountOutMin = (amountOutWei * multiplier) / 1000n;

    if (tokenIn.isNative) {
      writeSwap({
        address: contracts.router,
        abi: UNISWAP_V2_ROUTER_ABI,
        functionName: 'swapExactETHForTokens',
        args: [amountOutMin, swapPath, address, deadline],
        value: amountInWei,
      });
    } else if (tokenOut.isNative) {
      writeSwap({
        address: contracts.router,
        abi: UNISWAP_V2_ROUTER_ABI,
        functionName: 'swapExactTokensForETH',
        args: [amountInWei, amountOutMin, swapPath, address, deadline],
      });
    } else {
      writeSwap({
        address: contracts.router,
        abi: UNISWAP_V2_ROUTER_ABI,
        functionName: 'swapExactTokensForTokens',
        args: [amountInWei, amountOutMin, swapPath, address, deadline],
      });
    }
  };

  // ── Flip tokens ──────────────────────────────────────────────────────────────
  const handleFlip = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn('');
  };

  const handleMaxAmount = () => {
    if (balanceRaw === undefined || !tokenIn) return;
    setAmountIn(formatUnits(balanceRaw, tokenIn.decimals));
  };

  // ── Status banner ────────────────────────────────────────────────────────────
  const isPriceImpactHigh = priceImpact > 5;

  if (!contracts) {
    return (
      <div className="rounded-2xl bg-yellow-900/30 border border-yellow-500/30 p-6 text-center">
        <p className="text-yellow-400 font-medium">Uniswap V2 contracts not available on this network.</p>
        <p className="text-sm text-yellow-500/80 mt-1">Please switch to a supported network.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-gray-900 border border-white/10 shadow-xl p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Swap</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="mb-4 rounded-xl bg-gray-800 p-4 border border-white/5">
            <p className="text-sm font-medium text-gray-300 mb-2">Slippage tolerance</p>
            <div className="flex gap-2">
              {[0.1, 0.5, 1.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setSlippage(s)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${slippage === s ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  {s}%
                </button>
              ))}
              <div className="flex items-center gap-1 rounded-lg bg-gray-700 px-3">
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                  className="w-12 bg-transparent text-sm text-white focus:outline-none"
                  step="0.1"
                  min="0"
                  max="50"
                />
                <span className="text-gray-400 text-sm">%</span>
              </div>
            </div>
          </div>
        )}

        {/* Token In */}
        <div className="rounded-xl bg-gray-800 p-4 mb-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">You pay</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Balance: {balanceDisplay}</span>
              {balanceRaw !== undefined && balanceRaw > 0n && (
                <button onClick={handleMaxAmount} className="text-xs font-medium text-purple-400 hover:text-purple-300">MAX</button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="number"
              placeholder="0.0"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="flex-1 bg-transparent text-2xl font-medium text-white placeholder-gray-600 focus:outline-none"
            />
            <TokenSelector
              chainId={chainId}
              selected={tokenIn}
              onSelect={(t) => { setTokenIn(t); setAmountIn(''); }}
              exclude={tokenOut}
              label="token in"
            />
          </div>
        </div>

        {/* Flip button */}
        <div className="flex justify-center py-1">
          <button
            onClick={handleFlip}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-all rotate-0 hover:rotate-180 duration-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* Token Out */}
        <div className="rounded-xl bg-gray-800 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">You receive</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex-1 text-2xl font-medium text-white">
              {amountOutDisplay || <span className="text-gray-600">0.0</span>}
            </span>
            <TokenSelector
              chainId={chainId}
              selected={tokenOut}
              onSelect={(t) => { setTokenOut(t); }}
              exclude={tokenIn}
              label="token out"
            />
          </div>
        </div>

        {/* Price info */}
        {amountOutWei > 0n && tokenIn && tokenOut && (
          <div className="rounded-xl bg-gray-800 p-3 mb-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-400">
              <span>Rate</span>
              <span className="text-white">
                1 {tokenIn.symbol} ={' '}
                {formatAmount(amountOutWei * parseUnits('1', tokenIn.decimals) / amountInWei, tokenOut.decimals, 6)}{' '}
                {tokenOut.symbol}
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Price impact</span>
              <span className={isPriceImpactHigh ? 'text-red-400 font-medium' : 'text-green-400'}>
                ~{priceImpact.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Minimum received</span>
              <span className="text-white">
                {formatAmount((amountOutWei * slippageMultiplier(slippage)) / 1000n, tokenOut.decimals, 6)}{' '}
                {tokenOut.symbol}
              </span>
            </div>
          </div>
        )}

        {/* No liquidity / quote error banner */}
        {quoteError && amountInWei > 0n && (
          <div className="rounded-xl bg-orange-900/30 border border-orange-500/30 p-3 mb-4">
            <p className="text-sm text-orange-400 font-medium">⚠ Insufficient liquidity or pool does not exist for this pair.</p>
          </div>
        )}

        {/* High price impact warning */}
        {isPriceImpactHigh && amountInWei > 0n && !quoteError && (
          <div className="rounded-xl bg-red-900/30 border border-red-500/30 p-3 mb-4">
            <p className="text-sm text-red-400 font-medium">⚠ High price impact ({priceImpact.toFixed(2)}%). Consider reducing the swap amount.</p>
          </div>
        )}

        {/* Transaction status */}
        {txStatus !== 'idle' && (
          <div className={`rounded-xl p-3 mb-4 text-sm ${
            txStatus === 'success' ? 'bg-green-900/30 text-green-400' :
            txStatus === 'error' ? 'bg-red-900/30 text-red-400' :
            'bg-purple-900/30 text-purple-400'
          }`}>
            {txStatus === 'approving' && '⏳ Approving token…'}
            {txStatus === 'swapping' && '⏳ Swapping tokens…'}
            {txStatus === 'success' && '✅ Swap confirmed!'}
            {txStatus === 'error' && '❌ Transaction failed.'}
          </div>
        )}

        {/* Action button */}
        {!isConnected ? (
          <button
            onClick={openConnectModal}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Connect Wallet
          </button>
        ) : !tokenIn || !tokenOut ? (
          <button disabled className="w-full rounded-xl bg-gray-700 py-3 font-semibold text-gray-400 cursor-not-allowed">
            Select tokens
          </button>
        ) : amountInWei === 0n ? (
          <button disabled className="w-full rounded-xl bg-gray-700 py-3 font-semibold text-gray-400 cursor-not-allowed">
            Enter an amount
          </button>
        ) : needsApproval ? (
          <button
            onClick={handleApprove}
            disabled={isApproving || isApproveConfirming}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApproving || isApproveConfirming ? 'Approving…' : `Approve ${tokenIn.symbol}`}
          </button>
        ) : quoteError ? (
          <button disabled className="w-full rounded-xl bg-gray-700 py-3 font-semibold text-gray-400 cursor-not-allowed">
            Insufficient liquidity
          </button>
        ) : (
          <button
            onClick={handleSwap}
            disabled={isSwapping || isSwapConfirming || amountOutWei === 0n}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSwapping || isSwapConfirming ? 'Swapping…' : 'Swap'}
          </button>
        )}
      </div>

      {/* DEX label */}
      {contracts && (
        <p className="mt-2 text-center text-xs text-gray-600">
          Powered by {contracts.dexName}
        </p>
      )}
    </div>
  );
}
