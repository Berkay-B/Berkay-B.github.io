layout suan bu sekilde once benim kodumu gor ona gore ayarlayalim yani simdi layout a ne yaziyim

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="flex gap-4 p-4 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/" className="hover:text-blue-500 transition-colors">
            Docs
          </Link>
          <Link href="/dashboard" className="hover:text-blue-500 transition-colors">
            Dashboard
          </Link>
          <Link href="/games" className="hover:text-blue-500 transition-colors">
            Games
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
