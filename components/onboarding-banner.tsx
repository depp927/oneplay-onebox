"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Wallet, Droplets, Code2 } from "lucide-react"
import { useState } from "react"

export function OnboardingBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <Card className="mb-8 border-blue-200/60 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:border-blue-800/60 dark:from-blue-950/40 dark:to-cyan-950/40">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Welcome to ONEbox!</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-2xl">
              Your beginner-friendly portal for OneChain development. Get started by connecting your wallet, then
              explore building and testing transactions on the testnet.
            </p>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Wallet className="h-4 w-4" />
                <span>Connect Wallet</span>
                <ArrowRight className="h-3 w-3" />
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Droplets className="h-4 w-4" />
                <span>Get Test Tokens</span>
                <ArrowRight className="h-3 w-3" />
              </div>
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Code2 className="h-4 w-4" />
                <span>Build PTBs</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            ×
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
