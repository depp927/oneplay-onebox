import { TransactionBlock } from "@mysten/sui/transactions"

/**
 * PTB (Programmable Transaction Block) Simulator for OneChain Development
 * 
 * This is a developer tool for building and testing transaction logic before deployment.
 * 
 * Key Features:
 * - Simulate complex transaction flows
 * - Test Move contract interactions
 * - Validate transaction arguments and types
 * - Debug gas usage and execution paths
 * 
 * Step Types:
 * - splitCoin: Split coins for transfers
 * - moveCall: Call Move contract functions
 * - transferObjects: Transfer objects between addresses
 * - assignVariable: Store intermediate results
 * - setGasBudget: Set transaction gas limits
 */

export interface PTBStep {
  id: string
  type: "moveCall" | "transferObjects" | "assignVariable" | "setGasBudget" | "splitCoin"
  label: string
  data: any
}

export interface PTBPreset {
  id: string
  name: string
  description: string
  steps: PTBStep[]
}

export const PTB_PRESETS: PTBPreset[] = [
  {
    id: "oct-transfer",
    name: "OCT Transfer Simulation",
    description: "Simulate transferring OCT tokens to another address",
    steps: [
      {
        id: "split-coin",
        type: "splitCoin",
        label: "Split OCT Coin",
        data: {
          coin: "gas",
          amount: "amount",
        },
      },
      {
        id: "transfer",
        type: "transferObjects",
        label: "Transfer Split Coin",
        data: {
          objects: ["split-coin"],
          recipient: "recipient",
        },
      },
    ],
  },
  {
    id: "move-call-example",
    name: "Move Call Simulation", 
    description: "Simulate a basic Move contract call",
    steps: [
      {
        id: "move-call",
        type: "moveCall",
        label: "Create Zero Coin",
        data: {
          target: "0x2::coin::zero",
          arguments: [],
          typeArguments: ["0x2::sui::SUI"],
        },
      },
    ],
  },
  {
    id: "multi-transfer",
    name: "Multi-Recipient Transfer",
    description: "Split and transfer to multiple recipients",
    steps: [
      {
        id: "split-1",
        type: "splitCoin",
        label: "Split First Amount",
        data: {
          coin: "gas",
          amount: "amount",
        },
      },
      {
        id: "split-2", 
        type: "splitCoin",
        label: "Split Second Amount",
        data: {
          coin: "gas",
          amount: "amount",
        },
      },
      {
        id: "transfer-1",
        type: "transferObjects",
        label: "Transfer to First Recipient",
        data: {
          objects: ["split-1"],
          recipient: "recipient",
        },
      },
    ],
  },
  {
    id: "coin-operations",
    name: "Coin Operations Demo",
    description: "Demonstrate various coin operations",
    steps: [
      {
        id: "create-zero",
        type: "moveCall",
        label: "Create Zero Coin",
        data: {
          target: "0x2::coin::zero",
          arguments: [],
          typeArguments: ["0x2::sui::SUI"],
        },
      },
      {
        id: "split-main",
        type: "splitCoin",
        label: "Split Main Coin",
        data: {
          coin: "gas",
          amount: "amount",
        },
      },
      {
        id: "transfer-split",
        type: "transferObjects",
        label: "Transfer Split Coin",
        data: {
          objects: ["split-main"],
          recipient: "recipient",
        },
      },
    ],
  },
  {
    id: "batch-operations",
    name: "Batch Operations",
    description: "Multiple operations in single transaction",
    steps: [
      {
        id: "op-1",
        type: "moveCall",
        label: "First Operation",
        data: {
          target: "0x2::coin::zero",
          arguments: [],
          typeArguments: ["0x2::sui::SUI"],
        },
      },
      {
        id: "op-2",
        type: "splitCoin",
        label: "Split Operation",
        data: {
          coin: "gas",
          amount: "amount",
        },
      },
      {
        id: "op-3",
        type: "moveCall",
        label: "Second Operation",
        data: {
          target: "0x2::coin::zero",
          arguments: [],
          typeArguments: ["0x2::sui::SUI"],
        },
      },
    ],
  },
  {
    id: "gas-efficient",
    name: "Gas Efficient Transfer",
    description: "Optimized transaction for minimal gas usage",
    steps: [
      {
        id: "efficient-split",
        type: "splitCoin",
        label: "Efficient Split",
        data: {
          coin: "gas",
          amount: "amount",
        },
      },
      {
        id: "efficient-transfer",
        type: "transferObjects",
        label: "Direct Transfer",
        data: {
          objects: ["efficient-split"],
          recipient: "recipient",
        },
      },
    ],
  },
  {
    id: "large-amount-transfer",
    name: "Large Amount Transfer",
    description: "Transfer larger amounts with proper splitting",
    steps: [
      {
        id: "large-split",
        type: "splitCoin",
        label: "Split Large Amount",
        data: {
          coin: "gas",
          amount: "amount",
        },
      },
      {
        id: "large-transfer",
        type: "transferObjects",
        label: "Transfer Large Amount",
        data: {
          objects: ["large-split"],
          recipient: "recipient",
        },
      },
    ],
  },
  {
    id: "contract-interaction",
    name: "Contract Interaction",
    description: "Interact with smart contracts",
    steps: [
      {
        id: "prepare-coin",
        type: "splitCoin",
        label: "Prepare Coin for Contract",
        data: {
          coin: "gas",
          amount: "amount",
        },
      },
      {
        id: "contract-call",
        type: "moveCall",
        label: "Call Contract Function",
        data: {
          target: "0x2::coin::zero",
          arguments: [],
          typeArguments: ["0x2::sui::SUI"],
        },
      },
    ],
  },
  {
    id: "complex-workflow",
    name: "Complex Workflow",
    description: "Multi-step complex transaction workflow",
    steps: [
      {
        id: "workflow-init",
        type: "moveCall",
        label: "Initialize Workflow",
        data: {
          target: "0x2::coin::zero",
          arguments: [],
          typeArguments: ["0x2::sui::SUI"],
        },
      },
      {
        id: "workflow-split",
        type: "splitCoin",
        label: "Split for Workflow",
        data: {
          coin: "gas",
          amount: "amount",
        },
      },
      {
        id: "workflow-process",
        type: "moveCall",
        label: "Process Workflow",
        data: {
          target: "0x2::coin::zero",
          arguments: [],
          typeArguments: ["0x2::sui::SUI"],
        },
      },
      {
        id: "workflow-complete",
        type: "transferObjects",
        label: "Complete Workflow",
        data: {
          objects: ["workflow-split"],
          recipient: "recipient",
        },
      },
    ],
  },
  {
    id: "developer-demo",
    name: "Full Developer Demo",
    description: "Comprehensive PTB showcasing all features",
    steps: [
      {
        id: "demo-init",
        type: "moveCall",
        label: "Demo Initialization",
        data: {
          target: "0x2::coin::zero",
          arguments: [],
          typeArguments: ["0x2::sui::SUI"],
        },
      },
      {
        id: "demo-split-1",
        type: "splitCoin",
        label: "First Demo Split",
        data: {
          coin: "gas",
          amount: "amount",
        },
      },
      {
        id: "demo-split-2",
        type: "splitCoin",
        label: "Second Demo Split",
        data: {
          coin: "gas",
          amount: "amount",
        },
      },
      {
        id: "demo-call",
        type: "moveCall",
        label: "Demo Contract Call",
        data: {
          target: "0x2::coin::zero",
          arguments: [],
          typeArguments: ["0x2::sui::SUI"],
        },
      },
      {
        id: "demo-transfer",
        type: "transferObjects",
        label: "Demo Transfer",
        data: {
          objects: ["demo-split-1"],
          recipient: "recipient",
        },
      },
    ],
  },
]

