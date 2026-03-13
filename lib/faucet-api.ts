import { ONECHAIN_NETWORKS, type NetworkType } from "./onechain-config"

export interface FaucetRequest {
  FixedAmountRequest: {
    recipient: string
  }
}

export interface FaucetResponse {
  transferredGasObjects?: Array<{
    amount: number
    id: string
    transferTxDigest: string
  }>
  error?: string | null
  task?: string
  status?: string
  message?: string
}

export async function requestFaucetTokens(
  recipient: string,
  network: NetworkType = "testnet",
): Promise<FaucetResponse> {
  const faucetUrl = ONECHAIN_NETWORKS[network].faucetUrl

  console.log('Making faucet request to:', faucetUrl)
  console.log('Request payload:', {
    FixedAmountRequest: {
      recipient,
    },
  })

  try {
    const response = await fetch(faucetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        FixedAmountRequest: {
          recipient,
        },
      } as FaucetRequest),
    })

    console.log('Faucet response status:', response.status)
    console.log('Faucet response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Faucet error response:', errorText)
      throw new Error(`Faucet request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Faucet response data:', data)

    // Handle different response formats from OneChain faucet
    if (data.error) {
      throw new Error(data.error)
    }

    // OneChain faucet returns a task ID when request is successful
    if (data.task && data.error === null) {
      return {
        task: data.task,
        error: null,
        status: "success",
        message: "Faucet request submitted successfully",
      }
    }

    // Check if response indicates success but no gas objects
    if (data.status === "success" || data.message) {
      // Sometimes the faucet returns success but with different structure
      return {
        transferredGasObjects: data.transferredGasObjects || [],
        message: data.message,
        status: data.status,
      }
    }

    return data
  } catch (error) {
    console.error('Faucet request error:', error)
    throw error
  }
}
