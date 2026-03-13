import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Providers } from "@/components/providers"
import { ErrorBoundary } from "@/components/error-boundary"
import "./globals.css"

export const metadata: Metadata = {
  title: "ONEbox - OneChain Dev Portal",
  description: "A calming, beginner-friendly portal for OneChain development with AI assistant",
  generator: "v0.app",
  keywords: ["OneChain", "blockchain", "development", "testnet", "PTB", "wallet", "AI", "ChatGPT"],
  authors: [{ name: "ONEbox Team" }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 font-sans">
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
