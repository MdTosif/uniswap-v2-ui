import { DeployToken } from '@/components/DeployToken';

export const metadata = {
  title: 'Deploy Token — UniswapV2 UI',
  description: 'Deploy your own ERC-20 token and use it in swaps and liquidity pools.',
};

export default function DeployPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Deploy Token</h1>
        <p className="mt-2 text-gray-400">
          Create your own ERC-20 token on the connected network. Deployed tokens are
          automatically available in the Swap and Liquidity interfaces.
        </p>
      </div>
      <DeployToken />
    </main>
  );
}
