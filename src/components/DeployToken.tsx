'use client';

import { useState, useEffect } from 'react';
import { useAccount, useChainId, useDeployContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { SIMPLE_ERC20_DEPLOY_ABI, SIMPLE_ERC20_BYTECODE } from '@/config/contracts';
import { addCustomToken, getCustomTokens, removeCustomToken } from '@/lib/customTokens';
import type { Token } from '@/config/tokens';

// ─── helpers ─────────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="ml-1 rounded px-1.5 py-0.5 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function shortAddr(addr: string) {
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

// ─── Sub-component: previously deployed tokens list ──────────────────────────

function DeployedTokensList({ chainId, refresh }: { chainId: number; refresh: number }) {
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    setTokens(getCustomTokens(chainId));
  }, [chainId, refresh]);

  if (tokens.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">Your Custom Tokens (chain {chainId})</h3>
      <div className="space-y-2">
        {tokens.map((t) => (
          <div key={t.address} className="flex items-center justify-between rounded-xl bg-gray-800 px-4 py-3 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {t.symbol[0]}
              </div>
              <div>
                <p className="font-medium text-white">{t.symbol} <span className="text-gray-400 font-normal text-sm">— {t.name}</span></p>
                <p className="text-xs text-gray-500 font-mono">{shortAddr(t.address as string)}<CopyButton text={t.address as string} /></p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`/swap?token=${t.address}`}
                className="rounded-lg bg-purple-600/20 px-3 py-1.5 text-xs font-medium text-purple-300 hover:bg-purple-600/40 transition-colors"
              >
                Swap
              </a>
              <a
                href={`/liquidity?token=${t.address}`}
                className="rounded-lg bg-blue-600/20 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-600/40 transition-colors"
              >
                Liquidity
              </a>
              <button
                onClick={() => { removeCustomToken(chainId, t.address as string); setTokens(getCustomTokens(chainId)); }}
                className="rounded-lg bg-red-600/10 px-2 py-1.5 text-xs font-medium text-red-400 hover:bg-red-600/20 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function DeployToken() {
  const { address: userAddress, isConnected } = useAccount();
  const chainId = useChainId();

  // Form state
  const [name, setName]             = useState('');
  const [symbol, setSymbol]         = useState('');
  const [decimals, setDecimals]     = useState(18);
  const [supply, setSupply]         = useState('');
  const [formError, setFormError]   = useState('');

  // Track refresh for the deployed-tokens list
  const [listRefresh, setListRefresh] = useState(0);

  // Wagmi deploy hooks
  const { deployContract, data: txHash, isPending, error: deployError, reset } = useDeployContract();
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const contractAddress = receipt?.contractAddress;

  // Auto-add to custom tokens once confirmed
  useEffect(() => {
    if (!isSuccess || !contractAddress || !userAddress) return;
    const newToken: Token = {
      address:  contractAddress,
      symbol:   symbol || 'TKN',
      name:     name   || 'My Token',
      decimals: decimals,
      chainId:  chainId,
    };
    addCustomToken(newToken);
    setListRefresh((n) => n + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, contractAddress]);

  function validate(): boolean {
    if (!name.trim())   { setFormError('Token name is required.');   return false; }
    if (!symbol.trim()) { setFormError('Token symbol is required.'); return false; }
    if (!/^[A-Za-z0-9 ]+$/.test(symbol)) { setFormError('Symbol may only contain letters and numbers.'); return false; }
    if (decimals < 0 || decimals > 18) { setFormError('Decimals must be between 0 and 18.'); return false; }
    const num = Number(supply);
    if (!supply || isNaN(num) || num <= 0) { setFormError('Enter a positive initial supply.'); return false; }
    setFormError('');
    return true;
  }

  function handleDeploy() {
    if (!validate()) return;
    reset();
    const totalSupplyWei = parseUnits(supply, decimals);
    deployContract({
      abi:      SIMPLE_ERC20_DEPLOY_ABI,
      bytecode: SIMPLE_ERC20_BYTECODE,
      args:     [name.trim(), symbol.trim().toUpperCase(), decimals, totalSupplyWei],
    });
  }

  function handleReset() {
    reset();
    setName(''); setSymbol(''); setDecimals(18); setSupply(''); setFormError('');
  }

  // ── not connected ──────────────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-900 border border-white/10 p-12 text-center">
        <div className="text-4xl mb-4">🔌</div>
        <p className="text-lg font-semibold text-white mb-1">Wallet not connected</p>
        <p className="text-sm text-gray-400">Connect your wallet to deploy tokens.</p>
      </div>
    );
  }

  // ── success card ───────────────────────────────────────────────────────────
  if (isSuccess && contractAddress) {
    return (
      <div className="rounded-2xl bg-gray-900 border border-green-500/30 p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xl">✓</div>
          <div>
            <p className="font-bold text-white text-lg">Token deployed!</p>
            <p className="text-sm text-gray-400">{name} ({symbol.toUpperCase()}) — {supply} total supply</p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-800 border border-white/5 p-4 space-y-2">
          <div className="flex items-start justify-between">
            <span className="text-xs text-gray-400">Contract address</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-purple-300 break-all">{contractAddress}</span>
            <CopyButton text={contractAddress} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <a href={`/swap?tokenIn=${contractAddress}`} className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">
            Swap this token
          </a>
          <a href={`/liquidity?token=${contractAddress}`} className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
            Add Liquidity
          </a>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Token automatically added to your token list — it will appear in the Swap &amp; Liquidity token selectors.
        </p>

        <button onClick={handleReset} className="w-full rounded-xl border border-white/10 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors">
          Deploy another token
        </button>
      </div>
    );
  }

  // ── main form ─────────────────────────────────────────────────────────────
  const isBusy = isPending || isConfirming;

  return (
    <div className="rounded-2xl bg-gray-900 border border-white/10 p-6 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Deploy ERC-20 Token</h2>
        <p className="text-sm text-gray-400 mt-1">
          Creates a new ERC-20 contract on chain {chainId} and mints the entire supply to your wallet.
        </p>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Token Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1">Token Name</label>
          <input
            type="text"
            placeholder="e.g. My Awesome Token"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isBusy}
            className="w-full rounded-xl bg-gray-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>

        {/* Symbol */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Symbol</label>
          <input
            type="text"
            placeholder="e.g. MAT"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            maxLength={10}
            disabled={isBusy}
            className="w-full rounded-xl bg-gray-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>

        {/* Decimals */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Decimals</label>
          <input
            type="number"
            min={0}
            max={18}
            value={decimals}
            onChange={(e) => setDecimals(Math.min(18, Math.max(0, Number(e.target.value))))}
            disabled={isBusy}
            className="w-full rounded-xl bg-gray-800 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
        </div>

        {/* Initial Supply */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-400 mb-1">Initial Supply</label>
          <input
            type="number"
            min={1}
            placeholder={`e.g. 1000000 — minted to ${userAddress ? shortAddr(userAddress) : 'your wallet'}`}
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
            disabled={isBusy}
            className="w-full rounded-xl bg-gray-800 border border-white/10 px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
          {supply && !isNaN(Number(supply)) && decimals >= 0 && (
            <p className="mt-1 text-xs text-gray-500">
              On-chain: {(Number(supply) * 10 ** decimals).toLocaleString('en-US')} base units ({decimals} decimals)
            </p>
          )}
        </div>
      </div>

      {/* Validation / wagmi error */}
      {(formError || deployError) && (
        <div className="rounded-xl bg-red-900/30 border border-red-500/30 px-4 py-3 text-sm text-red-300">
          {formError || (deployError as Error)?.message?.split('\n')[0] || 'Deployment failed.'}
        </div>
      )}

      {/* Confirming state */}
      {isConfirming && (
        <div className="flex items-center gap-3 rounded-xl bg-yellow-900/20 border border-yellow-500/20 px-4 py-3 text-sm text-yellow-300">
          <svg className="animate-spin h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
          Waiting for confirmation…
          {txHash && (
            <span className="font-mono text-xs text-gray-400 ml-auto">{shortAddr(txHash)}<CopyButton text={txHash} /></span>
          )}
        </div>
      )}

      {/* Deploy button */}
      <button
        onClick={handleDeploy}
        disabled={isBusy}
        className="w-full rounded-xl bg-purple-600 py-3.5 text-sm font-bold text-white hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? 'Confirm in wallet…' : isConfirming ? 'Deploying…' : 'Deploy Token'}
      </button>

      {/* Previously deployed tokens */}
      <DeployedTokensList chainId={chainId} refresh={listRefresh} />
    </div>
  );
}
