import { ONECHAIN_NETWORKS, type NetworkType } from "./onechain-config"

export interface TransactionHistoryResponse {
  data: Array<{
    digest: string
    timestampMs?: string | null
    checkpoint?: string
    effects?: {
      status: { status: string }
      gasUsed?: {
        computationCost: string
        storageCost: string
        storageRebate: string
        nonRefundableStorageFee: string
      }
    }
    transaction?: {
      data?: {
        sender?: string
        gasData?: {
          budget: string
        }
      }
    }
  }>
  hasNextPage: boolean
  nextCursor?: string
}

// Alternative API using OneChain explorer API
export async function fetchTransactionHistoryFromExplorer(
  address: string,
  network: NetworkType = "testnet",
): Promise<TransactionHistoryResponse> {
  console.log('Fetching from OneChain explorer API for:', address)
  
  try {
    // Try to fetch from OneChain explorer API
    const explorerUrl = `https://onescan.cc/api/testnet/account/transactions?address=${address}&limit=20`
    
    const response = await fetch(explorerUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    })

    console.log('Explorer API response status:', response.status)
    console.log('Explorer API response headers:', response.headers.get('content-type'))

    if (response.ok) {
      const contentType = response.headers.get('content-type')
      
      // Check if response is actually JSON
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json()
        console.log('Explorer API response:', data)
        
        // Transform explorer data to our format
        if (data && Array.isArray(data)) {
          const transformedData = data.map((tx: any) => ({
            digest: tx.hash || tx.digest || tx.id,
            timestampMs: tx.timestamp ? (new Date(tx.timestamp).getTime()).toString() : null,
            checkpoint: tx.checkpoint,
            effects: {
              status: { status: tx.status || 'success' },
              gasUsed: tx.gasUsed || tx.gas
            },
            transaction: {
              data: {
                sender: tx.from || tx.sender,
                gasData: {
                  budget: tx.gasLimit || tx.gasUsed?.computationCost
                }
              }
            }
          }))
          
          return {
            data: transformedData,
            hasNextPage: false
          }
        }
      } else {
        console.warn('Explorer API returned HTML instead of JSON, API might not be available')
        // Try alternative OneChain RPC endpoint for transactions
        return await fetchTransactionHistory(address, network)
      }
    } else {
      console.warn('Explorer API request failed with status:', response.status)
    }
  } catch (error) {
    console.error('Explorer API error:', error)
  }

  // Fallback to RPC if explorer API fails
  return await fetchTransactionHistory(address, network)
}

