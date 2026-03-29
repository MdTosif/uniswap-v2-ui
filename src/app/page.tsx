import Link from "next/link";

const features = [
  {
    href: "/swap",
    title: "Swap",
    description: "Exchange tokens instantly using the constant product formula. Supports ETH, ERC-20 pairs, and all connected networks.",
    icon: "↔",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    href: "/liquidity",
    title: "Liquidity",
    description: "Add or remove liquidity to earn 0.3% fees on every swap. LP tokens represent your share of the pool.",
    icon: "💧",
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    href: "/pools",
    title: "Pools",
    description: "Explore live pool reserves and on-chain pair data for the most popular token pairs on each network.",
    icon: "📊",
    gradient: "from-green-600 to-emerald-600",
  },
];

const networks = [
  { chainId: 1, name: "Ethereum", dex: "Uniswap V2", color: "bg-blue-500" },
  { chainId: 137, name: "Polygon", dex: "QuickSwap V2", color: "bg-purple-500" },
  { chainId: 56, name: "BNB Chain", dex: "PancakeSwap V2", color: "bg-yellow-500" },
  { chainId: 42161, name: "Arbitrum", dex: "SushiSwap V2", color: "bg-blue-400" },
  { chainId: 8453, name: "Base", dex: "BaseSwap", color: "bg-blue-600" },
  { chainId: 11155111, name: "Sepolia", dex: "Uniswap V2", color: "bg-gray-500" },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-3xl font-black text-white mb-6">
          U2
        </div>
        <h1 className="text-5xl font-bold text-white mb-4">
          Uniswap{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            V2
          </span>{" "}
          UI
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          A multi-network decentralized exchange interface. Swap tokens, provide
          liquidity, and explore pools — all in one place.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/swap"
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Start Swapping
          </Link>
          <Link
            href="/pools"
            className="rounded-xl border border-white/20 px-8 py-3 font-semibold text-white hover:bg-white/5 transition-colors"
          >
            Explore Pools
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-6 md:grid-cols-3 mb-16">
        {features.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group rounded-2xl bg-gray-900 border border-white/10 p-6 hover:border-purple-500/40 transition-all"
          >
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-2xl mb-4`}>
              {f.icon}
            </div>
            <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
              {f.title}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
          </Link>
        ))}
      </div>

      {/* Supported networks */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Supported Networks</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {networks.map((n) => (
            <div
              key={n.chainId}
              className="flex items-center gap-3 rounded-xl bg-gray-900 border border-white/10 p-4"
            >
              <div className={`h-3 w-3 rounded-full ${n.color}`} />
              <div>
                <p className="font-medium text-white">{n.name}</p>
                <p className="text-xs text-gray-500">{n.dex}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 rounded-2xl bg-yellow-900/20 border border-yellow-500/20 p-4 text-sm text-yellow-400/80">
        ⚠ <strong>Disclaimer:</strong> This is an open-source UI for educational purposes. Always verify contract addresses and transaction details before signing. Not affiliated with Uniswap Labs.
      </div>
    </div>
  );
}
