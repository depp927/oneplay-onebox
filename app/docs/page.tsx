"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Book, ExternalLink, Code, Wallet, TestTube, Zap } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Book className="h-5 w-5 text-blue-600" />
                  ONEbox Documentation
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Developer guides and resources</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Documentation
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Getting Started */}
          <Card className="shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">1. Connect Your Wallet</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Connect your OneChain wallet to start interacting with the testnet. ONEbox supports OneChain Wallet and OneLabs Wallet.
                </p>
                
                <h3 className="font-semibold text-sm">2. Get Test Tokens</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Use the faucet to get test tokens for your wallet. You'll need these for testing transactions and PTBs.
                </p>
                
                <h3 className="font-semibold text-sm">3. Build and Test</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Start building Programmable Transaction Blocks (PTBs) and testing them on the OneChain testnet.
                </p>
              </div>
              
              <Link href="/dashboard">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* OneChain Resources */}
          <Card className="shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                OneChain Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">TypeScript SDK</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://doc-testnet.onelabs.cc/typescript', '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">OneChain Explorer</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://onescan.cc', '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Move Language Guide</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://doc-testnet.onelabs.cc', '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">PTB Documentation</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://doc-testnet.onelabs.cc', '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features Guide */}
          <Card className="shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <TestTube className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                ONEbox Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Wallet Integration</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Connect and manage OneChain wallets with seamless integration and network switching.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-1">PTB Builder</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Build and test Programmable Transaction Blocks with presets and custom configurations.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-1">AI Assistant</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Get help with OneChain development using our ChatGPT-powered AI assistant.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-1">Testnet Faucet</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Get test tokens instantly for development and testing purposes.
                  </p>
                </div>
              </div>
              
              <Link href="/chat">
                <Button variant="outline" className="w-full">
                  Ask AI Assistant
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* API Reference */}
          <Card className="shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Code className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                Quick Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Testnet RPC</h4>
                  <code className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">
                    https://rpc-testnet.onelabs.cc
                  </code>
                </div>
                
                <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Faucet URL</h4>
                  <code className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">
                    https://faucet-testnet.onelabs.cc
                  </code>
                </div>
                
                <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Network ID</h4>
                  <code className="text-xs bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded">
                    testnet
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <div className="mt-8">
          <Card className="shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/80">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <h4 className="font-semibold text-sm mb-2">Community</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    Join the OneChain developer community for support and updates.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://discord.gg/onechain', '_blank')}
                  >
                    Join Discord
                  </Button>
                </div>
                
                <div className="text-center">
                  <h4 className="font-semibold text-sm mb-2">GitHub</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    Explore OneChain source code and contribute to the ecosystem.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://github.com/onechain-lab', '_blank')}
                  >
                    View Source
                  </Button>
                </div>
                
                <div className="text-center">
                  <h4 className="font-semibold text-sm mb-2">Examples</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    Browse example projects and code snippets for quick learning.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://github.com/onechain-lab/examples', '_blank')}
                  >
                    Browse Examples
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
