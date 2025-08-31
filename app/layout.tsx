import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Smart Recipe Generator",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="min-h-dvh bg-gradient-to-b from-emerald-50 to-white">
            <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
              <nav className="container mx-auto max-w-6xl flex items-center justify-between py-3">
                <Link href="/" className="font-semibold text-pretty text-lg">
                  <span className="mr-1">🍳</span>
                  <span className="text-emerald-700">Smart Recipe Generator</span>
                </Link>
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" className="hidden sm:inline-flex">
                    <Link href="/favorites">My Favorites</Link>
                  </Button>
                </div>
              </nav>
            </header>
            {children}
          </div>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
