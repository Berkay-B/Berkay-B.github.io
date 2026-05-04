import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Game Marketplace",
  description: "Game Marketplace dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="flex gap-6 p-4 border-b border-zinc-200 bg-zinc-900 text-white">
          <Link href="/" className="hover:text-orange-400 transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-orange-400 transition-colors">
            Dashboard
          </Link>
          <Link href="/games" className="hover:text-orange-400 transition-colors">
            Games
          </Link>
        </nav>

        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}