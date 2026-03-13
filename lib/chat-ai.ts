// OneChain Chat AI with OpenAI integration

interface ChatResponse {
  answer: string
  suggestions: string[]
}

// OneChain knowledge base (loaded from data.txt content)
const oneChainKnowledge = `
OneChain is a high-performance blockchain platform featuring:

Core Features:
- High-Performance Transaction Support: 200,000+ TPS with sub-second confirmation
- Developer-Friendly: Comprehensive modular development toolkit
- User-Friendly: Seamless integration with traditional login services
- USDO Stablecoin: Interest-bearing stablecoin pegged to fiat
- Real-World Asset Tokenization (RWA)
- Collaborative Node Ecosystem
- Advanced Security Mechanisms
- Configurable Privacy Protection

Move Programming Language:
Move is OneChain's smart contract language with key concepts:
- Objects: Everything is an object with unique IDs
- Abilities: key, store, copy, drop abilities for objects
- Ownership: Objects can be owned by addresses or shared
- Safety: Prevents common blockchain vulnerabilities

Programmable Transaction Blocks (PTBs):
PTBs enable batching multiple operations:
- Gas efficiency through transaction batching
- Atomic execution (all succeed or fail)
- Complex workflows in single transactions
- Up to 1,024 operations per PTB

Developer Tools:
- OneChain CLI for package management
- TypeScript SDK for frontend integration
- @onelabs/dapp-kit for wallet integration
- Testing framework with test scenarios
- Local development environment

Wallet Integration:
- Multiple wallet support through dApp kit
- Easy connection and account management
- Transaction signing and execution
- Real-time balance updates

Network Configuration:
- Testnet: https://rpc-testnet.onelabs.cc:443
- Mainnet: https://rpc-mainnet.onelabs.cc:443
- Explorer: https://onescan.cc
- Faucet available for testnet

Object Model:
- Owned Objects: Owned by specific addresses
- Shared Objects: Accessible by anyone
- Immutable Objects: Cannot be modified
- Object versioning for conflict resolution
`

export async function searchOneChainKnowledge(
  query: string, 
  onStream?: (chunk: string, isSuggestions?: boolean) => void
): Promise<ChatResponse> {
  try {
    // Try OpenAI API first
    return await callOpenAI(query, onStream)
  } catch (error) {
    console.warn('OpenAI API failed, falling back to local knowledge:', error)
  }

  // Fallback to local knowledge base (simulated stream)
  try {
    const answer = generateResponseFromKnowledge(query)
    const suggestions = generateSuggestions(query, answer)

    // Simulate streaming for local fallback
    if (onStream) {
        const chunkSize = 10;
        for (let i = 0; i < answer.length; i += chunkSize) {
            onStream(answer.slice(i, i + chunkSize), false);
            await new Promise(resolve => setTimeout(resolve, 20)); // simulated delay
        }
    }

    return { answer, suggestions }

  } catch (error) {
    console.error('Chat error:', error)
    
    const fallbackResponse = {
      answer: generateFallbackResponse(query),
      suggestions: [
        "How do I start developing on OneChain?",
        "What are PTBs and how do I use them?",
        "How to integrate OneChain wallet?",
        "Move programming basics"
      ]
    }
    
    if (onStream) {
        onStream(fallbackResponse.answer, false);
    }
    
    return fallbackResponse;
  }
}

