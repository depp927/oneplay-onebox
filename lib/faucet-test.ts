// Test utility to debug OneChain faucet API
export async function testFaucetAPI(recipient: string) {
  const faucetUrl = 'https://faucet-testnet.onelabs.cc/v1/gas'
  
  console.log('=== OneChain Faucet API Test ===')
  console.log('URL:', faucetUrl)
  console.log('Recipient:', recipient)
  
  const payload = {
    FixedAmountRequest: {
      recipient: recipient
    }
  }
  
  console.log('Payload:', JSON.stringify(payload, null, 2))
  
  try {
    const response = await fetch(faucetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    
    console.log('Response Status:', response.status)
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()))
    
    const responseText = await response.text()
    console.log('Raw Response:', responseText)
    
    let responseData
    try {
      responseData = JSON.parse(responseText)
      console.log('Parsed Response:', responseData)
    } catch (parseError) {
      console.log('Failed to parse response as JSON:', parseError)
    }
    
    return {
      success: response.ok,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      raw: responseText,
      parsed: responseData
    }
  } catch (error) {
    console.error('Fetch Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
