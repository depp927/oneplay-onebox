// OneChain network configurations
export const ONECHAIN_NETWORKS = {
  testnet: {
    name: "OneChain Testnet",
    url: "https://rpc-testnet.onelabs.cc",
    faucetUrl: "https://faucet-testnet.onelabs.cc/v1/gas",
    chainId: "onechain-testnet",
  },
  localnet: {
    name: "OneChain Localnet", 
    url: "http://localhost:9000",
    faucetUrl: "http://localhost:9123/gas",
    chainId: "onechain-localnet",
  },
} as const

export type NetworkType = keyof typeof ONECHAIN_NETWORKS

// OneChain specific wallet configuration
export const ONECHAIN_WALLET_CONFIG = {
  preferredWallets: ["OneChain Wallet", "OneLabs Wallet"],
  supportedFeatures: ["standard:connect", "standard:disconnect", "sui:signTransaction", "sui:signTransactionBlock"],
}
