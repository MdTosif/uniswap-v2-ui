import { SwapInterface } from "@/components/SwapInterface";

export const metadata = { title: "Swap | Uniswap V2 UI" };

export default function SwapPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Swap Tokens</h1>
        <p className="text-gray-400">Trade tokens instantly at the best on-chain price</p>
      </div>
      <SwapInterface />
    </div>
  );
}
