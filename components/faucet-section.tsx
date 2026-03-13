"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCurrentAccount, useSuiClientContext } from "@onelabs/dapp-kit"
import { useMutation } from "@tanstack/react-query"
import { Droplets, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { requestFaucetTokens } from "@/lib/faucet-api"
import { testFaucetAPI } from "@/lib/faucet-test"
import type { NetworkType } from "@/lib/onechain-config"

export function FaucetSection() {
  const currentAccount = useCurrentAccount()
  const { network } = useSuiClientContext()
  const [recipientAddress, setRecipientAddress] = useState("")
  const [lastRequestResult, setLastRequestResult] = useState<{
    success: boolean
    txDigest?: string
    amount?: number
    task?: string
    error?: string
  } | null>(null)

  const faucetMutation = useMutation({
    mutationFn: async (recipient: string) => {
      return await requestFaucetTokens(recipient, network as NetworkType)
    },
    onSuccess: (data) => {
      console.log('Faucet success response:', data)
      
      // Check if we have transferred gas objects (immediate response)
      const transferredObject = data.transferredGasObjects?.[0]
      
      if (transferredObject) {
        setLastRequestResult({
          success: true,
          txDigest: transferredObject.transferTxDigest,
          amount: transferredObject.amount,
        })
        toast.success(`Successfully received ${transferredObject.amount} OCT tokens!`)
      } else if (data.task && data.error === null) {
        // OneChain faucet returns a task ID - this means the request was accepted
        setLastRequestResult({
          success: true,
          task: data.task,
        })
        toast.success("Faucet request submitted successfully! Tokens should arrive shortly.")
      } else if (data.status === "success" || data.message) {
        // Handle other success cases
        setLastRequestResult({
          success: true,
          error: data.message || "Faucet request completed successfully.",
        })
        toast.success(data.message || "Faucet request completed successfully!")
      } else {
        // No clear success indicator
        setLastRequestResult({
          success: false,
          error: "Unexpected response format from faucet. Please try again.",
        })
        toast.error("Unexpected response from faucet. Please try again.")
      }
      
      // Clear the input if it was using the connected wallet address
      if (recipientAddress === currentAccount?.address || !recipientAddress) {
        setRecipientAddress("")
      }
    },
    onError: (error) => {
      console.error('Faucet error:', error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setLastRequestResult({
        success: false,
        error: errorMessage,
      })
      toast.error(`Faucet request failed: ${errorMessage}`)
    },
  })

  const handleRequestTokens = () => {
    const recipient = recipientAddress || currentAccount?.address
    if (!recipient) {
      toast.error("Please connect wallet or enter recipient address")
      return
    }

    // Validate address format (basic check)
    if (!recipient.startsWith("0x") || recipient.length !== 66) {
      toast.error("Invalid address format")
      return
    }

    faucetMutation.mutate(recipient)
  }

  const getEffectiveRecipient = () => {
    return recipientAddress || currentAccount?.address || ""
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Droplets className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
          Testnet Faucet
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Request OCT tokens for testing on OneChain {network === "testnet" ? "Testnet" : "Localnet"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Recipient Address
          </Label>
          <Input
            id="recipient"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder={
              currentAccount?.address
                ? `${formatAddress(currentAccount.address)} (connected wallet)`
                : "0x... (connect wallet or enter address)"
            }
            className="bg-white/80 border-slate-200 dark:bg-slate-800/80 dark:border-slate-700 font-mono text-sm"
          />
          {currentAccount && !recipientAddress && (
            <p className="text-xs text-slate-500 dark:text-slate-400">Will use connected wallet address</p>
          )}
        </div>

        <Button
          onClick={handleRequestTokens}
          disabled={!getEffectiveRecipient() || faucetMutation.isPending}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm disabled:opacity-50"
        >
          {faucetMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Requesting Tokens...
            </>
          ) : (
            <>
              <Droplets className="h-4 w-4 mr-2" />
              Request OCT Tokens
            </>
          )}
        </Button>

        {/* Debug button for development */}
        {process.env.NODE_ENV === 'development' && (
          <Button
            onClick={async () => {
              const recipient = getEffectiveRecipient()
              if (recipient) {
                console.log('Testing faucet API...')
                const result = await testFaucetAPI(recipient)
                console.log('Test result:', result)
                toast.info('Check console for detailed faucet API response')
              }
            }}
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            🔍 Debug Faucet API (Dev Only)
          </Button>
        )}

        {lastRequestResult && (
          <div
            className={`rounded-lg border p-3 ${
              lastRequestResult.success
                ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20"
                : "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/20"
            }`}
          >
            <div className="flex items-start gap-2">
              {lastRequestResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                {lastRequestResult.success ? (
                  <div>
                    {lastRequestResult.amount ? (
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Success! Received {lastRequestResult.amount} OCT
                      </p>
                    ) : lastRequestResult.task ? (
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Faucet request submitted! Tokens will arrive shortly.
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Request completed successfully!
                      </p>
                    )}
                    {lastRequestResult.txDigest && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-mono mt-1 break-all">
                        TX: {lastRequestResult.txDigest}
                      </p>
                    )}
                    {lastRequestResult.task && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-mono mt-1 break-all">
                        Task ID: {lastRequestResult.task}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-red-800 dark:text-red-200">{lastRequestResult.error}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-slate-500 dark:text-slate-500">
          <p>
            {currentAccount
              ? `Connected to ${network === "testnet" ? "OneChain Testnet" : "OneChain Localnet"}`
              : "Connect wallet to auto-fill recipient address"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
