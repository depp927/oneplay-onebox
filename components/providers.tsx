"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@onelabs/dapp-kit"
import { useState } from "react"
import { Toaster } from "sonner"

// Configure network specifically for OneChain
const { networkConfig } = createNetworkConfig({
  testnet: { 
    url: 'https://rpc-testnet.onelabs.cc',
    variables: {
      faucetUrl: 'https://faucet-testnet.onelabs.cc/v1/gas',
    }
  },
  localnet: { 
    url: 'http://localhost:9000',
    variables: {
      faucetUrl: 'http://localhost:9123/gas',
    }
  },
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider 
          autoConnect={false}
          enableUnsafeBurner={process.env.NODE_ENV === 'development'}
          preferredWallets={["OneChain Wallet", "OneLabs Wallet"]}
        >
          {children}
          <Toaster position="top-right" />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}
