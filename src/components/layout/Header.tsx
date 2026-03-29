'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const NAV_ITEMS = [
  { href: '/swap',     label: 'Swap' },
  { href: '/liquidity', label: 'Liquidity' },
  { href: '/pools',    label: 'Pools' },
  { href: '/deploy',   label: 'Deploy' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-black">
            U2
          </div>
          <span className="hidden sm:inline text-lg">UniswapV2 UI</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Wallet connect */}
        <ConnectButton
          showBalance={true}
          chainStatus="icon"
          accountStatus="avatar"
        />
      </div>
    </header>
  );
}