export function createTransactionFromSteps(steps: PTBStep[], params: Record<string, any>): TransactionBlock {
  const tx = new TransactionBlock()
  const variables: Record<string, any> = {}

  // Set the sender address - this is crucial for OneChain transactions
  if (params.address) {
    tx.setSender(params.address)
  }

  // Set a reasonable gas budget for OneChain
  tx.setGasBudget(20000000)

  for (const step of steps) {
    try {
      switch (step.type) {
        case "setGasBudget":
          tx.setGasBudget(Number(step.data.budget))
          break

        case "splitCoin":
          // Use the new splitCoin method with proper argument conversion
          const splitAmount = params.amount || step.data.amount || "1000000000"
          const coinToSplit = step.data.coin === "gas" ? tx.gas : step.data.coin
          
          // Convert string amount to proper transaction argument
          const splitResult = tx.splitCoins(coinToSplit, [tx.pure.u64(splitAmount)])
          variables[step.id] = splitResult[0]
          break

        case "moveCall":
          const args = step.data.arguments?.map((arg: string) => {
            if (arg === "gas") return tx.gas
            if (arg === "amount") return tx.pure.u64(params.amount || "1000000000")
            if (variables[arg]) return variables[arg]
            // For other string arguments, treat as pure values
            if (typeof arg === "string" && arg.startsWith("0x")) {
              return tx.pure.address(arg)
            }
            return tx.pure.string(arg)
          }) || []

          const moveCallResult = tx.moveCall({
            target: step.data.target,
            arguments: args,
            typeArguments: step.data.typeArguments || [],
          })
          variables[step.id] = moveCallResult
          break

        case "transferObjects":
          const objects = step.data.objects.map((obj: string) => {
            if (variables[obj]) return variables[obj]
            return obj
          })
          
          const recipient = params.recipient || params.address
          if (!recipient) {
            throw new Error("No recipient address provided")
          }
          
          tx.transferObjects(objects, recipient)
          break

        case "assignVariable":
          variables[step.data.variable] = variables[step.data.value] || step.data.value
          break

        default:
          console.warn(`Unknown step type: ${step.type}`)
      }
    } catch (error) {
      console.error(`Error processing step ${step.id}:`, error)
      throw new Error(`Failed to process step "${step.label}": ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return tx
}
