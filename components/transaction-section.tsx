"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useCurrentAccount, useSuiClientContext } from "@onelabs/dapp-kit"
import { History, ExternalLink, ChevronDown, ChevronRight, Copy, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchTransactionHistory, fetchTransactionHistoryFromExplorer } from "@/lib/transaction-api"
import type { NetworkType } from "@/lib/onechain-config"

export function TransactionSection() {
  const currentAccount = useCurrentAccount()
  const { network } = useSuiClientContext()
  const [expandedTx, setExpandedTx] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Query transaction history using explorer API
  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['transactions', currentAccount?.address, network, refreshKey],
    queryFn: async () => {
      if (!currentAccount?.address) throw new Error("No address provided")
      
      // Try OneChain explorer API first
      const explorerResult = await fetchTransactionHistoryFromExplorer(currentAccount.address, network as NetworkType)
      
      if (explorerResult.data.length > 0) {
        return explorerResult
      }
      
      // Fallback to RPC API if explorer returns no results
      const rpcResult = await fetchTransactionHistory(currentAccount.address, network as NetworkType)
      return rpcResult
    },
    enabled: !!currentAccount?.address,
    refetchInterval: 30000,
  })

  const handleRefresh = async () => {
    setRefreshKey((prev) => prev + 1)
    await refetch()
    toast.success("Transaction history refreshed!")
  }

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const formatTimestamp = (timestampMs?: string | null) => {
    if (!timestampMs) return "Unknown"
    const date = new Date(Number(timestampMs))
    return date.toLocaleString()
  }

  const formatDigest = (digest: string) => {
    return `${digest.slice(0, 8)}...${digest.slice(-6)}`
  }

  const formatGasUsed = (gasUsed?: any) => {
    if (!gasUsed) return "N/A"
    const total = Number(gasUsed.computationCost || 0) + Number(gasUsed.storageCost || 0) - Number(gasUsed.storageRebate || 0)
    return total.toLocaleString()
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "failure":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400"
    }
  }

  const toggleExpanded = (digest: string) => {
    setExpandedTx(expandedTx === digest ? null : digest)
  }

  const openInExplorer = (digest: string) => {
    // Use OneChain explorer URL
    if (digest) {
      window.open(`https://onescan.cc/testnet/transactionBlocksDetail?digest=${digest}`, "_blank")
    } else {
      window.open(`https://onescan.cc/testnet/home`, "_blank")
    }
  }

  const openWalletInExplorer = (address: string) => {
    window.open(`https://onescan.cc/testnet/address/${address}`, "_blank")
  }

  if (!currentAccount) {
    return (
      <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <History className="h-5 w-5 text-green-600 dark:text-green-400" />
            Transaction History
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Recent transactions for your connected wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Connect wallet to view transaction history
            </p>
            <Button variant="outline" size="sm" disabled>
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-900 dark:text-slate-100">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-green-600 dark:text-green-400" />
            Transaction History
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Recent transactions for your connected wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-200">Error loading transactions: {error.message}</p>
          </div>
        ) : isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
            ))}
          </div>
        ) : transactions && transactions.data.length > 0 ? (
          <div className="space-y-2">
            {transactions.data.map((tx: any) => (
              <Collapsible key={tx.digest}>
                <div className="rounded-lg border border-slate-200 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                    onClick={() => toggleExpanded(tx.digest)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {expandedTx === tx.digest ? (
                        <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm text-slate-900 dark:text-slate-100">
                            {formatDigest(tx.digest)}
                          </span>
                          <Badge className={`text-xs ${getStatusColor(tx.effects?.status?.status || "unknown")}`}>
                            {tx.effects?.status?.status || "Unknown"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                          <span>{formatTimestamp(tx.timestampMs)}</span>
                          <span>Gas: {formatGasUsed(tx.effects?.gasUsed)}</span>
                          {tx.checkpoint && <span>Checkpoint: {tx.checkpoint}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyToClipboard(tx.digest, "Transaction digest")
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          openInExplorer(tx.digest)
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="pt-4 space-y-4">
                        {/* Transaction Details */}
                        <div>
                          <h5 className="font-medium text-sm text-slate-900 dark:text-slate-100 mb-2">
                            Transaction Details
                          </h5>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-slate-500 dark:text-slate-400">Sender:</span>
                              <div className="flex items-center gap-2">
                                <p className="font-mono text-slate-900 dark:text-slate-100 break-all text-xs">
                                  {tx.transaction?.data?.sender || "N/A"}
                                </p>
                                {tx.transaction?.data?.sender && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openWalletInExplorer(tx.transaction.data.sender)}
                                    className="h-4 w-4 p-0 opacity-70 hover:opacity-100"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div>
                              <span className="text-slate-500 dark:text-slate-400">Gas Budget:</span>
                              <p className="font-mono text-slate-900 dark:text-slate-100">
                                {tx.transaction?.data?.gasData?.budget || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Gas Usage Breakdown */}
                        {tx.effects?.gasUsed && (
                          <div>
                            <h5 className="font-medium text-sm text-slate-900 dark:text-slate-100 mb-2">Gas Usage</h5>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-slate-500 dark:text-slate-400">Computation:</span>
                                <p className="font-mono text-slate-900 dark:text-slate-100">
                                  {Number(tx.effects.gasUsed.computationCost || 0).toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <span className="text-slate-500 dark:text-slate-400">Storage:</span>
                                <p className="font-mono text-slate-900 dark:text-slate-100">
                                  {Number(tx.effects.gasUsed.storageCost || 0).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Object Changes */}
                        {(tx.effects?.created?.length ||
                          tx.effects?.mutated?.length ||
                          tx.effects?.deleted?.length) && (
                          <div>
                            <h5 className="font-medium text-sm text-slate-900 dark:text-slate-100 mb-2">
                              Object Changes
                            </h5>
                            <div className="space-y-2 text-xs">
                              {tx.effects?.created?.length > 0 && (
                                <div>
                                  <span className="text-green-600 dark:text-green-400">Created:</span>
                                  <span className="ml-2 text-slate-900 dark:text-slate-100">
                                    {tx.effects.created.length} objects
                                  </span>
                                </div>
                              )}
                              {tx.effects?.mutated?.length > 0 && (
                                <div>
                                  <span className="text-blue-600 dark:text-blue-400">Modified:</span>
                                  <span className="ml-2 text-slate-900 dark:text-slate-100">
                                    {tx.effects.mutated.length} objects
                                  </span>
                                </div>
                              )}
                              {tx.effects?.deleted?.length > 0 && (
                                <div>
                                  <span className="text-red-600 dark:text-red-400">Deleted:</span>
                                  <span className="ml-2 text-slate-900 dark:text-slate-100">
                                    {tx.effects.deleted.length} objects
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Balance Changes */}
                        {tx.balanceChanges && tx.balanceChanges.length > 0 && (
                          <div>
                            <h5 className="font-medium text-sm text-slate-900 dark:text-slate-100 mb-2">
                              Balance Changes
                            </h5>
                            <div className="space-y-2 text-xs">
                              {tx.balanceChanges.map((change: any, index: number) => (
                                <div key={index} className="flex items-center justify-between">
                                  <span className="text-slate-500 dark:text-slate-400">
                                    {change.coinType === "0x2::sui::SUI" ? "OCT" : "Token"}:
                                  </span>
                                  <span className={`font-mono ${
                                    Number(change.amount) > 0 
                                      ? "text-green-600 dark:text-green-400" 
                                      : "text-red-600 dark:text-red-400"
                                  }`}>
                                    {Number(change.amount) > 0 ? "+" : ""}{Number(change.amount) / 1e9} OCT
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}

            {transactions.hasNextPage && (
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">
                  Load More Transactions
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">No transactions found</p>
            <Button variant="outline" size="sm" onClick={() => openInExplorer("")}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
