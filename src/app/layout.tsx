import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uniswap V2 UI",
  description: "A multi-network Uniswap V2 interface — swap tokens and manage liquidity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen bg-gray-950 text-white flex flex-col" suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/5 py-4 text-center text-xs text-gray-600">
            Uniswap V2 UI — Use at your own risk. Not affiliated with Uniswap Labs.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