async function callOpenAI(query: string, onStream?: (chunk: string, isSuggestions?: boolean) => void): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: query,
        knowledge: oneChainKnowledge
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        // Handle cached JSON response
        const data = await response.json();
        console.log('Cached JSON response:', data);
        console.log('onStream:', onStream);
        if (onStream) {
            onStream(data.response, false); 
        }
        return {
            answer: data.response,
            suggestions: data.suggestions || generateSuggestions(query, data.response)
        };
    }

    if (!response.body) throw new Error('Response body is null');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let suggestions: string[] = [];
    
    console.log('[ChatAI] Starting stream read...');

    let isCollectingSuggestions = false;

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            console.log('[ChatAI] Stream complete');
            break;
        }
        
        const chunk = decoder.decode(value, { stream: true });
       
        
        fullText += chunk;
        // console.log('[ChatAI] Chunk onStream:', onStream);
        // console.log('[ChatAI] Full text:', fullText);
        if (onStream) {
            // Check if we stumbled upon suggestions marker
            if (!isCollectingSuggestions) {
                if (fullText.includes(':::SUGGESTIONS:::')) {
                    isCollectingSuggestions = true;
                    // If the marker is in *this* chunk, stream the part before it
                    const splitIdx = chunk.indexOf(':::SUGGESTIONS:::');
                    if (splitIdx !== -1) {
                         const safeChunk = chunk.slice(0, splitIdx);
                         if (safeChunk) onStream(safeChunk, false);
                    }
                    // Else, the marker was formed by concatenation, we might have streamed partial marker ":::SUG" already.
                    // This is acceptable glitch for now.
                } else {
                     // Smooth streaming for better UX if chunk is large "flush"
                    if (chunk.length > 20) {
                        const step = 4;
                        for (let i = 0; i < chunk.length; i += step) {
                            onStream(chunk.slice(i, i + step), false);
                            await new Promise(resolve => setTimeout(resolve, 5));
                        }
                    } else {
                        onStream(chunk, false);
                    }
                }
            }
        }
    }
    
    // Final flush of decoder just in case
    const finalChunk = decoder.decode();
    if (finalChunk) {
         fullText += finalChunk;
         if (onStream) onStream(finalChunk, false);
    }

    // Post-processing to extract suggestions from fullText
    let finalAnswer = fullText;
    const suggestionMatch = fullText.match(/:::SUGGESTIONS:::([\s\S]*?):::SUGGESTIONS:::/);
    if (suggestionMatch && suggestionMatch[1]) {
        try {
            suggestions = JSON.parse(suggestionMatch[1].trim());
            finalAnswer = fullText.replace(suggestionMatch[0], '').trim();
        } catch (e) {
            console.error("Failed to parse suggestions from stream", e);
        }
    }

    return {
        answer: finalAnswer,
        suggestions: suggestions.length > 0 ? suggestions : generateSuggestions(query, finalAnswer)
    }

  } catch (error) {
    console.error('OpenAI API call failed:', error)
    throw error; // Let the fallback handle it
  }
}

