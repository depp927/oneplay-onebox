"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCurrentAccount, useSuiClientQuery, useSuiClientInfiniteQuery } from "@onelabs/dapp-kit"
import { Coins, RefreshCw, Copy, Package } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

export function BalanceSection() {
  const currentAccount = useCurrentAccount()
  const [refreshKey, setRefreshKey] = useState(0)

  // Query all balances for the connected wallet
  const {
    data: balances,
    isLoading: balancesLoading,
    error: balancesError,
    refetch: refetchBalances,
  } = useSuiClientQuery(
    "getAllBalances",
    {
      owner: currentAccount?.address || "",
    },
    {
      enabled: !!currentAccount?.address,
      refetchInterval: 30000, // Refresh every 30 seconds
    },
  )

  // Query owned objects for the connected wallet
  const {
    data: ownedObjectsData,
    isLoading: objectsLoading,
    error: objectsError,
    fetchNextPage,
    hasNextPage,
    refetch: refetchObjects,
  } = useSuiClientInfiniteQuery(
    "getOwnedObjects",
    {
      owner: currentAccount?.address || "",
      options: {
        showType: true,
        showContent: true,
        showDisplay: true,
      },
    },
    {
      enabled: !!currentAccount?.address,
    },
  )

  const handleRefresh = async () => {
    setRefreshKey((prev) => prev + 1)
    await Promise.all([refetchBalances(), refetchObjects()])
    toast.success("Balances refreshed!")
  }

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const formatBalance = (balance: string, decimals = 9) => {
    const num = Number.parseInt(balance) / Math.pow(10, decimals)
    return num.toLocaleString(undefined, { maximumFractionDigits: 6 })
  }

  const formatObjectId = (id: string) => {
    return `${id.slice(0, 8)}...${id.slice(-6)}`
  }

  const formatObjectType = (type: string) => {
    const parts = type.split("::")
    return parts[parts.length - 1] || type
  }

  const allOwnedObjects = ownedObjectsData?.pages.flatMap((page) => page.data) || []

  if (!currentAccount) {
    return (
      <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Coins className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Balances & Assets
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            View your token balances and owned objects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Connect wallet to see balances</p>
            <Button variant="outline" size="sm" disabled>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
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
            <Coins className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Balances & Assets
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={balancesLoading || objectsLoading}
            className="h-8 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${balancesLoading || objectsLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Token balances and owned objects for your connected wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="balances" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="balances">Token Balances</TabsTrigger>
            <TabsTrigger value="objects">Owned Objects</TabsTrigger>
          </TabsList>

          <TabsContent value="balances" className="space-y-4">
            {balancesError ? (
              <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Error loading balances: {balancesError.message}
                </p>
              </div>
            ) : balancesLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : balances && balances.length > 0 ? (
              <div className="rounded-lg border border-slate-200 dark:border-slate-700">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Token Type</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balances.map((balance, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900 dark:text-slate-100">
                              {balance.coinType === "0x2::sui::SUI" ? "OCT" : formatObjectType(balance.coinType)}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                              {formatObjectId(balance.coinType)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">{formatBalance(balance.totalBalance)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(balance.coinType, "Token type")}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-6 text-center dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-sm text-slate-600 dark:text-slate-400">No token balances found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="objects" className="space-y-4">
            {objectsError ? (
              <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-200">Error loading objects: {objectsError.message}</p>
              </div>
            ) : objectsLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : allOwnedObjects.length > 0 ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 dark:border-slate-700">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Object ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Version</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allOwnedObjects.slice(0, 10).map((obj) => (
                        <TableRow key={obj.data?.objectId}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-slate-400" />
                              <span className="font-mono text-sm">{formatObjectId(obj.data?.objectId || "")}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{formatObjectType(obj.data?.type || "")}</span>
                              {obj.data?.display?.data?.name && (
                                <span className="text-xs text-slate-500">{obj.data.display.data.name}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              v{obj.data?.version}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(obj.data?.objectId || "", "Object ID")}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {hasNextPage && (
                  <div className="text-center">
                    <Button variant="outline" onClick={() => fetchNextPage()} size="sm">
                      Load More Objects
                    </Button>
                  </div>
                )}

                {allOwnedObjects.length > 10 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    Showing 10 of {allOwnedObjects.length} objects
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-6 text-center dark:border-slate-700 dark:bg-slate-800/50">
                <p className="text-sm text-slate-600 dark:text-slate-400">No owned objects found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
