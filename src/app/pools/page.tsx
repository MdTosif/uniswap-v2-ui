'use client';

import { useChainId } from 'wagmi';
import { CONTRACTS } from '@/config/contracts';
import { POPULAR_POOLS } from '@/config/tokens';
import { PoolCard } from '@/components/PoolCard';

export default function PoolsPage() {
  const chainId = useChainId();
  const contracts = CONTRACTS[chainId];
  const pools = POPULAR_POOLS[chainId] ?? [];

  if (!contracts) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl bg-yellow-900/30 border border-yellow-500/30 p-8 text-center">
          <p className="text-yellow-400 font-medium text-lg">Network not supported</p>
          <p className="text-yellow-500/70 mt-1 text-sm">Please switch to a supported network to view pools.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Pools</h1>
        <p className="text-gray-400">
          Live pool data from {contracts.dexName} on-chain contracts
        </p>
      </div>

      {pools.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          No popular pools configured for this network.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pools.map((pool) => (
            <PoolCard
              key={`${pool.token0}-${pool.token1}`}
              token0={pool.token0}
              token1={pool.token1}
              label={pool.label}
              contracts={contracts}
              chainId={chainId}
            />
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-gray-900 border border-white/10 p-6">
        <h2 className="font-semibold text-white mb-3">Contract Addresses</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Factory</span>
            <span className="font-mono text-gray-300 text-xs">{contracts.factory}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Router</span>
            <span className="font-mono text-gray-300 text-xs">{contracts.router}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">WETH / Wrapped native</span>
            <span className="font-mono text-gray-300 text-xs">{contracts.weth}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