function generateResponseFromKnowledge(query: string): string {
  const lowerQuery = query.toLowerCase()

  // Move programming questions
  if (lowerQuery.includes('move') && (lowerQuery.includes('package') || lowerQuery.includes('first') || lowerQuery.includes('start'))) {
    return `# Creating Your First Move Package

Here's how to create and build your first Move package on OneChain:

## 1. Create New Package
\`\`\`bash
one move new my_first_package
cd my_first_package
\`\`\`

## 2. Basic Package Structure
\`\`\`
my_first_package/
├── Move.toml          # Package manifest
└── sources/
    └── example.move   # Your Move modules
\`\`\`

## 3. Example Move Module
\`\`\`move
module my_first_package::example {
    use one::object::{Self, UID};
    use one::tx_context::TxContext;
    
    public struct Sword has key, store {
        id: UID,
        magic: u64,
        strength: u64,
    }
    
    fun init(ctx: &mut TxContext) {
        // Module initializer - runs when published
    }
    
    public fun create_sword(magic: u64, strength: u64, ctx: &mut TxContext): Sword {
        Sword {
            id: object::new(ctx),
            magic,
            strength,
        }
    }
}
\`\`\`

## 4. Build and Test
\`\`\`bash
one move build
one move test
\`\`\`

## 5. Publish to Network
\`\`\`bash
one client publish --gas-budget 5000000
\`\`\`

Your package is now live on OneChain! 🎉`
  }

  // PTB questions
  if (lowerQuery.includes('ptb') || lowerQuery.includes('programmable transaction')) {
    return `# Programmable Transaction Blocks (PTBs)

PTBs are OneChain's way to batch multiple operations into a single atomic transaction.

## Key Benefits
• **Gas Efficiency**: Multiple operations, single gas payment
• **Atomicity**: All operations succeed or none do
• **Flexibility**: Chain operations and pass results between them
• **Performance**: Up to 1,024 operations per transaction

## Basic PTB Example
\`\`\`typescript
import { Transaction } from '@mysten/sui/transactions';

const tx = new Transaction();

// Split coins from gas payment
const [coin] = tx.splitCoins(tx.gas, [tx.pure(100)]);

// Transfer the new coin
tx.transferObjects([coin], tx.pure('0xRecipientAddress'));

// Execute the transaction
const result = await client.signAndExecuteTransaction({
  signer: keypair,
  transaction: tx
});
\`\`\`

## Advanced PTB with Move Calls
\`\`\`typescript
const tx = new Transaction();

// Call a Move function
const [nft] = tx.moveCall({
  target: '0x2::devnet_nft::mint',
  arguments: [
    tx.pure('My NFT'),
    tx.pure('A beautiful NFT'),
    tx.pure('https://image-url.com')
  ]
});

// Transfer the minted NFT
tx.transferObjects([nft], tx.pure(recipientAddress));
\`\`\`

## PTB with Multiple Operations
\`\`\`typescript
const tx = new Transaction();

// 1. Split multiple coins
const coins = tx.splitCoins(tx.gas, [tx.pure(100), tx.pure(200), tx.pure(300)]);

// 2. Make multiple transfers
const recipients = ['0xAddr1', '0xAddr2', '0xAddr3'];
recipients.forEach((addr, index) => {
  tx.transferObjects([coins[index]], tx.pure(addr));
});

// 3. Execute everything atomically
await client.signAndExecuteTransaction({ signer: keypair, transaction: tx });
\`\`\`

PTBs make complex operations simple and efficient! 🚀`
  }

  // Wallet integration questions
  if (lowerQuery.includes('wallet') && (lowerQuery.includes('connect') || lowerQuery.includes('integrate'))) {
    return `# OneChain Wallet Integration

Connect your dApp to OneChain wallets using the official dApp kit.

## Installation
\`\`\`bash
npm install @onelabs/dapp-kit @tanstack/react-query
\`\`\`

## Setup Providers
\`\`\`tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@onelabs/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';

const queryClient = new QueryClient();
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider client={suiClient}>
        <WalletProvider>
          <YourApp />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
\`\`\`

## Connect Wallet Component
\`\`\`tsx
import { ConnectButton, useCurrentAccount } from '@onelabs/dapp-kit';

function WalletConnection() {
  const currentAccount = useCurrentAccount();

  return (
    <div>
      {currentAccount ? (
        <div>
          <p>Connected: {currentAccount.address}</p>
        </div>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
\`\`\`

## Sign and Execute Transactions
\`\`\`tsx
import { useSignAndExecuteTransaction } from '@onelabs/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

function TransferComponent() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleTransfer = () => {
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(100)]);
    tx.transferObjects([coin], tx.pure('0xRecipientAddress'));

    signAndExecute({
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });
  };

  return <button onClick={handleTransfer}>Send 100 OCT</button>;
}
\`\`\`

## Get Account Balance
\`\`\`tsx
import { useOwnedCoins } from '@onelabs/dapp-kit';

function BalanceDisplay() {
  const { data: coins } = useOwnedCoins();
  
  const totalBalance = coins?.data.reduce((sum, coin) => sum + parseInt(coin.balance), 0) || 0;

  return <div>Balance: {totalBalance / 1e9} OCT</div>;
}
\`\`\`

Easy wallet integration for better UX! 💰`
  }

  // Object ownership questions
  if (lowerQuery.includes('object') && (lowerQuery.includes('ownership') || lowerQuery.includes('shared') || lowerQuery.includes('owned'))) {
    return `# OneChain Object Ownership Model

OneChain uses a unique object-oriented approach where everything is an object.

## Object Types

### 1. Owned Objects
• **Owned by specific addresses**
• **Fast transactions** (no consensus needed)
• **Parallel execution** possible
• **Used for**: Personal assets, coins, NFTs

\`\`\`move
// Objects with 'key' ability are OneChain objects
public struct MyCoin has key, store {
    id: UID,
    value: u64,
}
\`\`\`

### 2. Shared Objects
• **Accessible by anyone**
• **Requires consensus** for modifications
• **Sequential execution**
• **Used for**: DEX pools, global registries

\`\`\`move
// Shared objects can be accessed by multiple transactions
public fun create_shared_object(ctx: &mut TxContext) {
    let obj = SharedObject { id: object::new(ctx) };
    transfer::share_object(obj);
}
\`\`\`

### 3. Immutable Objects
• **Cannot be modified**
• **No ownership transfer**
• **Used for**: Configuration, constants

## Object Abilities
\`\`\`move
public struct MyObject has key, store {  // ← Abilities
    id: UID,
    data: vector<u8>,
}
\`\`\`

• **key**: Can be owned by addresses (Sui object)
• **store**: Can be stored inside other objects
• **copy**: Can be copied (rarely used)
• **drop**: Can be discarded (rarely used for valuable assets)

## Ownership Patterns

### Transfer Objects
\`\`\`move
// Transfer to specific address
transfer::public_transfer(obj, recipient);

// Transfer to sender
transfer::public_transfer(obj, tx_context::sender(ctx));
\`\`\`

### Share Objects
\`\`\`move
// Make object globally accessible
transfer::share_object(obj);
\`\`\`

### Freeze Objects
\`\`\`move
// Make object immutable
transfer::freeze_object(obj);
\`\`\`

## Best Practices
• Use **owned objects** for user assets and high-throughput scenarios
• Use **shared objects** for coordination between multiple parties
• Use **immutable objects** for configuration and reference data
• Consider **object composition** for complex data structures

The object model enables OneChain's high performance and safety! ⚡`
  }

  // Development setup questions
  if (lowerQuery.includes('setup') || lowerQuery.includes('install') || lowerQuery.includes('start')) {
    return `# OneChain Development Setup

Get started with OneChain development in a few simple steps.

## 1. Install OneChain CLI
\`\`\`bash
# Install from source
cargo install --locked --git https://github.com/one-chain-labs/onechain.git one_chain --features tracing

# Move binary to PATH
mv ~/.cargo/bin/one_chain ~/.cargo/bin/one
\`\`\`

## 2. Configure Network Connection
\`\`\`bash
# Connect to testnet
one client

# Or connect to specific network
one client new-env --alias testnet --rpc https://rpc-testnet.onelabs.cc:443
one client switch --env testnet
\`\`\`

## 3. Create Wallet Address
\`\`\`bash
# Generate new address
one client new-address ed25519

# List all addresses
one keytool list
\`\`\`

## 4. Get Test Tokens
\`\`\`bash
# Request from faucet
one client faucet

# Check balance
one client gas
\`\`\`

## 5. Create Your First Project
\`\`\`bash
# Create new Move package
one move new hello_onechain
cd hello_onechain

# Build the package
one move build

# Run tests
one move test
\`\`\`

## 6. Development Environment
\`\`\`bash
# Install TypeScript SDK for frontend
npm install @onelabs/dapp-kit @mysten/sui
\`\`\`

## 7. Useful Commands
\`\`\`bash
# View objects owned by address
one client objects

# View transaction details
one client transaction <TX_DIGEST>

# Publish package
one client publish --gas-budget 5000000

# Execute PTB
one client ptb --help
\`\`\`

## Project Structure
\`\`\`
my_project/
├── Move.toml           # Package configuration
├── sources/            # Move source files
│   └── module.move
└── tests/             # Test files
    └── test.move
\`\`\`

You're ready to build on OneChain! 🚀`
  }

  // Default response for general questions
  return `# OneChain Development Help

I can help you with various OneChain topics! Here's what I know about:

## 🏗️ Core Development
• **Move Language**: Smart contract programming
• **PTBs**: Programmable Transaction Blocks for batching operations
• **Object Model**: Owned, shared, and immutable objects
• **CLI Tools**: OneChain command-line interface

## 🔌 Integration
• **Wallet Connection**: Using @onelabs/dapp-kit
• **TypeScript SDK**: Frontend development tools
• **Network Configuration**: Testnet and mainnet setup
• **Transaction Handling**: Signing and execution

## 📊 Advanced Topics  
• **Gas Optimization**: Efficient transaction design
• **Testing Strategies**: Unit and integration testing
• **Security Patterns**: Safe smart contract development
• **Performance**: High-throughput application design

## 🎯 Quick Answers
• **High Performance**: 200,000+ TPS with sub-second finality
• **Developer Friendly**: Comprehensive SDK and tooling
• **Object-Oriented**: Everything is an object with clear ownership
• **Move Language**: Safe, resource-oriented programming

What specific aspect would you like to explore? Ask me about:
- "How to create my first Move package?"
- "What are PTBs and how do I use them?"
- "How to connect a wallet to OneChain?"
- "Explain OneChain objects and ownership"`
}

