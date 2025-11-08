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
  title: "OneFlow Portal",
  description: "Unified access portal with projects, tasks, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="oneflow">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-base-200 text-base-content`}>        
        <header className="border-b border-base-300 bg-base-100/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <div className="container py-3 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold tracking-tight text-primary flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              OneFlow Portal
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
              <Link href="/tasks" className="hover:text-primary transition-colors">Tasks</Link>
              <Link href="/analytics" className="hover:text-primary transition-colors">Analytics</Link>
              <Link href="/profile" className="hover:text-primary transition-colors">Profile</Link>
              <Link href="/signin" className="btn btn-primary btn-sm">Sign In</Link>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
      </body>
    </html>
  );
}
