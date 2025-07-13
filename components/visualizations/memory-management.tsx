"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, HardDrive, Shield, Lock, Unlock, AlertTriangle } from "lucide-react"

interface MemoryPage {
  id: number
  address: string
  state: 'free' | 'reserved' | 'committed'
  protection: 'noaccess' | 'readonly' | 'readwrite' | 'execute_read' | 'execute_readwrite'
  content?: string
}

interface MemoryState {
  pages: MemoryPage[]
  currentStep: number
  isAnimating: boolean
}

const protectionColors = {
  noaccess: 'bg-red-500',
  readonly: 'bg-blue-500', 
  readwrite: 'bg-green-500',
  execute_read: 'bg-purple-500',
  execute_readwrite: 'bg-orange-500'
}

const stateColors = {
  free: 'bg-gray-300 border-gray-400',
  reserved: 'bg-yellow-300 border-yellow-500',
  committed: 'bg-blue-500 border-blue-700'
}

const protectionIcons = {
  noaccess: AlertTriangle,
  readonly: Lock,
  readwrite: Unlock,
  execute_read: Shield,
  execute_readwrite: HardDrive
}

const allocationSteps = [
  {
    title: "Initial State",
    description: "Virtual address space with free pages",
    action: "reset"
  },
  {
    title: "Reserve Memory",
    description: "VirtualAlloc with MEM_RESERVE",
    action: "reserve",
    code: `VirtualAlloc(
  NULL,           // Let system choose address
  0x10000,        // 64KB
  MEM_RESERVE,    // Reserve only
  PAGE_NOACCESS   // No access yet
);`
  },
  {
    title: "Commit Pages",
    description: "VirtualAlloc with MEM_COMMIT",
    action: "commit",
    code: `VirtualAlloc(
  pReserved,      // Use reserved address
  0x8000,         // 32KB
  MEM_COMMIT,     // Commit physical storage
  PAGE_READWRITE  // Read/write access
);`
  },
  {
    title: "Change Protection",
    description: "VirtualProtect to modify permissions",
    action: "protect",
    code: `VirtualProtect(
  pCommitted,         // Address
  0x4000,             // 16KB
  PAGE_EXECUTE_READ,  // New protection
  &oldProtect         // Previous protection
);`
  },
  {
    title: "Dangerous Protection",
    description: "PAGE_EXECUTE_READWRITE (suspicious!)",
    action: "dangerous",
    code: `VirtualProtect(
  pCommitted,             // Address
  0x2000,                 // 8KB
  PAGE_EXECUTE_READWRITE, // RWX = Suspicious!
  &oldProtect             // Previous protection
);`
  }
]

