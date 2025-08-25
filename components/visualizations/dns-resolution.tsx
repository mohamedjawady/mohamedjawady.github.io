"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Globe, Server, Monitor, Database, ArrowRight, Clock, CheckCircle, AlertCircle, Wifi, Router, Cloud } from "lucide-react"

interface DNSStep {
  id: number
  title: string
  description: string
  component: 'client' | 'stub' | 'recursive' | 'root' | 'tld' | 'authoritative'
  query: string
  response?: string
  status: 'waiting' | 'active' | 'complete' | 'error'
}

interface DNSState {
  currentStep: number
  steps: DNSStep[]
  isAnimating: boolean
  selectedDomain: string
}

const componentStyles = {
  client: 'bg-blue-500 border-blue-600 text-white',
  stub: 'bg-green-500 border-green-600 text-white', 
  recursive: 'bg-purple-500 border-purple-600 text-white',
  root: 'bg-orange-500 border-orange-600 text-white',
  tld: 'bg-red-500 border-red-600 text-white',
  authoritative: 'bg-indigo-500 border-indigo-600 text-white'
}

const componentIcons = {
  client: Monitor,
  stub: Database,
  recursive: Router,
  root: Globe,
  tld: Cloud,
  authoritative: Server
}

const dnsComponents = [
  { 
    id: 'client', 
    name: 'Client Application', 
    description: 'Web browser requesting google.com',
    position: { x: 50, y: 400 },
    level: 0
  },
  { 
    id: 'stub', 
    name: 'Stub Resolver', 
    description: 'Local DNS client (OS level)',
    position: { x: 200, y: 400 },
    level: 1
  },
  { 
    id: 'recursive', 
    name: 'Recursive Resolver', 
    description: 'ISP DNS server (8.8.8.8)',
    position: { x: 400, y: 300 },
    level: 2
  },
  { 
    id: 'root', 
    name: 'Root Nameserver', 
    description: 'Root DNS server (.)', 
    ip: '198.41.0.4',
    position: { x: 600, y: 150 },
    level: 3
  },
  { 
    id: 'tld', 
    name: 'TLD Nameserver', 
    description: '.com registry server', 
    ip: '192.33.14.30',
    position: { x: 800, y: 150 },
    level: 4
  },
  { 
    id: 'authoritative', 
    name: 'Authoritative NS', 
    description: 'Google DNS server', 
    ip: '216.239.32.10',
    position: { x: 950, y: 300 },
    level: 5
  }
]

// Connection paths between components
const connections = [
  { from: 'client', to: 'stub', path: 'M 120 420 Q 150 420 170 420' },
  { from: 'stub', to: 'recursive', path: 'M 230 420 Q 280 380 370 320' },
  { from: 'recursive', to: 'root', path: 'M 430 280 Q 500 200 570 170' },
  { from: 'root', to: 'tld', path: 'M 630 170 Q 700 160 770 170' },
  { from: 'tld', to: 'authoritative', path: 'M 830 180 Q 880 220 920 280' },
]

const resolutionSteps = [
  {
    id: 1,
    title: "User Request",
    description: "User types google.com in browser",
    component: 'client' as const,
    query: "GET https://google.com",
    status: 'waiting' as const
  },
  {
    id: 2,
    title: "DNS Query Initiated",
    description: "Browser asks OS resolver for google.com IP",
    component: 'stub' as const,
    query: "A google.com?",
    status: 'waiting' as const
  },
  {
    id: 3,
    title: "Recursive Query",
    description: "OS forwards to configured DNS server",
    component: 'recursive' as const,
    query: "A google.com?",
    status: 'waiting' as const
  },
  {
    id: 4,
    title: "Root Server Query",
    description: "Query root server for .com nameservers",
    component: 'root' as const,
    query: "NS .com?",
    response: "Refer to .com TLD servers",
    status: 'waiting' as const
  },
  {
    id: 5,
    title: "TLD Server Query",
    description: "Query .com server for google.com nameservers",
    component: 'tld' as const,
    query: "NS google.com?",
    response: "Refer to Google nameservers",
    status: 'waiting' as const
  },
  {
    id: 6,
    title: "Authoritative Query",
    description: "Query Google's nameserver for IP address",
    component: 'authoritative' as const,
    query: "A google.com?",
    response: "172.217.31.174",
    status: 'waiting' as const
  },
  {
    id: 7,
    title: "Response Chain",
    description: "IP address returned through the chain",
    component: 'client' as const,
    query: "Connection established",
    response: "172.217.31.174",
    status: 'waiting' as const
  }
]

