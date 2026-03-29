'use client';

import { useState, useMemo } from 'react';
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseUnits, formatUnits, maxUint256 } from 'viem';
import {
  CONTRACTS,
  UNISWAP_V2_ROUTER_ABI,
  UNISWAP_V2_FACTORY_ABI,
  UNISWAP_V2_PAIR_ABI,
  ERC20_ABI,
} from '@/config/contracts';
import { TOKENS, Token } from '@/config/tokens';
import { formatAmount, slippageMultiplier, txDeadline, MAX_UINT256 } from '@/lib/utils';
import { TokenSelector } from './TokenSelector';
import { useConnectModal } from '@rainbow-me/rainbowkit';

type Tab = 'add' | 'remove';

export function LiquidityManager() {
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const contracts = CONTRACTS[chainId];
  const tokens = TOKENS[chainId] ?? [];

  const [tab, setTab] = useState<Tab>('add');

  // ── Add Liquidity State ────────────────────────────────────────────────────
  const [tokenA, setTokenA] = useState<Token | null>(tokens[0] ?? null);
  const [tokenB, setTokenB] = useState<Token | null>(tokens[1] ?? null);
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [slippage, setSlippage] = useState(0.5);

  // ── Remove Liquidity State ─────────────────────────────────────────────────
  const [lpAmount, setLpAmount] = useState('');

  const amountAWei = useMemo(() => {
    if (!amountA || !tokenA) return 0n;
    try { return parseUnits(amountA, tokenA.decimals); } catch { return 0n; }
  }, [amountA, tokenA]);

  const amountBWei = useMemo(() => {
    if (!amountB || !tokenB) return 0n;
    try { return parseUnits(amountB, tokenB.decimals); } catch { return 0n; }
  }, [amountB, tokenB]);

  // ── Pair address ───────────────────────────────────────────────────────────
  const tokenAAddress = tokenA ? (tokenA.isNative ? contracts?.weth : tokenA.address as `0x${string}`) : undefined;
  const tokenBAddress = tokenB ? (tokenB.isNative ? contracts?.weth : tokenB.address as `0x${string}`) : undefined;

  const { data: pairAddress } = useReadContract({
    address: contracts?.factory,
    abi: UNISWAP_V2_FACTORY_ABI,
    functionName: 'getPair',
    args: tokenAAddress && tokenBAddress ? [tokenAAddress, tokenBAddress] : undefined,
    query: { enabled: !!contracts && !!tokenAAddress && !!tokenBAddress },
  });

  const pairExists = pairAddress && pairAddress !== '0x0000000000000000000000000000000000000000';

  // ── LP token balance ───────────────────────────────────────────────────────
  const { data: lpBalance, refetch: refetchLpBalance } = useReadContract({
    address: pairAddress as `0x${string}`,
    abi: UNISWAP_V2_PAIR_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!pairExists && !!address },
  });

  const lpBalanceDisplay = lpBalance !== undefined
    ? parseFloat(formatUnits(lpBalance as bigint, 18)).toFixed(8)
    : '—';

  // ── Pool reserves ──────────────────────────────────────────────────────────
  const { data: reserves } = useReadContract({
    address: pairAddress as `0x${string}`,
    abi: UNISWAP_V2_PAIR_ABI,
    functionName: 'getReserves',
    query: { enabled: !!pairExists },
  });

  const { data: token0Address } = useReadContract({
    address: pairAddress as `0x${string}`,
    abi: UNISWAP_V2_PAIR_ABI,
    functionName: 'token0',
    query: { enabled: !!pairExists },
  });

  // Determine if tokenA matches token0 or token1 in the pair
  const isTokenAFirst = token0Address?.toLowerCase() === tokenAAddress?.toLowerCase();
  const [reserve0, reserve1] = reserves ? [
    (reserves as [bigint, bigint, number])[0],
    (reserves as [bigint, bigint, number])[1],
  ] : [0n, 0n];
  const reserveA = isTokenAFirst ? reserve0 : reserve1;
  const reserveB = isTokenAFirst ? reserve1 : reserve0;

  // Auto-fill the other token amount based on pool ratio
  const handleAmountAChange = (val: string) => {
    setAmountA(val);
    if (pairExists && reserveA > 0n && reserveB > 0n && val && tokenA && tokenB) {
      try {
        const aWei = parseUnits(val, tokenA.decimals);
        const bWei = (aWei * reserveB) / reserveA;
        setAmountB(formatUnits(bWei, tokenB.decimals));
      } catch { /* ignore */ }
    }
  };

  const handleAmountBChange = (val: string) => {
    setAmountB(val);
    if (pairExists && reserveA > 0n && reserveB > 0n && val && tokenA && tokenB) {
      try {
        const bWei = parseUnits(val, tokenB.decimals);
        const aWei = (bWei * reserveA) / reserveB;
        setAmountA(formatUnits(aWei, tokenA.decimals));
      } catch { /* ignore */ }
    }
  };

  // ── Allowances ─────────────────────────────────────────────────────────────
  const { data: allowanceA, refetch: refetchAllowanceA } = useReadContract({
    address: tokenA?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && contracts ? [address, contracts.router] : undefined,
    query: { enabled: !!address && !!contracts && !!tokenA && !tokenA.isNative },
  });

  const { data: allowanceB, refetch: refetchAllowanceB } = useReadContract({
    address: tokenB?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && contracts ? [address, contracts.router] : undefined,
    query: { enabled: !!address && !!contracts && !!tokenB && !tokenB.isNative },
  });

  const needsApproveA = !tokenA?.isNative && (allowanceA as bigint | undefined) !== undefined
    && (allowanceA as bigint) < amountAWei;
  const needsApproveB = !tokenB?.isNative && (allowanceB as bigint | undefined) !== undefined
    && (allowanceB as bigint) < amountBWei;

  // ── LP allowance (for remove) ──────────────────────────────────────────────
  const lpAmountWei = useMemo(() => {
    if (!lpAmount) return 0n;
    try { return parseUnits(lpAmount, 18); } catch { return 0n; }
  }, [lpAmount]);

  const { data: lpAllowance, refetch: refetchLpAllowance } = useReadContract({
    address: pairAddress as `0x${string}`,
    abi: UNISWAP_V2_PAIR_ABI,
    functionName: 'allowance',
    args: address && contracts ? [address, contracts.router] : undefined,
    query: { enabled: !!pairExists && !!address && !!contracts },
  });

  const needsApproveLp = (lpAllowance as bigint | undefined) !== undefined
    ? (lpAllowance as bigint) < lpAmountWei
    : false;

  // ── Write contracts ────────────────────────────────────────────────────────
  const { writeContract: writeApproveA, data: approveTxA, isPending: isApprovingA } = useWriteContract();
  const { writeContract: writeApproveB, data: approveTxB, isPending: isApprovingB } = useWriteContract();
  const { writeContract: writeApproveLp, data: approveLpTx, isPending: isApprovingLp } = useWriteContract();
  const { writeContract: writeAdd, data: addTxHash, isPending: isAdding } = useWriteContract();
  const { writeContract: writeRemove, data: removeTxHash, isPending: isRemoving } = useWriteContract();

  const { isLoading: isAddConfirming, isSuccess: isAddConfirmed } = useWaitForTransactionReceipt({ hash: addTxHash });
  const { isLoading: isRemoveConfirming, isSuccess: isRemoveConfirmed } = useWaitForTransactionReceipt({ hash: removeTxHash });
  const { isSuccess: isApproveLpConfirmed } = useWaitForTransactionReceipt({ hash: approveLpTx });

  // ── Add Liquidity ──────────────────────────────────────────────────────────
  const handleApproveA = () => {
    if (!tokenA || !contracts) return;
    writeApproveA({ address: tokenA.address as `0x${string}`, abi: ERC20_ABI, functionName: 'approve', args: [contracts.router, maxUint256] },
      { onSuccess: () => void refetchAllowanceA() },
    );
  };

  const handleApproveB = () => {
    if (!tokenB || !contracts) return;
    writeApproveB({ address: tokenB.address as `0x${string}`, abi: ERC20_ABI, functionName: 'approve', args: [contracts.router, maxUint256] },
      { onSuccess: () => void refetchAllowanceB() },
    );
  };

  const handleAddLiquidity = () => {
    if (!tokenA || !tokenB || !contracts || !address || amountAWei === 0n || amountBWei === 0n) return;
    const deadline = txDeadline();
    const m = slippageMultiplier(slippage);
    const minA = (amountAWei * m) / 1000n;
    const minB = (amountBWei * m) / 1000n;

    if (tokenA.isNative) {
      writeAdd({
        address: contracts.router,
        abi: UNISWAP_V2_ROUTER_ABI,
        functionName: 'addLiquidityETH',
        args: [tokenBAddress!, amountBWei, minB, minA, address, deadline],
        value: amountAWei,
      });
    } else if (tokenB.isNative) {
      writeAdd({
        address: contracts.router,
        abi: UNISWAP_V2_ROUTER_ABI,
        functionName: 'addLiquidityETH',
        args: [tokenAAddress!, amountAWei, minA, minB, address, deadline],
        value: amountBWei,
      });
    } else {
      writeAdd({
        address: contracts.router,
        abi: UNISWAP_V2_ROUTER_ABI,
        functionName: 'addLiquidity',
        args: [tokenAAddress!, tokenBAddress!, amountAWei, amountBWei, minA, minB, address, deadline],
      });
    }
  };

  // ── Remove Liquidity ───────────────────────────────────────────────────────
  const handleApproveLp = () => {
    if (!pairAddress || !contracts) return;
    writeApproveLp({ address: pairAddress as `0x${string}`, abi: UNISWAP_V2_PAIR_ABI, functionName: 'approve', args: [contracts.router, MAX_UINT256] },
      { onSuccess: () => void refetchLpAllowance() },
    );
  };

  const handleRemoveLiquidity = () => {
    if (!tokenA || !tokenB || !contracts || !address || lpAmountWei === 0n || !pairExists) return;
    const deadline = txDeadline();
    const minA = 1n; // accept any amount (user can set in production)
    const minB = 1n;

    if (tokenA.isNative || tokenB.isNative) {
      const nonNativeToken = tokenA.isNative ? tokenB : tokenA;
      const nonNativeAddress = nonNativeToken.isNative ? contracts.weth : nonNativeToken.address as `0x${string}`;
      writeRemove({
        address: contracts.router,
        abi: UNISWAP_V2_ROUTER_ABI,
        functionName: 'removeLiquidityETH',
        args: [nonNativeAddress, lpAmountWei, minA, minB, address, deadline],
      });
    } else {
      writeRemove({
        address: contracts.router,
        abi: UNISWAP_V2_ROUTER_ABI,
        functionName: 'removeLiquidity',
        args: [tokenAAddress!, tokenBAddress!, lpAmountWei, minA, minB, address, deadline],
      });
    }
  };

  if (!contracts) {
    return (
      <div className="rounded-2xl bg-yellow-900/30 border border-yellow-500/30 p-6 text-center">
        <p className="text-yellow-400 font-medium">Liquidity functions not available on this network.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="rounded-2xl bg-gray-900 border border-white/10 shadow-xl p-4">
        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-800 rounded-xl p-1">
          {(['add', 'remove'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium capitalize transition-colors ${
                tab === t ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t} Liquidity
            </button>
          ))}
        </div>

        {tab === 'add' ? (
          <>
            {/* Slippage */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Slippage: {slippage}%</span>
              <div className="flex gap-1">
                {[0.5, 1.0, 2.0].map((s) => (
                  <button key={s} onClick={() => setSlippage(s)} className={`rounded px-2 py-0.5 text-xs ${slippage === s ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}>{s}%</button>
                ))}
              </div>
            </div>

            {/* Token A */}
            <div className="rounded-xl bg-gray-800 p-4 mb-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Token A</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="0.0"
                  value={amountA}
                  onChange={(e) => handleAmountAChange(e.target.value)}
                  className="flex-1 bg-transparent text-2xl font-medium text-white placeholder-gray-600 focus:outline-none"
                />
                <TokenSelector chainId={chainId} selected={tokenA} onSelect={(t) => { setTokenA(t); setAmountA(''); setAmountB(''); }} exclude={tokenB} label="Token A" />
              </div>
            </div>

            <div className="flex justify-center py-1 text-gray-600">+</div>

            {/* Token B */}
            <div className="rounded-xl bg-gray-800 p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Token B</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="0.0"
                  value={amountB}
                  onChange={(e) => handleAmountBChange(e.target.value)}
                  className="flex-1 bg-transparent text-2xl font-medium text-white placeholder-gray-600 focus:outline-none"
                />
                <TokenSelector chainId={chainId} selected={tokenB} onSelect={(t) => { setTokenB(t); setAmountA(''); setAmountB(''); }} exclude={tokenA} label="Token B" />
              </div>
            </div>

            {/* Pool info */}
            {pairExists && reserveA > 0n && tokenA && tokenB && (
              <div className="rounded-xl bg-gray-800 p-3 mb-4 text-sm space-y-1">
                <p className="font-medium text-gray-300 mb-1">Pool reserves</p>
                <div className="flex justify-between text-gray-400">
                  <span>{tokenA.symbol}</span>
                  <span className="text-white">{formatAmount(reserveA, tokenA.decimals, 4)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>{tokenB.symbol}</span>
                  <span className="text-white">{formatAmount(reserveB, tokenB?.decimals ?? 18, 4)}</span>
                </div>
              </div>
            )}

            {!pairExists && tokenA && tokenB && (
              <div className="rounded-xl bg-blue-900/30 border border-blue-500/30 p-3 mb-4 text-sm text-blue-300">
                ℹ This pair does not exist yet. You will create a new pool and set the initial price.
              </div>
            )}

            {/* Status */}
            {(isAddConfirmed) && (
              <div className="rounded-xl bg-green-900/30 p-3 mb-4 text-sm text-green-400">✅ Liquidity added!</div>
            )}

            {/* Action buttons */}
            {!isConnected ? (
              <button onClick={openConnectModal} className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white hover:opacity-90 transition-opacity">Connect Wallet</button>
            ) : needsApproveA ? (
              <button onClick={handleApproveA} disabled={isApprovingA} className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50">
                {isApprovingA ? 'Approving…' : `Approve ${tokenA?.symbol}`}
              </button>
            ) : needsApproveB ? (
              <button onClick={handleApproveB} disabled={isApprovingB} className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50">
                {isApprovingB ? 'Approving…' : `Approve ${tokenB?.symbol}`}
              </button>
            ) : (
              <button
                onClick={handleAddLiquidity}
                disabled={!tokenA || !tokenB || amountAWei === 0n || amountBWei === 0n || isAdding || isAddConfirming}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding || isAddConfirming ? 'Adding liquidity…' : 'Add Liquidity'}
              </button>
            )}
          </>
        ) : (
          <>
            {/* Remove tab */}
            <div className="mb-4 space-y-3">
              {/* Select tokens to find pair */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Token A</p>
                  <TokenSelector chainId={chainId} selected={tokenA} onSelect={setTokenA} exclude={tokenB} label="Token A" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Token B</p>
                  <TokenSelector chainId={chainId} selected={tokenB} onSelect={setTokenB} exclude={tokenA} label="Token B" />
                </div>
              </div>

              {pairExists ? (
                <>
                  <div className="rounded-xl bg-gray-800 p-3 text-sm">
                    <div className="flex justify-between text-gray-400 mb-1">
                      <span>Your LP balance</span>
                      <span className="text-white">{lpBalanceDisplay} LP</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Pair address</span>
                      <span className="text-white font-mono text-xs">{pairAddress?.slice(0, 6)}…{pairAddress?.slice(-4)}</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-800 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">LP tokens to remove</span>
                      {lpBalance !== undefined && (
                        <button
                          onClick={() => setLpAmount(formatUnits(lpBalance as bigint, 18))}
                          className="text-xs text-purple-400 hover:text-purple-300"
                        >
                          MAX
                        </button>
                      )}
                    </div>
                    <input
                      type="number"
                      placeholder="0.0"
                      value={lpAmount}
                      onChange={(e) => setLpAmount(e.target.value)}
                      className="w-full bg-transparent text-2xl font-medium text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>

                  {/* Quick % shortcuts */}
                  <div className="flex gap-2">
                    {[25, 50, 75, 100].map((pct) => (
                      <button
                        key={pct}
                        onClick={() => {
                          if (lpBalance) {
                            const amt = (lpBalance as bigint) * BigInt(pct) / 100n;
                            setLpAmount(formatUnits(amt, 18));
                          }
                        }}
                        className="flex-1 rounded-lg bg-gray-700 py-1.5 text-xs font-medium text-gray-300 hover:bg-gray-600"
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>

                  {isRemoveConfirmed && (
                    <div className="rounded-xl bg-green-900/30 p-3 text-sm text-green-400">✅ Liquidity removed!</div>
                  )}

                  {!isConnected ? (
                    <button onClick={openConnectModal} className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white hover:opacity-90 transition-opacity">Connect Wallet</button>
                  ) : (needsApproveLp || (!isApproveLpConfirmed && (lpAllowance as bigint | undefined) !== undefined && (lpAllowance as bigint) < lpAmountWei)) ? (
                    <button onClick={handleApproveLp} disabled={isApprovingLp} className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50">
                      {isApprovingLp ? 'Approving LP…' : 'Approve LP Token'}
                    </button>
                  ) : (
                    <button
                      onClick={handleRemoveLiquidity}
                      disabled={lpAmountWei === 0n || isRemoving || isRemoveConfirming}
                      className="w-full rounded-xl bg-gradient-to-r from-red-600 to-orange-600 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRemoving || isRemoveConfirming ? 'Removing…' : 'Remove Liquidity'}
                    </button>
                  )}
                </>
              ) : (
                tokenA && tokenB && (
                  <div className="rounded-xl bg-gray-800 p-4 text-center text-sm text-gray-400">
                    No pool found for {tokenA.symbol}/{tokenB.symbol}.
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
