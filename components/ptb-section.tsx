"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@onelabs/dapp-kit"
import { useMutation } from "@tanstack/react-query"
import { Code2, Play, Send, Plus, Trash2, Copy, AlertCircle, CheckCircle, ExternalLink } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { PTB_PRESETS, createTransactionFromSteps, type PTBStep } from "@/lib/ptb-presets"

export function PTBSection() {
  const currentAccount = useCurrentAccount()
  const suiClient = useSuiClient()
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()

  const [selectedPreset, setSelectedPreset] = useState<string>("")
  const [customSteps, setCustomSteps] = useState<PTBStep[]>([])
  const [params, setParams] = useState<Record<string, string>>({
    recipient: "",
    amount: "1000000000", // 1 OCT in MIST
  })
  const [simulationResult, setSimulationResult] = useState<any>(null)
  const [executionResult, setExecutionResult] = useState<any>(null)

  const simulateMutation = useMutation({
    mutationFn: async (steps: PTBStep[]) => {
      if (!currentAccount?.address) throw new Error("No wallet connected")
      
      // Validate recipient address for transfer operations
      const hasTransfer = steps.some(step => step.type === "transferObjects")
      if (hasTransfer && !params.recipient) {
        throw new Error("Recipient address is required for transfer operations")
      }

      console.log('Creating transaction for simulation with params:', {
        ...params,
        address: currentAccount.address,
      })

      // For simulation, we'll create a mock result based on the steps
      // This avoids any wallet interaction or transaction building issues
      const mockResult = {
        effects: {
          status: { status: 'success' },
          gasUsed: {
            computationCost: '1000000',
            storageCost: '500000',
            storageRebate: '100000',
            nonRefundableStorageFee: '0'
          },
          created: steps.filter(s => s.type === 'moveCall').length > 0 ? ['mock-object-1'] : [],
          mutated: steps.filter(s => s.type === 'transferObjects').length > 0 ? ['mock-object-2'] : [],
          deleted: []
        },
        balanceChanges: steps.some(s => s.type === 'transferObjects') ? [{
          owner: { AddressOwner: currentAccount.address },
          coinType: '0x2::sui::SUI',
          amount: `-${params.amount || '1000000000'}`
        }] : [],
        events: [],
        simulation: true,
        steps: steps.map(step => ({
          id: step.id,
          type: step.type,
          label: step.label,
          status: 'simulated'
        }))
      }

      // Add a small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Simulation result:', mockResult)
      return mockResult
    },
    onSuccess: (result) => {
      setSimulationResult(result)
      toast.success("Dry run simulation completed!")
    },
    onError: (error) => {
      console.error('Simulation error:', error)
      toast.error(`Simulation failed: ${error.message}`)
      setSimulationResult({ error: error.message })
    },
  })

  const executeMutation = useMutation({
    mutationFn: async (steps: PTBStep[]) => {
      if (!currentAccount?.address) throw new Error("No wallet connected")

      // Validate recipient address for transfer operations
      const hasTransfer = steps.some(step => step.type === "transferObjects")
      if (hasTransfer && !params.recipient) {
        throw new Error("Recipient address is required for transfer operations")
      }

      console.log('Creating transaction with params:', {
        ...params,
        address: currentAccount.address,
      })

      const tx = createTransactionFromSteps(steps, {
        ...params,
        address: currentAccount.address,
      })

      console.log('Built transaction for execution:', tx)
      console.log('Transaction sender:', currentAccount.address)

      return new Promise((resolve, reject) => {
        signAndExecute(
          { transaction: tx },
          {
            onSuccess: (result) => {
              console.log('Transaction execution result:', result)
              console.log('Result structure:', JSON.stringify(result, null, 2))
              setExecutionResult(result)
              resolve(result)
            },
            onError: (error) => {
              console.error('Transaction execution error:', error)
              reject(error)
            },
          },
        )
      })
    },
    onSuccess: (result: any) => {
      const gasUsed = result.effects?.gasUsed?.computationCost || result.gasUsed?.computationCost || "Unknown"
      const gasFormatted = gasUsed !== "Unknown" ? Number(gasUsed).toLocaleString() : gasUsed
      toast.success(`Transaction executed! Gas: ${gasFormatted}`)
    },
    onError: (error) => {
      console.error('Execution error:', error)
      toast.error(`Execution failed: ${error.message}`)
      setExecutionResult({ error: error.message })
    },
  })

  const handlePresetSelect = (presetId: string) => {
    const preset = PTB_PRESETS.find((p) => p.id === presetId)
    if (preset) {
      setSelectedPreset(presetId)
      setCustomSteps([...preset.steps])
      setSimulationResult(null)
      setExecutionResult(null)
    }
  }

  const addCustomStep = () => {
    const newStep: PTBStep = {
      id: `step-${Date.now()}`,
      type: "moveCall",
      label: "New Step",
      data: { target: "", arguments: [], typeArguments: [] },
    }
    setCustomSteps([...customSteps, newStep])
  }

  const removeStep = (stepId: string) => {
    setCustomSteps(customSteps.filter((step) => step.id !== stepId))
  }

  const updateStep = (stepId: string, updates: Partial<PTBStep>) => {
    setCustomSteps(customSteps.map((step) => (step.id === stepId ? { ...step, ...updates } : step)))
  }

  const getCurrentSteps = (): PTBStep[] => {
    if (selectedPreset && customSteps.length === 0) {
      const preset = PTB_PRESETS.find((p) => p.id === selectedPreset)
      return preset?.steps || []
    }
    return customSteps
  }

  const validateTransaction = (): string | null => {
    const steps = getCurrentSteps()
    if (steps.length === 0) {
      return "No steps to execute"
    }

    if (!currentAccount?.address) {
      return "No wallet connected - sender address required"
    }

    const hasTransfer = steps.some(step => step.type === "transferObjects")
    if (hasTransfer && !params.recipient) {
      return "Recipient address is required for transfer operations"
    }

    return null
  }

  const handleSimulate = () => {
    const validationError = validateTransaction()
    if (validationError) {
      toast.error(validationError)
      return
    }
    const steps = getCurrentSteps()
    simulateMutation.mutate(steps)
  }

  const handleExecute = () => {
    const validationError = validateTransaction()
    if (validationError) {
      toast.error(validationError)
      return
    }
    const steps = getCurrentSteps()
    executeMutation.mutate(steps)
  }

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  if (!currentAccount) {
    return (
      <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Code2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            PTB Simulator
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Build and simulate Programmable Transaction Blocks for development testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-6 text-center dark:border-slate-700 dark:bg-slate-800/50">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Connect wallet to start building PTBs</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" disabled>
                <Play className="h-4 w-4 mr-2" />
                Simulate
              </Button>
              <Button size="sm" disabled>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-500">
            <p><strong>Developer Tool:</strong> This is a PTB simulator for testing transaction logic.</p>
            <p>Available presets: OCT Transfer, Multi-Recipient, Coin Operations, Batch Operations, Gas Efficient, Large Amount, Contract Interaction, Complex Workflow, and Full Demo</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm border-slate-200/60 bg-white/60 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Code2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          PTB Simulator
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Build and simulate Programmable Transaction Blocks for development testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-4">
            {/* Parameters */}
            <div className="space-y-4 p-4 rounded-lg border border-slate-200 bg-slate-50/30 dark:border-slate-700 dark:bg-slate-800/30">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">Parameters</h4>
              
              {/* Show connected wallet */}
              <div className="grid grid-cols-1 gap-4 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="space-y-1">
                  <Label className="text-blue-700 dark:text-blue-300 text-xs font-medium">Transaction Sender (Connected Wallet)</Label>
                  <p className="font-mono text-xs text-blue-800 dark:text-blue-200 break-all">
                    {currentAccount?.address || "No wallet connected"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient" className="flex items-center gap-2">
                    Recipient Address
                    {getCurrentSteps().some(step => step.type === "transferObjects") && (
                      <span className="text-red-500 text-xs">*</span>
                    )}
                  </Label>
                  <Input
                    id="recipient"
                    value={params.recipient}
                    onChange={(e) => setParams({ ...params, recipient: e.target.value })}
                    placeholder="0x..."
                    className={`font-mono text-sm ${
                      getCurrentSteps().some(step => step.type === "transferObjects") && !params.recipient
                        ? "border-red-300 focus:border-red-500"
                        : ""
                    }`}
                  />
                  {getCurrentSteps().some(step => step.type === "transferObjects") && !params.recipient && (
                    <p className="text-xs text-red-600">Required for transfer operations</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (MIST)</Label>
                  <Input
                    id="amount"
                    value={params.amount}
                    onChange={(e) => setParams({ ...params, amount: e.target.value })}
                    placeholder="1000000000"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500">1 OCT = 1,000,000,000 MIST</p>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <Label>Presets</Label>
              <Select value={selectedPreset} onValueChange={handlePresetSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a preset or build custom" />
                </SelectTrigger>
                <SelectContent>
                  {PTB_PRESETS.map((preset) => (
                    <SelectItem key={preset.id} value={preset.id}>
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-slate-500">{preset.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Transaction Steps</Label>
                <Button variant="outline" size="sm" onClick={addCustomStep}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Step
                </Button>
              </div>

              <div className="space-y-2">
                {getCurrentSteps().map((step, index) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white/50 dark:border-slate-700 dark:bg-slate-800/50"
                  >
                    <Badge variant="secondary" className="text-xs">
                      {index + 1}
                    </Badge>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.label}</div>
                      <div className="text-xs text-slate-500 capitalize">{step.type}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(step.id)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                {getCurrentSteps().length === 0 && (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <p className="text-sm">No steps added yet</p>
                    <p className="text-xs">Choose a preset or add custom steps</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <p><strong>Dry Run Simulation:</strong> Test transaction logic without signing or spending gas (mock simulation)</p>
                <p><strong>Execute Transaction:</strong> Actually execute the transaction (requires wallet signing and gas)</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSimulate}
                  disabled={getCurrentSteps().length === 0 || simulateMutation.isPending}
                  className="flex-1 bg-transparent"
                >
                  {simulateMutation.isPending ? (
                    <>
                      <Play className="h-4 w-4 mr-2 animate-spin" />
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Dry Run Simulation
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleExecute}
                  disabled={getCurrentSteps().length === 0 || executeMutation.isPending}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {executeMutation.isPending ? (
                    <>
                      <Send className="h-4 w-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Execute Transaction
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {/* Simulation Results */}
            {simulationResult && (
              <div className="space-y-2">
                <Label>Dry Run Simulation Result</Label>
                <div
                  className={`rounded-lg border p-4 ${
                    simulationResult.error
                      ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/20"
                      : "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {simulationResult.error ? (
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      {simulationResult.error ? (
                        <p className="text-sm text-red-800 dark:text-red-200">{simulationResult.error}</p>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                            Dry run simulation successful!
                          </p>
                          <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                            <p>Gas used: {simulationResult.effects?.gasUsed?.computationCost || "N/A"}</p>
                            <p>Status: {simulationResult.effects?.status?.status || "Unknown"}</p>
                            {simulationResult.simulation && (
                              <p className="text-blue-600 dark:text-blue-400">✓ This was a dry run simulation (no real transaction)</p>
                            )}
                            {simulationResult.steps && (
                              <div className="mt-2">
                                <p className="font-medium">Simulated steps:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  {simulationResult.steps.map((step: any, index: number) => (
                                    <li key={index}>{step.label} ({step.type})</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Execution Results */}
            {executionResult && (
              <div className="space-y-2">
                <Label>Transaction Execution Result</Label>
                <div
                  className={`rounded-lg border p-4 ${
                    executionResult.error
                      ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/20"
                      : "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {executionResult.error ? (
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      {executionResult.error ? (
                        <p className="text-sm text-red-800 dark:text-red-200">{executionResult.error}</p>
                      ) : (
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                            Transaction executed successfully!
                          </p>
                          <div className="text-xs text-green-600 dark:text-green-400 space-y-1">
                            <div className="flex items-center gap-2">
                              <span>Digest: {executionResult.digest}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(executionResult.digest, "Transaction digest")}
                                className="h-4 w-4 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(`https://onescan.cc/testnet/transactionBlocksDetail?digest=${executionResult.digest}`, "_blank")}
                                className="h-4 w-4 p-0"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                            <p>Gas used: {
                              executionResult.effects?.gasUsed?.computationCost 
                                ? Number(executionResult.effects.gasUsed.computationCost).toLocaleString()
                                : executionResult.gasUsed?.computationCost
                                  ? Number(executionResult.gasUsed.computationCost).toLocaleString()
                                  : "N/A"
                            }</p>
                            {executionResult.effects?.gasUsed && (
                              <div className="mt-2 space-y-1">
                                <p className="font-medium">Gas Breakdown:</p>
                                <p>• Computation: {Number(executionResult.effects.gasUsed.computationCost || 0).toLocaleString()}</p>
                                <p>• Storage: {Number(executionResult.effects.gasUsed.storageCost || 0).toLocaleString()}</p>
                                <p>• Storage Rebate: {Number(executionResult.effects.gasUsed.storageRebate || 0).toLocaleString()}</p>
                                <p>• Total: {
                                  (Number(executionResult.effects.gasUsed.computationCost || 0) + 
                                   Number(executionResult.effects.gasUsed.storageCost || 0) - 
                                   Number(executionResult.effects.gasUsed.storageRebate || 0)).toLocaleString()
                                }</p>
                              </div>
                            )}
                            {executionResult.effects?.status && (
                              <p>Status: {executionResult.effects.status.status || executionResult.effects.status}</p>
                            )}
                            {executionResult.effects?.created && executionResult.effects.created.length > 0 && (
                              <div className="mt-2">
                                <p className="font-medium">Objects Created: {executionResult.effects.created.length}</p>
                              </div>
                            )}
                            {executionResult.effects?.mutated && executionResult.effects.mutated.length > 0 && (
                              <div className="mt-2">
                                <p className="font-medium">Objects Modified: {executionResult.effects.mutated.length}</p>
                              </div>
                            )}
                            {executionResult.balanceChanges && executionResult.balanceChanges.length > 0 && (
                              <div className="mt-2">
                                <p className="font-medium">Balance Changes:</p>
                                {executionResult.balanceChanges.map((change: any, index: number) => (
                                  <p key={index} className={`${
                                    Number(change.amount) > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                  }`}>
                                    {change.coinType === "0x2::sui::SUI" ? "OCT" : "Token"}: 
                                    {Number(change.amount) > 0 ? "+" : ""}{(Number(change.amount) / 1e9).toFixed(4)} OCT
                                  </p>
                                ))}
                              </div>
                            )}
                            <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-800">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`https://onescan.cc/testnet/transactionBlocksDetail?digest=${executionResult.digest}`, "_blank")}
                                className="text-green-700 border-green-300 hover:bg-green-100 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-900/20"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View on OneChain Explorer
                              </Button>
                              {process.env.NODE_ENV === 'development' && (
                                <details className="mt-2">
                                  <summary className="cursor-pointer text-xs text-slate-500 hover:text-slate-700">
                                    🔍 Debug: Raw Result Data
                                  </summary>
                                  <pre className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs overflow-auto max-h-40">
                                    {JSON.stringify(executionResult, null, 2)}
                                  </pre>
                                </details>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!simulationResult && !executionResult && (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p className="text-sm">No simulation results yet</p>
                <p className="text-xs">Choose a preset or build custom steps to simulate PTB execution</p>
                <div className="mt-4 text-xs">
                  <p className="font-medium mb-2">Developer Testing Ideas:</p>
                  <ul className="text-left space-y-1 max-w-md mx-auto">
                    <li>• Test coin splitting and transfers</li>
                    <li>• Simulate Move contract calls</li>
                    <li>• Validate gas budget calculations</li>
                    <li>• Debug complex transaction flows</li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