export async function fetchTransactionHistory(
  address: string,
  network: NetworkType = "testnet",
): Promise<TransactionHistoryResponse> {
  const rpcUrl = ONECHAIN_NETWORKS[network].url

  console.log('Fetching comprehensive transaction history from:', rpcUrl)
  console.log('For address:', address)

  try {
    // Try multiple query methods to find all transactions involving this address
    const queries = [
      // Method 1: Query by FromAddress (sent transactions)
      {
        filter: { FromAddress: address },
        name: "FromAddress",
        type: "sent"
      },
      // Method 2: Query by ToAddress (received transactions)
      {
        filter: { ToAddress: address },
        name: "ToAddress", 
        type: "received"
      },
      // Method 3: Query by InputObject (transactions affecting owned objects)
      {
        filter: { InputObject: address },
        name: "InputObject",
        type: "interaction"
      },
      // Method 4: Query by ChangedObject (transactions changing owned objects)
      {
        filter: { ChangedObject: address },
        name: "ChangedObject",
        type: "change"
      }
    ]

    const allTransactions = new Map()

    // Execute all queries in parallel
    const queryPromises = queries.map(async (query) => {
      try {
        console.log(`Executing ${query.name} query...`)
        
        const response = await fetch(rpcUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "suix_queryTransactionBlocks",
            params: [
              {
                filter: query.filter,
                options: {
                  showInput: true,
                  showEffects: true,
                  showEvents: true,
                  showObjectChanges: true,
                  showBalanceChanges: true,
                },
                limit: 20,
                order: "descending",
              },
            ],
          }),
        })

        if (response.ok) {
          const data = await response.json()
          console.log(`${query.name} found:`, data.result?.data?.length || 0, 'transactions')

          if (data.result?.data) {
            data.result.data.forEach((tx: any) => {
              if (!allTransactions.has(tx.digest)) {
                // Add transaction type and source query info
                tx.querySource = query.type
                tx.transactionType = determineTransactionType(tx, address, query.type)
                allTransactions.set(tx.digest, tx)
              }
            })
          }
        }
      } catch (queryError) {
        console.warn(`${query.name} query failed:`, queryError)
      }
    })

    await Promise.all(queryPromises)

    const uniqueTransactions = Array.from(allTransactions.values())
    
    // Sort by timestamp (most recent first)
    uniqueTransactions.sort((a, b) => {
      const timeA = Number(a.timestampMs || 0)
      const timeB = Number(b.timestampMs || 0) 
      return timeB - timeA
    })

    console.log(`Found ${uniqueTransactions.length} total unique transactions`)

    return {
      data: uniqueTransactions.slice(0, 30), // Return up to 30 most recent
      hasNextPage: uniqueTransactions.length > 30,
    }

  } catch (error) {
    console.error('Transaction history fetch error:', error)
    
    // Fallback: try to get any recent transactions and filter them
    try {
      console.log('Attempting fallback query...')
      const fallbackResponse = await fetch(rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "suix_queryTransactionBlocks",
          params: [
            {
              filter: {},
              options: {
                showInput: true,
                showEffects: true,
                showBalanceChanges: true,
              },
              limit: 50,
              order: "descending",
            },
          ],
        }),
      })

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json()
        const filteredTxs = fallbackData.result?.data?.filter((tx: any) => {
          const sender = tx.transaction?.data?.sender
          const hasBalanceChange = tx.balanceChanges?.some((change: any) => 
            change.owner?.AddressOwner === address
          )
          const hasObjectChange = tx.effects?.mutated?.some((obj: any) => 
            obj.owner?.AddressOwner === address
          ) || tx.effects?.created?.some((obj: any) => 
            obj.owner?.AddressOwner === address
          )
          
          return sender === address || hasBalanceChange || hasObjectChange
        }).map((tx: any) => {
          tx.transactionType = determineTransactionType(tx, address, 'fallback')
          return tx
        }) || []
        
        console.log(`Fallback found ${filteredTxs.length} relevant transactions`)
        
        return {
          data: filteredTxs.slice(0, 20),
          hasNextPage: false
        }
      }
    } catch (fallbackError) {
      console.error('Fallback query also failed:', fallbackError)
    }

    return { data: [], hasNextPage: false }
  }
}

// Helper function to determine transaction type based on user involvement
function determineTransactionType(tx: any, userAddress: string, queryType: string): string {
  const sender = tx.transaction?.data?.sender
  const balanceChanges = tx.balanceChanges || []
  
  // Check if user was the sender
  if (sender === userAddress) {
    // Check if this resulted in a loss of balance (transfer out)
    const hasNegativeChange = balanceChanges.some((change: any) => 
      change.owner?.AddressOwner === userAddress && Number(change.amount) < 0
    )
    if (hasNegativeChange) {
      return 'Transfer Sent'
    }
    return 'Transaction Originated'
  }
  
  // Check if user received tokens
  const hasPositiveChange = balanceChanges.some((change: any) =>
    change.owner?.AddressOwner === userAddress && Number(change.amount) > 0  
  )
  if (hasPositiveChange) {
    return 'Transfer Received'
  }
  
  // Check for object interactions
  const hasObjectInteraction = tx.effects?.mutated?.some((obj: any) => 
    obj.owner?.AddressOwner === userAddress
  ) || tx.effects?.created?.some((obj: any) => 
    obj.owner?.AddressOwner === userAddress
  )
  
  if (hasObjectInteraction) {
    return 'Object Interaction'
  }
  
  // Default based on query type
  switch (queryType) {
    case 'sent': return 'Sent Transaction'
    case 'received': return 'Received Transaction' 
    case 'interaction': return 'Contract Interaction'
    case 'change': return 'State Change'
    default: return 'Related Transaction'
  }
}
