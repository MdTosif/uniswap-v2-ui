'use client';

import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { UNISWAP_V2_FACTORY_ABI, UNISWAP_V2_PAIR_ABI } from '@/config/contracts';
import { NetworkContracts } from '@/config/contracts';
import { formatAmount } from '@/lib/utils';

interface PoolCardProps {
  token0: string;
  token1: string;
  label: string;
  contracts: NetworkContracts;
  chainId: number;
}

export function PoolCard({ token0, token1, label, contracts }: PoolCardProps) {
  const { data: pairAddress } = useReadContract({
    address: contracts.factory,
    abi: UNISWAP_V2_FACTORY_ABI,
    functionName: 'getPair',
    args: [token0 as `0x${string}`, token1 as `0x${string}`],
    query: { retry: false },
  });

  const pairExists = pairAddress && pairAddress !== '0x0000000000000000000000000000000000000000';

  const { data: reserves } = useReadContract({
    address: pairAddress as `0x${string}`,
    abi: UNISWAP_V2_PAIR_ABI,
    functionName: 'getReserves',
    query: { enabled: !!pairExists, retry: false },
  });

  const { data: totalSupply } = useReadContract({
    address: pairAddress as `0x${string}`,
    abi: UNISWAP_V2_PAIR_ABI,
    functionName: 'totalSupply',
    query: { enabled: !!pairExists, retry: false },
  });

  const [reserve0, reserve1] = reserves
    ? [(reserves as [bigint, bigint, number])[0], (reserves as [bigint, bigint, number])[1]]
    : [undefined, undefined];

  const [sym0, sym1] = label.split(' / ');

  return (
    <div className="rounded-2xl bg-gray-900 border border-white/10 p-5 hover:border-purple-500/30 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white border-2 border-gray-900">
              {sym0?.[0]}
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white border-2 border-gray-900">
              {sym1?.[0]}
            </div>
          </div>
          <span className="font-semibold text-white">{label}</span>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${pairExists ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
          {pairExists ? 'Active' : 'No pool'}
        </span>
      </div>

      {pairExists ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-gray-800 p-3">
              <p className="text-xs text-gray-500 mb-1">{sym0} Reserve</p>
              <p className="font-medium text-white text-sm">
                {reserve0 !== undefined ? formatAmount(reserve0, 18, 4) : '—'}
              </p>
            </div>
            <div className="rounded-xl bg-gray-800 p-3">
              <p className="text-xs text-gray-500 mb-1">{sym1} Reserve</p>
              <p className="font-medium text-white text-sm">
                {reserve1 !== undefined ? formatAmount(reserve1, 18, 4) : '—'}
              </p>
            </div>
          </div>

          {totalSupply !== undefined && (
            <div className="rounded-xl bg-gray-800 p-3">
              <p className="text-xs text-gray-500 mb-1">LP Token Supply</p>
              <p className="font-medium text-white text-sm font-mono">
                {parseFloat(formatUnits(totalSupply as bigint, 18)).toFixed(6)}
              </p>
            </div>
          )}

          {pairAddress && (
            <div className="rounded-xl bg-gray-800 p-3">
              <p className="text-xs text-gray-500 mb-1">Pair address</p>
              <p className="font-mono text-xs text-gray-300 break-all">{pairAddress}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4 text-sm text-gray-500">
          Pool not deployed yet
        </div>
      )}
    </div>
  );
}