export function MemoryManagement() {
  const [memoryState, setMemoryState] = useState<MemoryState>({
    pages: [],
    currentStep: 0,
    isAnimating: false
  })

  const initializeMemory = () => {
    const pages: MemoryPage[] = []
    for (let i = 0; i < 16; i++) {
      pages.push({
        id: i,
        address: `0x${(0x10000000 + i * 0x1000).toString(16).toUpperCase()}`,
        state: 'free',
        protection: 'noaccess'
      })
    }
    setMemoryState({
      pages,
      currentStep: 0,
      isAnimating: false
    })
  }

  useEffect(() => {
    initializeMemory()
  }, [])

  const executeStep = async (stepIndex: number) => {
    if (memoryState.isAnimating) return
    
    setMemoryState(prev => ({ ...prev, isAnimating: true }))
    
    const step = allocationSteps[stepIndex]
    let newPages = [...memoryState.pages]

    switch (step.action) {
      case 'reset':
        initializeMemory()
        break
        
      case 'reserve':
        // Reserve pages 4-11 (8 pages = 32KB)
        for (let i = 4; i < 12; i++) {
          newPages[i] = {
            ...newPages[i],
            state: 'reserved',
            protection: 'noaccess'
          }
        }
        break
        
      case 'commit':
        // Commit pages 4-7 (4 pages = 16KB)
        for (let i = 4; i < 8; i++) {
          newPages[i] = {
            ...newPages[i],
            state: 'committed',
            protection: 'readwrite',
            content: 'Data'
          }
        }
        break
        
      case 'protect':
        // Change protection of pages 4-5 to execute_read
        for (let i = 4; i < 6; i++) {
          newPages[i] = {
            ...newPages[i],
            protection: 'execute_read',
            content: 'Code'
          }
        }
        break
        
      case 'dangerous':
        // Change page 4 to execute_readwrite (dangerous!)
        newPages[4] = {
          ...newPages[4],
          protection: 'execute_readwrite',
          content: 'RWX!'
        }
        break
    }

    await new Promise(resolve => setTimeout(resolve, 800))
    
    setMemoryState({
      pages: newPages,
      currentStep: stepIndex,
      isAnimating: false
    })
  }

  const nextStep = () => {
    if (memoryState.currentStep < allocationSteps.length - 1) {
      executeStep(memoryState.currentStep + 1)
    }
  }

  const reset = () => {
    executeStep(0)
  }

  const currentStepData = allocationSteps[memoryState.currentStep]

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Windows Memory Management Visualization
          </CardTitle>
          <p className="text-muted-foreground">
            Interactive demonstration of virtual memory allocation, commitment, and protection changes
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Control Panel */}
            <div className="flex items-center gap-4">
              <Button 
                onClick={nextStep} 
                disabled={memoryState.isAnimating || memoryState.currentStep >= allocationSteps.length - 1}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Next Step
              </Button>
              <Button 
                onClick={reset} 
                variant="outline"
                disabled={memoryState.isAnimating}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
              <div className="text-sm text-muted-foreground">
                Step {memoryState.currentStep + 1} of {allocationSteps.length}
              </div>
            </div>

            {/* Current Step Info */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <h3 className="font-semibold text-lg">{currentStepData.title}</h3>
                    <p className="text-muted-foreground">{currentStepData.description}</p>
                  </div>
                  {currentStepData.code && (
                    <div className="ml-4 bg-black rounded p-3 text-sm font-mono text-green-400 max-w-md">
                      <pre>{currentStepData.code}</pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Memory Layout Visualization */}
            <div className="space-y-4">
              <h3 className="font-semibold">Virtual Address Space (64KB region)</h3>
              <div className="grid grid-cols-8 gap-2">
                {memoryState.pages.map(page => {
                  const ProtectionIcon = protectionIcons[page.protection]
                  return (
                    <div
                      key={page.id}
                      className={`
                        relative border-2 rounded-lg p-2 transition-all duration-500
                        ${stateColors[page.state]}
                        ${memoryState.isAnimating ? 'animate-pulse' : ''}
                      `}
                    >
                      <div className="text-[10px] font-mono mb-1 text-gray-800 dark:text-gray-800">{page.address}</div>
                      <div className="text-[10px] font-semibold mb-1 capitalize text-gray-800 dark:text-gray-800">{page.state}</div>
                      
                      {page.state === 'committed' && (
                        <div className="space-y-1">
                          <div className={`w-full h-5 rounded flex items-center justify-center text-[9px] text-gray-800 dark:text-gray-800 ${protectionColors[page.protection]}`}>
                            <ProtectionIcon className="w-2 h-2 mr-1" />
                            {page.content}
                          </div>
                          <div className="text-[9px] text-center text-gray-800 dark:text-gray-800">{page.protection.replace('_', '-')}</div>
                        </div>
                      )}
                      
                      {page.protection === 'execute_readwrite' && (
                        <div className="absolute -top-1 -right-1">
                          <AlertTriangle className="w-4 h-4 text-red-500 fill-yellow-300" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Page States</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-300 border border-gray-400"></div>
                    <span className="text-sm">Free - Available for allocation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-yellow-300 border border-yellow-500"></div>
                    <span className="text-sm">Reserved - Allocated but no physical storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500 border border-blue-700"></div>
                    <span className="text-sm">Committed - Physical storage assigned</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Protection Types</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-500"></div>
                    <span className="text-sm">No Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500"></div>
                    <span className="text-sm">Read Only</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span className="text-sm">Read Write</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-purple-500"></div>
                    <span className="text-sm">Execute Read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-orange-500 relative">
                      <AlertTriangle className="w-3 h-3 text-red-500 absolute -top-1 -right-1" />
                    </div>
                    <span className="text-sm">Execute Read Write (Suspicious!)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Warning */}
            {memoryState.currentStep === 4 && (
              <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200">Security Alert</h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        PAGE_EXECUTE_READWRITE is highly suspicious! Memory that is both writable and executable 
                        enables shellcode injection and is commonly flagged by security solutions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