function generateSuggestions(query: string, answer: string): string[] {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes('move')) {
    return [
      "How to publish my Move package?",
      "Move testing best practices",
      "Understanding Move abilities",
      "Move vs Solidity differences"
    ]
  }

  if (lowerQuery.includes('ptb')) {
    return [
      "PTB gas optimization tips",
      "Complex PTB patterns",
      "PTB error handling",
      "PTB with shared objects"
    ]
  }

  if (lowerQuery.includes('wallet')) {
    return [
      "Handle wallet disconnection",
      "Multiple wallet support",
      "Transaction approval UX",
      "Wallet state management"
    ]
  }

  if (lowerQuery.includes('object')) {
    return [
      "Object versioning explained",
      "Dynamic fields in objects",
      "Object wrapping patterns",
      "Performance with many objects"
    ]
  }

  // Default suggestions
  return [
    "How do I start developing on OneChain?",
    "What are PTBs and how do I use them?",
    "How to integrate OneChain wallet?",
    "Explain OneChain objects and ownership"
  ]
}

function generateFallbackResponse(query: string): string {
  return `# OneChain Help

I apologize, but I'm having trouble processing your request right now. Here's some general OneChain information that might help:

## Quick Reference
• **OneChain CLI**: \`one --help\` for command reference
• **Move Docs**: Smart contract programming language
• **Testnet RPC**: https://rpc-testnet.onelabs.cc:443
• **Explorer**: https://onescan.cc

## Common Commands
\`\`\`bash
# Create new project
one move new my_project

# Build project
one move build

# Request testnet tokens
one client faucet

# Check balance
one client gas
\`\`\`

Try asking me about specific topics like "Move programming", "wallet integration", or "PTBs" for more detailed help!`
}
