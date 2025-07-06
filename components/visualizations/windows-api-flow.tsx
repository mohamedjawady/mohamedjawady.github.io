"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Play, RotateCcw, Code, Shield, Cpu, Database } from "lucide-react"

interface APIStep {
  id: number
  name: string
  description: string
  code: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  details: string[]
}

const apiSteps: APIStep[] = [
  {
    id: 1,
    name: "User Application",
    description: "Application calls Windows API function",
    code: `#include <windows.h>

HANDLE hFile = CreateFileW(
    L"C:\\\\temp\\\\test.txt",
    GENERIC_WRITE,
    0,
    NULL,
    CREATE_ALWAYS,
    FILE_ATTRIBUTE_NORMAL,
    NULL
);`,
    icon: Code,
    color: "bg-blue-500",
    details: [
      "High-level API call from user code",
      "Familiar function names and parameters",
      "Most commonly used by developers",
      "Easy to detect and monitor"
    ]
  },
  {
    id: 2,
    name: "Subsystem DLL",
    description: "kernel32.dll processes the request",
    code: `// Inside kernel32.dll
HANDLE WINAPI CreateFileW(
    LPCWSTR lpFileName,
    DWORD dwDesiredAccess,
    DWORD dwShareMode,
    LPSECURITY_ATTRIBUTES lpSecurityAttributes,
    DWORD dwCreationDisposition,
    DWORD dwFlagsAndAttributes,
    HANDLE hTemplateFile
) {
    // Parameter validation
    // Convert parameters for native API
    return NtCreateFile(...);
}`,
    icon: Database,
    color: "bg-green-500",
    details: [
      "Windows API wrapper functions",
      "Parameter validation and conversion",
      "Error handling and compatibility",
      "Can be hooked by security tools"
    ]
  },
  {
    id: 3,
    name: "Ntdll.dll",
    description: "Native API transition to kernel mode",
    code: `// Inside ntdll.dll
NTSTATUS NtCreateFile(
    PHANDLE FileHandle,
    ACCESS_MASK DesiredAccess,
    POBJECT_ATTRIBUTES ObjectAttributes,
    PIO_STATUS_BLOCK IoStatusBlock,
    PLARGE_INTEGER AllocationSize,
    ULONG FileAttributes,
    ULONG ShareAccess,
    ULONG CreateDisposition,
    ULONG CreateOptions,
    PVOID EaBuffer,
    ULONG EaLength
) {
    // Setup system call number
    mov eax, 0x55  ; NtCreateFile syscall number
    syscall        ; Transition to kernel
}`,
    icon: Shield,
    color: "bg-orange-500",
    details: [
      "Native API layer",
      "Direct interface to kernel",
      "Lower detection surface",
      "Preferred by advanced malware"
    ]
  },
  {
    id: 4,
    name: "System Call",
    description: "Transition from user mode to kernel mode",
    code: `; Assembly level transition
mov eax, 0x55       ; System call number for NtCreateFile
mov r10, rcx        ; Save first parameter
syscall             ; CPU instruction to enter kernel mode

; CPU automatically:
; - Switches to ring 0 (kernel mode)
; - Changes stack pointer
; - Jumps to kernel syscall handler`,
    icon: Cpu,
    color: "bg-purple-500",
    details: [
      "CPU privilege level change",
      "User mode → Kernel mode",
      "Hardware-level transition",
      "Cannot be intercepted in user mode"
    ]
  },
  {
    id: 5,
    name: "Kernel",
    description: "Kernel executes the requested operation",
    code: `// Kernel space (ntoskrnl.exe)
NTSTATUS NtCreateFile(/* parameters */) {
    // Validate object path
    // Check security permissions
    // Interact with file system driver
    // Allocate file object
    // Update file system metadata
    // Return handle to user mode
    
    return STATUS_SUCCESS;
}`,
    icon: Shield,
    color: "bg-red-500",
    details: [
      "Full system access",
      "Hardware interaction",
      "File system operations",
      "Memory management"
    ]
  }
]

