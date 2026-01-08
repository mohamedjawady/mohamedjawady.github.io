"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Terminal, Shield, Code, Wrench, FileCode, Search, ExternalLink, Info } from 'lucide-react'

export default function LOLBASCategories() {
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    {
      icon: Terminal,
      title: "Native Windows Utilities",
      technique: "T1218",
      secondaryTechniques: ["T1059.001", "T1047", "T1197"],
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      tools: [
        { name: "powershell.exe", description: "Scripting engine with .NET Framework access (T1059.001)", status: "Legacy", viability: "Noisy" },
        { name: "wmic.exe", description: "Windows Management Instrumentation CLI (T1047)", status: "Modern", viability: "High-Signal" },
        { name: "certutil.exe", description: "Certificate utility with download capabilities (T1105)", status: "Legacy", viability: "High-Signal" },
        { name: "bitsadmin.exe", description: "Background Intelligent Transfer Service admin (T1197)", status: "Unreliable", viability: "Moderate" },
        { name: "regsvr32.exe", description: "DLL registration and execution utility (T1218.010)", status: "Legacy", viability: "Noisy" },
        { name: "rundll32.exe", description: "DLL function launcher (T1218.011)", status: "Modern", viability: "High-Signal" }
      ]
    },
    {
      icon: Wrench,
      title: "Administration Tools",
      technique: "T1021",
      secondaryTechniques: ["T1053.005", "T1569.002"],
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      tools: [
        { name: "psexec.exe", description: "Sysinternals remote execution tool (T1569.002)", status: "Modern", viability: "High-Signal" },
        { name: "winrm", description: "PowerShell remoting framework (T1021.006)", status: "Modern", viability: "High-Signal" },
        { name: "schtasks.exe", description: "Scheduled task manager (T1053.005)", status: "Modern", viability: "High-Signal" },
        { name: "sc.exe", description: "Service control manager (T1569.002)", status: "Modern", viability: "High-Signal" },
        { name: "net.exe", description: "Network administration utility (T1070)", status: "Modern", viability: "High-Signal" }
      ]
    },
    {
      icon: Code,
      title: "Development Tools",
      technique: "T1127",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
      tools: [
        { name: "msbuild.exe", description: "Microsoft Build Engine (.NET compiler) (T1127.001)", status: "Modern", viability: "High-Signal" },
        { name: "csc.exe", description: "C# compiler", status: "Modern", viability: "High-Signal" },
        { name: "installutil.exe", description: ".NET installer utility (T1218.004)", status: "Legacy", viability: "Noisy" },
        { name: "regasm.exe", description: ".NET assembly registration (T1218.009)", status: "Legacy", viability: "Noisy" }
      ]
    },
    {
      icon: Shield,
      title: "Execution & Persistence Abuse",
      technique: "T1546",
      secondaryTechniques: ["T1546.015", "T1574.001"],
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      tools: [
        { name: "COM Hijacking", description: "Abusing per-user registration and elevated CLSIDs (T1546.015)", status: "Modern", viability: "Stealth" },
        { name: "DLL Side-Loading", description: "Leveraging signed OS binaries to load custom DLLs (T1574.002)", status: "Modern", viability: "Stealth" },
        { name: "mshta.exe", description: "HTML Application host (T1218.005)", status: "Unreliable", viability: "Noisy" }
      ]
    }
  ]

  const filteredCategories = categories.map(category => ({
    ...category,
    tools: category.tools.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.tools.length > 0)

  const resources = [
    { name: "LOLBAS Project", url: "https://lolbas-project.github.io/", description: "Windows Binaries and Scripts" },
    { name: "GTFOBins", url: "https://gtfobins.github.io/", description: "Unix Binaries Security Risks" },
    { name: "LOLDrivers", url: "https://www.loldrivers.io/", description: "Vulnerable Windows Drivers" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Modern': return 'text-emerald-400 border-emerald-400/30'
      case 'Legacy': return 'text-amber-400 border-amber-400/30'
      case 'Unreliable': return 'text-red-400 border-red-400/30'
      case 'Stealth': return 'text-cyan-400 border-cyan-400/30'
      default: return 'text-slate-400 border-slate-700'
    }
  }

  return (
    <div className="my-8 space-y-6">
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <FileCode className="h-6 w-6 text-cyan-400" />
                LOLBAS Intelligence (2026 Reality)
              </CardTitle>
              <CardDescription className="text-slate-300">
                Current viability and status of common binaries and techniques
              </CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search tools..."
                className="pl-9 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-cyan-500/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, idx) => {
              const Icon = category.icon
              return (
                <div key={idx} className={`border-2 ${category.borderColor} ${category.bgColor} rounded-lg p-4 transition-all duration-300`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.bgColor}`}>
                        <Icon className={`h-6 w-6 ${category.color}`} />
                      </div>
                      <h3 className={`text-xl font-bold ${category.color}`}>{category.title}</h3>
                    </div>
                    {category.technique && (
                      <Badge variant="outline" className="text-[10px] text-slate-500 border-slate-700 uppercase tracking-widest font-bold">
                        {category.technique}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    {category.tools.map((tool, toolIdx) => (
                      <div key={toolIdx} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700">
                        <Terminal className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <code className="text-cyan-300 font-mono text-sm">{tool.name}</code>
                            {tool.status && (
                              <Badge variant="outline" className={`text-[9px] uppercase tracking-tighter ${getStatusColor(tool.status)}`}>
                                {tool.status}
                              </Badge>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm mt-1">{tool.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="outline" className={`text-xs ${tool.viability === 'Stealth' ? 'text-cyan-400 border-cyan-400/30' : 'text-slate-500 border-slate-700'} flex-shrink-0`}>
                            {tool.viability}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12 bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-700">
              <Search className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No tools found matching "{searchTerm}"</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-amber-500/10 border-2 border-amber-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-300 font-semibold mb-2 text-sm">Detection Challenge</p>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Legitimate tools with Microsoft signatures are difficult to detect via signatures.
                    Behavioral analysis and baseline deviation are critical.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-cyan-500/10 border-2 border-cyan-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-cyan-300 font-semibold mb-2 text-sm">External Resources</p>
                  <div className="flex flex-wrap gap-2">
                    {resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 rounded-full border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-900 text-[10px] font-medium text-slate-300 hover:text-cyan-300 transition-all duration-300"
                        title={res.description}
                      >
                        {res.name}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
