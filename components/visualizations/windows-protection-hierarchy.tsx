"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, User, Crown, Layers, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProtectionLevel {
  id: string
  name: string
  ring: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  borderColor: string
  description: string
  privileges: string[]
  limitations: string[]
}

const protectionLevels: ProtectionLevel[] = [
  {
    id: "admin",
    name: "Administrator Account",
    ring: "User Mode (Ring 3)",
    icon: User,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    description: "Standard administrative privileges",
    privileges: [
      "Install software",
      "Modify system settings",
      "Access most processes",
      "Read most files and registry"
    ],
    limitations: [
      "Cannot access PPL processes",
      "Cannot read protected memory",
      "Cannot inject into protected processes",
      "Blocked by kernel protection checks"
    ]
  },
  {
    id: "system",
    name: "SYSTEM Account",
    ring: "User Mode (Ring 3)",
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
    description: "Highest user-mode privilege level",
    privileges: [
      "Full control over user-mode processes",
      "SeDebugPrivilege by default",
      "Access to system resources",
      "Run Windows services"
    ],
    limitations: [
      "Still blocked by PPL protection",
      "Cannot bypass kernel enforcement",
      "Subject to same restrictions as Admin",
      "Requires kernel mode for protected access"
    ]
  },
  {
    id: "ppl",
    name: "Protected Process Light (PPL)",
    ring: "User Mode (Ring 3)",
    icon: Shield,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-400",
    description: "Kernel-enforced protection boundary",
    privileges: [
      "Protected from Admin/SYSTEM",
      "Only accessible by equal/higher signers",
      "Memory cannot be read",
      "Code injection blocked"
    ],
    limitations: [
      "Can be accessed by kernel drivers",
      "Requires proper signer certificates",
      "Subject to kernel debugging",
      "Vulnerable to BYOVD attacks"
    ]
  },
  {
    id: "kernel",
    name: "Windows Kernel",
    ring: "Kernel Mode (Ring 0)",
    icon: Lock,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-400",
    description: "Ultimate authority - enforces all protections",
    privileges: [
      "Complete system control",
      "Direct hardware access",
      "Enforces PPL boundaries",
      "Manages all protection levels"
    ],
    limitations: [
      "Requires signed drivers (UEFI Secure Boot)",
      "Subject to HVCI restrictions",
      "Monitored by security software",
      "Complexity increases attack surface"
    ]
  }
]

export function WindowsProtectionHierarchy() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>("ppl")
  const [showDetails, setShowDetails] = useState(true)

  const getSelectedLevelData = () => {
    return protectionLevels.find(level => level.id === selectedLevel)
  }

  return (
    <Card className="w-full my-8 border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-6 w-6" />
          Windows Protection Hierarchy
        </CardTitle>
        <CardDescription>
          Understanding privilege levels and protection boundaries. Click on any level to see details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Hierarchy */}
        <div className="space-y-2">
          {/* User Mode Ring 3 Header */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-sm font-mono">
              User Mode (Ring 3)
            </Badge>
            <span className="text-sm text-muted-foreground">
              Standard application privilege levels
            </span>
          </div>

          {/* User Mode Levels */}
          <div className="pl-4 border-l-4 border-muted space-y-2">
            {protectionLevels
              .filter(level => level.ring === "User Mode (Ring 3)")
              .map((level) => {
                const IconComponent = level.icon
                const isSelected = selectedLevel === level.id
                
                return (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`w-full text-left transition-all ${
                      isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                    }`}
                  >
                    <Card className={`${isSelected ? `border-2 ${level.borderColor} shadow-lg` : 'border hover:border-gray-300'}`}>
                      <CardContent className={`p-4 ${level.bgColor} ${isSelected ? 'bg-opacity-30' : 'bg-opacity-10'}`}>
                        <div className="flex items-center gap-3">
                          <IconComponent className={`h-6 w-6 ${level.color}`} />
                          <div className="flex-1">
                            <div className="font-semibold">{level.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {level.description}
                            </div>
                          </div>
                          {isSelected && (
                            <Badge variant="default">Selected</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                )
              })}
          </div>

          {/* Separation Line */}
          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 border-t-2 border-dashed border-gray-400"></div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-sm">Protection Boundary</span>
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex-1 border-t-2 border-dashed border-gray-400"></div>
          </div>

          {/* Kernel Mode Ring 0 Header */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="destructive" className="text-sm font-mono">
              Kernel Mode (Ring 0)
            </Badge>
            <span className="text-sm text-muted-foreground">
              Ultimate system authority
            </span>
          </div>

          {/* Kernel Mode Level */}
          <div className="pl-4 border-l-4 border-red-300 space-y-2">
            {protectionLevels
              .filter(level => level.ring === "Kernel Mode (Ring 0)")
              .map((level) => {
                const IconComponent = level.icon
                const isSelected = selectedLevel === level.id
                
                return (
                  <button
                    key={level.id}
                    onClick={() => setSelectedLevel(level.id)}
                    className={`w-full text-left transition-all ${
                      isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                    }`}
                  >
                    <Card className={`${isSelected ? `border-2 ${level.borderColor} shadow-lg` : 'border hover:border-gray-300'}`}>
                      <CardContent className={`p-4 ${level.bgColor} ${isSelected ? 'bg-opacity-30' : 'bg-opacity-10'}`}>
                        <div className="flex items-center gap-3">
                          <IconComponent className={`h-6 w-6 ${level.color}`} />
                          <div className="flex-1">
                            <div className="font-semibold">{level.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {level.description}
                            </div>
                          </div>
                          {isSelected && (
                            <Badge variant="destructive">Selected</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                )
              })}
          </div>
        </div>

        {/* Details Panel */}
        {selectedLevel && showDetails && (
          <Card className="border-2 border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {getSelectedLevelData()?.name} - Details
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  Hide Details
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  Privileges & Capabilities
                </h4>
                <ul className="space-y-1">
                  {getSelectedLevelData()?.privileges.map((privilege, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{privilege}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-red-600" />
                  Limitations & Restrictions
                </h4>
                <ul className="space-y-1">
                  {getSelectedLevelData()?.limitations.map((limitation, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-red-600 mt-1">✗</span>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {!showDetails && (
          <Button
            variant="outline"
            onClick={() => setShowDetails(true)}
            className="w-full"
          >
            Show Details
          </Button>
        )}

        {/* Key Insight */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-sm">Key Insight</p>
                <p className="text-sm text-muted-foreground">
                  The kernel enforces PPL protection at Ring 0, creating a security boundary that 
                  even Administrator and SYSTEM accounts cannot cross. This is why tools like Process Explorer 
                  fail to access protected processes—the kernel refuses to grant the necessary handle permissions, 
                  regardless of your user privileges.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}