export function WindowsAPIFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showDirectAPI, setShowDirectAPI] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  // Auto-scroll to current step
  const scrollToStep = (stepIndex: number) => {
    const container = scrollContainerRef.current
    const targetCard = cardRefs.current[stepIndex]
    
    if (container && targetCard) {
      const containerRect = container.getBoundingClientRect()
      const cardRect = targetCard.getBoundingClientRect()
      const containerScrollLeft = container.scrollLeft
      
      // Calculate the desired scroll position to center the card
      const cardCenter = cardRect.left - containerRect.left + containerScrollLeft + (cardRect.width / 2)
      const containerCenter = containerRect.width / 2
      const targetScrollLeft = cardCenter - containerCenter
      
      // Ensure we don't scroll beyond the boundaries
      const maxScrollLeft = container.scrollWidth - container.clientWidth
      const finalScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScrollLeft))
      
      container.scrollTo({
        left: finalScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  // Update scroll when currentStep changes
  useEffect(() => {
    if (isPlaying || currentStep > 0) {
      // Small delay to ensure DOM is updated before scrolling
      const timeoutId = setTimeout(() => scrollToStep(currentStep), 150)
      return () => clearTimeout(timeoutId)
    }
  }, [currentStep, showDirectAPI])

  const nextStep = () => {
    if (currentStep < apiSteps.length - 1) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
    } else {
      setIsPlaying(false)
    }
  }

  const startAnimation = () => {
    setIsPlaying(true)
    setCurrentStep(0)
    
    // Scroll to the beginning
    setTimeout(() => scrollToStep(0), 100)
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= apiSteps.length - 1) {
          clearInterval(interval)
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 2000)
  }

  const reset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    // Scroll back to the beginning
    setTimeout(() => scrollToStep(0), 100)
  }

  const handleStepClick = (index: number) => {
    const targetIndex = showDirectAPI ? index : index
    setCurrentStep(targetIndex)
    scrollToStep(targetIndex)
  }

  const handleToggleDirectAPI = () => {
    const newShowDirectAPI = !showDirectAPI
    setShowDirectAPI(newShowDirectAPI)
    
    // Reset to first step and scroll to beginning when toggling
    setCurrentStep(0)
    setTimeout(() => scrollToStep(0), 100)
  }

  const directAPISteps = apiSteps.filter(step => step.id >= 3) // Skip Windows API layers

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore how a simple API call travels from your application through multiple layers to reach the Windows kernel.
          Understanding this flow is crucial for malware development and evasion techniques.
        </p>
        
        <div className="flex justify-center gap-4">
          <Button 
            onClick={startAnimation} 
            disabled={isPlaying}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Animation
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={handleToggleDirectAPI} 
            variant={showDirectAPI ? "default" : "outline"}
          >
            {showDirectAPI ? "Show Full Flow" : "Show Direct Native API"}
          </Button>
        </div>
      </div>

      {/* API Flow Visualization */}
      <div className="relative">
        <div 
          className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800" 
          ref={scrollContainerRef}
        >
          <div className="flex flex-col xl:flex-row gap-4 justify-start items-center min-w-fit px-4 py-2">
            {(showDirectAPI ? directAPISteps : apiSteps).map((step, index) => {
              const isActive = showDirectAPI ? 
                currentStep >= (step.id - 3) : 
                currentStep >= index
              const isCurrent = showDirectAPI ? 
                currentStep === (step.id - 3) : 
                currentStep === index
              
              return (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <Card 
                    ref={(el) => { cardRefs.current[index] = el }}
                    className={`w-56 lg:w-64 transition-all duration-500 cursor-pointer ${
                      isCurrent ? 'ring-2 ring-blue-500 scale-105' : ''
                    } ${isActive ? 'opacity-100' : 'opacity-50'}`}
                    onClick={() => handleStepClick(index)}
                  >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <div className={`p-2 rounded-full ${step.color} text-white flex-shrink-0`}>
                        <step.icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{step.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                    <div className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                      <code className="whitespace-pre-wrap break-all">{step.code.length > 100 ? step.code.substring(0, 100) + '...' : step.code}</code>
                    </div>
                  </CardContent>
                </Card>
                
                {index < (showDirectAPI ? directAPISteps : apiSteps).length - 1 && (
                  <ChevronRight className={`mx-2 transition-colors duration-500 flex-shrink-0 ${
                    isActive ? 'text-blue-500' : 'text-muted-foreground'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
        </div>
      </div>

      {/* Step Details */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${(showDirectAPI ? directAPISteps : apiSteps)[currentStep]?.color} text-white`}>
              {(showDirectAPI ? directAPISteps : apiSteps)[currentStep]?.icon && 
                React.createElement((showDirectAPI ? directAPISteps : apiSteps)[currentStep].icon, { className: "w-4 h-4" })
              }
            </div>
            {(showDirectAPI ? directAPISteps : apiSteps)[currentStep]?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{(showDirectAPI ? directAPISteps : apiSteps)[currentStep]?.description}</p>
          
          <div>
            <h4 className="font-semibold mb-2">Key Points:</h4>
            <ul className="space-y-1">
              {(showDirectAPI ? directAPISteps : apiSteps)[currentStep]?.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-green-500 mt-1">•</span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Code Example:</h4>
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {(showDirectAPI ? directAPISteps : apiSteps)[currentStep]?.code}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Educational Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-300 text-sm">
              Why Malware Uses Direct Native API
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• <strong>Reduced Detection Surface:</strong> Fewer API calls to monitor</p>
            <p>• <strong>Bypass Hooks:</strong> Many security tools hook Windows API, not Native API</p>
            <p>• <strong>Direct Access:</strong> No parameter validation or conversion overhead</p>
            <p>• <strong>Stealth:</strong> Less "noisy" in API monitoring tools</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="text-orange-800 dark:text-orange-300 text-sm">
              Security Implications
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• <strong>EDR Evasion:</strong> Harder to detect direct syscalls</p>
            <p>• <strong>API Hooking Bypass:</strong> Many hooks target higher-level APIs</p>
            <p>• <strong>Behavioral Analysis:</strong> Unusual API patterns may indicate malware</p>
            <p>• <strong>Kernel Monitoring:</strong> Requires kernel-level detection mechanisms</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