export function DNSResolution() {
  const [state, setState] = useState<DNSState>({
    currentStep: 0,
    steps: resolutionSteps,
    isAnimating: false,
    selectedDomain: 'google.com'
  })

  const startAnimation = () => {
    setState(prev => ({
      ...prev,
      isAnimating: true,
      currentStep: 0,
      steps: prev.steps.map(step => ({ ...step, status: 'waiting' }))
    }))
  }

  const resetAnimation = () => {
    setState(prev => ({
      ...prev,
      isAnimating: false,
      currentStep: 0,
      steps: prev.steps.map(step => ({ ...step, status: 'waiting' }))
    }))
  }

  useEffect(() => {
    if (state.isAnimating && state.currentStep < state.steps.length) {
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          currentStep: prev.currentStep + 1,
          steps: prev.steps.map((step, index) => ({
            ...step,
            status: index < prev.currentStep ? 'complete' : 
                   index === prev.currentStep ? 'active' : 'waiting'
          }))
        }))
      }, 2000)

      return () => clearTimeout(timer)
    } else if (state.currentStep >= state.steps.length) {
      setState(prev => ({ ...prev, isAnimating: false }))
    }
  }, [state.isAnimating, state.currentStep])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'active':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-blue-600" />
            Interactive DNS Resolution Network Graph
          </CardTitle>
          <div className="flex items-center gap-4">
            <Button 
              onClick={startAnimation} 
              disabled={state.isAnimating}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Resolution
            </Button>
            <Button 
              onClick={resetAnimation} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Badge variant="outline" className="ml-auto">
              Resolving: {state.selectedDomain}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Network Graph Visualization */}
          <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800 p-8 mb-8">
            <svg 
              viewBox="0 0 1000 500" 
              className="w-full h-96 overflow-visible"
              style={{ minHeight: '400px' }}
            >
              {/* Connection Lines */}
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.3 }} />
                  <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.3 }} />
                </linearGradient>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="#3b82f6"
                  />
                </marker>
              </defs>

              {connections.map((conn, index) => {
                const fromComp = dnsComponents.find(c => c.id === conn.from)
                const toComp = dnsComponents.find(c => c.id === conn.to)
                const isActive = state.steps[state.currentStep]?.component === conn.to && state.isAnimating
                const isComplete = state.steps.some(step => 
                  step.component === conn.to && step.status === 'complete'
                )
                
                return (
                  <g key={`connection-${index}`}>
                    <path
                      d={conn.path}
                      stroke={isActive ? '#3b82f6' : isComplete ? '#10b981' : '#e5e7eb'}
                      strokeWidth={isActive ? '4' : isComplete ? '3' : '2'}
                      fill="none"
                      markerEnd="url(#arrowhead)"
                      className={`transition-all duration-500 ${
                        isActive ? 'animate-pulse drop-shadow-lg' : ''
                      }`}
                      strokeDasharray={isActive ? '10,5' : 'none'}
                    />
                    {isActive && (
                      <circle r="4" fill="#3b82f6" className="animate-ping">
                        <animateMotion dur="2s" repeatCount="indefinite">
                          <mpath href={`#path-${index}`} />
                        </animateMotion>
                      </circle>
                    )}
                  </g>
                )
              })}

              {/* DNS Components as Nodes */}
              {dnsComponents.map((component) => {
                const Icon = componentIcons[component.id as keyof typeof componentIcons]
                const isActive = state.steps[state.currentStep]?.component === component.id
                const isComplete = state.steps.some(step => 
                  step.component === component.id && step.status === 'complete'
                )
                
                return (
                  <g key={component.id} transform={`translate(${component.position.x}, ${component.position.y})`}>
                    {/* Node Circle */}
                    <circle
                      r={40}
                      fill={isActive ? '#3b82f6' : isComplete ? '#10b981' : '#f8fafc'}
                      stroke={isActive ? '#1d4ed8' : isComplete ? '#059669' : '#cbd5e1'}
                      strokeWidth={isActive ? '4' : '2'}
                      className={`transition-all duration-500 ${
                        isActive ? 'animate-pulse drop-shadow-xl' : ''
                      }`}
                    />
                    
                    {/* Icon */}
                    <foreignObject x="-12" y="-12" width="24" height="24">
                      <Icon 
                        className={`w-6 h-6 ${
                          isActive || isComplete ? 'text-white' : 'text-slate-600'
                        }`} 
                      />
                    </foreignObject>
                    
                    {/* Label */}
                    <text
                      x="0"
                      y="60"
                      textAnchor="middle"
                      className="text-sm font-semibold fill-slate-700 dark:fill-slate-300"
                    >
                      {component.name}
                    </text>
                    
                    {component.ip && (
                      <text
                        x="0"
                        y="75"
                        textAnchor="middle"
                        className="text-xs fill-slate-500 dark:fill-slate-400"
                      >
                        {component.ip}
                      </text>
                    )}
                    
                    {/* Status Indicator */}
                    {(isActive || isComplete) && (
                      <circle
                        cx="30"
                        cy="-30"
                        r="8"
                        fill={isActive ? '#fbbf24' : '#10b981'}
                        className={isActive ? 'animate-pulse' : ''}
                      />
                    )}
                  </g>
                )
              })}

              {/* Current Query Display */}
              {state.isAnimating && state.currentStep < state.steps.length && (
                <g transform="translate(500, 50)">
                  <rect
                    x="-100"
                    y="-15"
                    width="200"
                    height="30"
                    rx="15"
                    fill="#1e293b"
                    fillOpacity="0.9"
                  />
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    className="text-sm font-mono fill-white"
                  >
                    {state.steps[state.currentStep]?.query || 'Processing...'}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Current Step Information */}
          {state.currentStep < state.steps.length && (
            <Card className="mb-6 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(state.steps[state.currentStep]?.status || 'waiting')}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-blue-600 dark:text-blue-400">
                      Step {state.currentStep + 1}: {state.steps[state.currentStep]?.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {state.steps[state.currentStep]?.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resolution Steps Timeline */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-4">Resolution Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {state.steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-500 ${
                    step.status === 'active' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-105' :
                    step.status === 'complete' ? 'border-green-500 bg-green-50 dark:bg-green-950/20' :
                    'border-gray-200 bg-gray-50 dark:bg-gray-800/20'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {getStatusIcon(step.status)}
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {step.id}
                      </Badge>
                      <span className="text-sm font-medium truncate">{step.title}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <Badge className={componentStyles[step.component]}>
                        {dnsComponents.find(c => c.id === step.component)?.name}
                      </Badge>
                    </div>
                    
                    {step.response && step.status === 'complete' && (
                      <div className="mt-1">
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-blue-600">
                          {step.response}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Information */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-600 mb-2">Query Types</h4>
                <ul className="text-sm space-y-1">
                  <li><code>A</code> - IPv4 address lookup</li>
                  <li><code>NS</code> - Nameserver delegation</li>
                  <li>Recursive resolution process</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-600 mb-2">Caching</h4>
                <ul className="text-sm space-y-1">
                  <li>Responses cached at each level</li>
                  <li>TTL determines cache duration</li>
                  <li>Reduces subsequent query time</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="p-4">
                <h4 className="font-semibold text-purple-600 mb-2">Security Notes</h4>
                <ul className="text-sm space-y-1">
                  <li>Each step creates log entries</li>
                  <li>Queries reveal communication intent</li>
                  <li>Monitor for suspicious patterns</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DNSResolution
