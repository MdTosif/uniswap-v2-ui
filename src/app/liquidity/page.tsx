import { LiquidityManager } from "@/components/LiquidityManager";

export const metadata = { title: "Liquidity | Uniswap V2 UI" };

export default function LiquidityPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Liquidity</h1>
        <p className="text-gray-400">Add or remove liquidity to earn 0.3% trading fees</p>
      </div>
      <LiquidityManager />
    </div>
  );
}
