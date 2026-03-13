// Utility functions for OneChain wallet detection and debugging

export const detectAvailableWallets = () => {
  const wallets = []
  
  // Check for OneChain Wallet
  if (typeof window !== 'undefined' && window.onechain) {
    wallets.push('OneChain Wallet')
  }
  
  // Check for OneChain extension specific injection
  if (typeof window !== 'undefined' && window.onelabs) {
    wallets.push('OneLabs Wallet')
  }
  
  // Fallback check for Sui-compatible wallets if OneChain not available
  if (typeof window !== 'undefined' && window.suiWallet) {
    wallets.push('Sui Wallet (Fallback)')
  }
  
  return wallets
}

export const logWalletDebugInfo = () => {
  if (typeof window !== 'undefined') {
    console.log('=== OneChain Wallet Debug Info ===')
    console.log('Available wallets:', detectAvailableWallets())
    console.log('window.onechain:', !!window.onechain)
    console.log('window.onelabs:', !!window.onelabs)
    console.log('window.suiWallet:', !!window.suiWallet)
    console.log('OneChain extension detected:', !!window.onechain || !!window.onelabs)
    console.log('====================================')
  }
}

// Type augmentation for window object
declare global {
  interface Window {
    onechain?: any
    onelabs?: any
    suiWallet?: any
  }
}
