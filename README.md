import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>
        <nav className="bg-gray-900 text-white p-4 flex gap-6">
          <Link href="/" className="hover:text-orange-400">
            Home
          </Link>
          <Link href="/games" className="hover:text-orange-400">
            Games
          </Link>
          <Link href="/dashboard" className="hover:text-orange-400">
            Dashboard
          </Link>
        </nav>

        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}