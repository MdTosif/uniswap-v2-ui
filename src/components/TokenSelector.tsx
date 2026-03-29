'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useBalance } from 'wagmi';
import { formatUnits, isAddress } from 'viem';
import { Token, TOKENS } from '@/config/tokens';
import { ERC20_ABI } from '@/config/contracts';
import { getCustomTokens, addCustomToken } from '@/lib/customTokens';

interface TokenSelectorProps {
  chainId: number;
  selected: Token | null;
  onSelect: (token: Token) => void;
  /** Token to exclude (the other side of the pair) */
  exclude?: Token | null;
  label: string;
}

function TokenBalance({ token, address }: { token: Token; address: `0x${string}` }) {
  const { data: nativeBal } = useBalance({ address, query: { enabled: !!token.isNative } });
  const { data: erc20Bal } = useReadContract({
    address: token.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
    query: { enabled: !token.isNative },
  });

  const raw = token.isNative ? nativeBal?.value : (erc20Bal as bigint | undefined);
  if (raw === undefined) return null;
  const display = parseFloat(formatUnits(raw, token.decimals)).toLocaleString('en-US', {
    maximumFractionDigits: 4,
  });
  return <span className="text-xs text-gray-500">{display}</span>;
}

export function TokenSelector({ chainId, selected, onSelect, exclude, label }: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { address } = useAccount();
  const [customTokens, setCustomTokens] = useState<Token[]>([]);

  // Load custom tokens from localStorage whenever the modal opens
  useEffect(() => {
    if (open) setCustomTokens(getCustomTokens(chainId));
  }, [open, chainId]);

  // Merge built-in + custom, deduplicating by address
  const builtIn = TOKENS[chainId] ?? [];
  const allTokens: (Token & { isCustom?: boolean })[] = [
    ...builtIn,
    ...customTokens
      .filter((c) => !builtIn.some((b) => b.address.toLowerCase() === c.address.toLowerCase()))
      .map((t) => ({ ...t, isCustom: true })),
  ].filter((t) => !exclude || t.address.toLowerCase() !== exclude.address.toLowerCase());

  // ── import-by-address logic ────────────────────────────────────────────────
  const searchIsAddress = isAddress(search);

  const { data: importName }     = useReadContract({ address: search as `0x${string}`, abi: ERC20_ABI, functionName: 'name',     chainId, query: { enabled: searchIsAddress } });
  const { data: importSymbol }   = useReadContract({ address: search as `0x${string}`, abi: ERC20_ABI, functionName: 'symbol',   chainId, query: { enabled: searchIsAddress } });
  const { data: importDecimals } = useReadContract({ address: search as `0x${string}`, abi: ERC20_ABI, functionName: 'decimals', chainId, query: { enabled: searchIsAddress } });

  const canImport =
    searchIsAddress &&
    importName && importSymbol && importDecimals !== undefined &&
    !allTokens.some((t) => t.address.toLowerCase() === search.toLowerCase());

  function handleImport() {
    if (!canImport) return;
    const token: Token = {
      address:  search as `0x${string}`,
      symbol:   importSymbol as string,
      name:     importName   as string,
      decimals: importDecimals as number,
      chainId,
    };
    addCustomToken(token);
    setCustomTokens(getCustomTokens(chainId));
    onSelect(token);
    setOpen(false);
    setSearch('');
  }

  const filtered = allTokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.address.toLowerCase().includes(search.toLowerCase()),
  );

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-gray-800 px-3 py-2 hover:bg-gray-700 transition-colors"
      >
        {selected ? (
          <>
            {selected.logoURI && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selected.logoURI} alt={selected.symbol} className="h-6 w-6 rounded-full" onError={(e) => (e.currentTarget.style.display = 'none')} />
            )}
            <span className="font-semibold text-white">{selected.symbol}</span>
          </>
        ) : (
          <span className="font-semibold text-purple-400">Select token</span>
        )}
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-gray-900 border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-semibold text-white">Select {label}</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <input
                type="text"
                placeholder="Search name or address"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full rounded-xl bg-gray-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="max-h-72 overflow-y-auto pb-2">
              {/* Import by address card */}
              {searchIsAddress && (
                <div className="mx-4 my-2 rounded-xl bg-gray-800 border border-white/10 px-4 py-3">
                  {canImport ? (
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-white">{importSymbol as string}</p>
                        <p className="text-xs text-gray-400">{importName as string}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{search.slice(0,10)}…</p>
                      </div>
                      <button
                        onClick={handleImport}
                        className="flex-shrink-0 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-500 transition-colors"
                      >
                        Import
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 text-center py-1">
                      {allTokens.some((t) => t.address.toLowerCase() === search.toLowerCase())
                        ? 'Token already in list'
                        : 'Loading token info…'}
                    </p>
                  )}
                </div>
              )}

              {filtered.length === 0 && !searchIsAddress && (
                <p className="py-8 text-center text-sm text-gray-500">No tokens found</p>
              )}
              {filtered.map((token) => (
                <button
                  key={token.address}
                  onClick={() => { onSelect(token); setOpen(false); setSearch(''); }}
                  className={`flex w-full items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${
                    selected?.address === token.address ? 'bg-purple-900/30' : ''
                  }`}
                >
                  {token.logoURI ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={token.logoURI} alt={token.symbol} className="h-8 w-8 rounded-full flex-shrink-0" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {token.symbol[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-medium text-white flex items-center gap-1.5">
                      {token.symbol}
                      {(token as Token & { isCustom?: boolean }).isCustom && (
                        <span className="rounded px-1 py-0.5 text-[10px] font-semibold bg-purple-600/30 text-purple-300">custom</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{token.name}</p>
                  </div>
                  {address && <TokenBalance token={token} address={address} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
