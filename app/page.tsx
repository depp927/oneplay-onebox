"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Wallet, Zap, Code, History, Coins, TestTube, Bot, MessageCircle, Play, BookOpen, Github, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">ONEbox</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">OneChain Development Portal</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Testnet Ready
              </Badge>
              <Link href="/dashboard">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
              Build on{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                OneChain
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Complete development toolkit for OneChain blockchain. Test transactions, manage wallets, 
              explore the ecosystem, and build the future of decentralized applications.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Play className="mr-2 h-4 w-4" />
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
              <Wallet className="h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Wallet Integration</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Connect and manage OneChain wallets with seamless integration
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
              <Bot className="h-10 w-10 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                ChatGPT-powered assistant for OneChain development questions
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
              <TestTube className="h-10 w-10 text-emerald-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">PTB Simulator</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Test programmable transaction blocks before deployment
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
              <Coins className="h-10 w-10 text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Testnet Faucet</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Get test tokens instantly for development and testing
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
              <History className="h-10 w-10 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Comprehensive transaction tracking and analysis
              </p>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
              <Code className="h-10 w-10 text-indigo-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Developer Tools</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Advanced debugging and development utilities
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Quick Access
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Jump directly to the tools you need for OneChain development
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dashboard">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
                <div className="text-center">
                  <Zap className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Dashboard</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Access all development tools</p>
                </div>
              </Card>
            </Link>
            
            <Link href="/chat">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">AI Assistant</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Get instant development help</p>
                </div>
              </Card>
            </Link>
            
            <Link href="/docs">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Documentation</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Browse guides and references</p>
                </div>
              </Card>
            </Link>
            
            <a 
              href="https://doc-testnet.onelabs.cc" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
                <div className="text-center">
                  <ExternalLink className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Official Docs</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">OneChain documentation</p>
                </div>
              </Card>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
              OneChain Development Made Easy
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-blue-600">10+</div>
                <div className="text-slate-600 dark:text-slate-300">PTB Presets</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">∞</div>
                <div className="text-slate-600 dark:text-slate-300">Test Tokens</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600">24/7</div>
                <div className="text-slate-600 dark:text-slate-300">Network Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 dark:bg-slate-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers building the future of decentralized applications on OneChain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Play className="mr-2 h-4 w-4" />
                Launch Dashboard
              </Button>
            </Link>
            <a 
              href="https://github.com/onechain-lab" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <span>Built for OneChain developers</span>
              <span className="hidden sm:inline">•</span>
              <Link 
                href="/docs"
                className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Documentation
              </Link>
              <span className="hidden sm:inline">•</span>
              <a
                href="https://doc-testnet.onelabs.cc/typescript"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                TypeScript SDK
              </a>
              <span className="hidden sm:inline">•</span>
              <a
                href="https://onescan.cc"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                Explorer
              </a>
            </div>
            <div className="text-xs">Made with ❤️ for the OneChain community</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
