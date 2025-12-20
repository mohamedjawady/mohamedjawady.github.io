"use client"

import React, { useState } from 'react'
import { Lock, Unlock, Shield, AlertTriangle, ArrowRight, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const ProtectedProcessBypass = () => {
    const [step, setStep] = useState(0)

    // Simulation Steps
    // 0: Initial State (Protected)
    // 1: Attack Driver Loaded
    // 2: Locate EPROCESS
    // 3: Patch PPL Bit
    // 4: Access Granted

    const reset = () => setStep(0)
    const next = () => setStep((s: number) => Math.min(s + 1, 4))

    const getStepDescription = (s: number) => {
        switch (s) {
            case 0: return "Initial State: LSASS is running as PPL. The Kernel (ObOpenObjectByPointer) blocks access from user mode."
            case 1: return "Step 1: Load Vulnerable/Malicious Kernel Driver. This grants Ring 0 code execution."
            case 2: return "Step 2: Locate target EPROCESS structure in kernel memory (by PID or name)."
            case 3: return "Step 3: Direct Kernel Object Manipulation (DKOM). Turn off the 'Protection' bit."
            case 4: return "Step 4: Bypass Complete. The kernel now sees a standard process. Mimikatz can open handle."
            default: return ""
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 p-4">
            <Card className="bg-slate-900 border-slate-800 text-slate-100 shadow-xl">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <Shield className={step < 3 ? "text-emerald-400" : "text-red-400"} />
                                Protected Process Bypass Simulation
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Visualizing Direct Kernel Object Manipulation (DKOM) against PPL
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={reset}
                                disabled={step === 0}
                                className="border-slate-700 hover:bg-slate-800"
                            >
                                Reset
                            </Button>
                            <Button
                                onClick={next}
                                disabled={step === 4}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {step === 4 ? "Compromised" : "Next Step"}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-8">

                    {/* Main Visualization Area */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[300px]">

                        {/* Left: Attacker */}
                        <div className={`p-4 rounded-lg border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 relative
              ${step >= 4 ? "border-emerald-500 bg-emerald-950/20" : "border-slate-700 bg-slate-800/50"}
            `}>
                            <div className="text-sm font-mono text-slate-400 absolute top-2 left-2">User Mode</div>
                            <div className="p-3 bg-slate-800 rounded-lg shadow-lg border border-slate-600">
                                <div className="font-bold text-red-400">Mimikatz.exe</div>
                                <div className="text-xs text-slate-400 font-mono">PID: 666</div>
                                <div className="text-xs text-slate-500 mt-1">SeDebugPrivilege: ON</div>
                            </div>

                            {step === 4 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-sm">
                                    <div className="text-emerald-400 font-bold flex flex-col items-center animate-in zoom-in">
                                        <Unlock className="w-8 h-8 mb-2" />
                                        HANDLE ACQUIRED
                                        <span className="text-xs text-emerald-600 font-mono">0x1F0FFF (All Access)</span>
                                    </div>
                                </div>
                            )}

                            {step < 4 && (
                                <div className="text-xs text-red-400 font-mono mt-4">
                                    Ticket Request: BLOCKED
                                </div>
                            )}
                        </div>

                        {/* Middle: Kernel Barrier */}
                        <div className="flex flex-col items-center justify-center p-4 relative">
                            <div className="text-sm font-mono text-slate-400 absolute top-2">Kernel Mode (Ring 0)</div>

                            {/* The Gatekeeper */}
                            <div className={`
                 w-2 h-full absolute py-8 transition-colors duration-500
                 ${step >= 3 ? "bg-red-500/20" : "bg-blue-500/20"}
               `}></div>

                            {/* Access Check Logic */}
                            <div className={`
                 z-10 p-4 rounded-lg border transition-all duration-500 text-center w-full
                 ${step >= 3 ? "bg-red-950/50 border-red-500/50" : "bg-blue-950/50 border-blue-500/50"}
               `}>
                                <div className="text-sm font-bold mb-2">ObOpenObjectByPointer</div>
                                {step < 3 ? (
                                    <div className="text-xs font-mono text-slate-300">
                                        if (Target.PPL &gt; Caller.PPL)<br />
                                        &nbsp;&nbsp;return STATUS_ACCESS_DENIED;
                                    </div>
                                ) : (
                                    <div className="text-xs font-mono text-red-300">
                                        if (Target.PPL &gt; Caller.PPL)<br />
                                        &nbsp;&nbsp;// Target.PPL is 0!<br />
                                        &nbsp;&nbsp;return STATUS_SUCCESS;
                                    </div>
                                )}
                            </div>

                            {/* The Driver Injection */}
                            {step >= 1 && (
                                <div className="mt-8 z-10 animate-in slide-in-from-left fade-in duration-500">
                                    <div className={`p-2 rounded border border-orange-500 bg-orange-950/80 text-orange-200 text-xs shadow-xl
                       ${step === 2 ? "translate-y-8" : ""}
                       ${step === 3 ? "translate-x-32" : ""}
                       transition-transform duration-1000
                    `}>
                                        <div className="flex items-center gap-2 font-bold">
                                            <AlertTriangle className="w-3 h-3" />
                                            EvilDriver.sys
                                        </div>
                                        {step === 1 && "Loaded via SC Manager"}
                                        {step === 2 && "Scanning for EPROCESS..."}
                                        {step === 3 && "PATCHING MEMORY..."}
                                        {step === 4 && "Patch Applied."}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Right: Target */}
                        <div className={`p-4 rounded-lg border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 relative
               ${step >= 3 ? "border-red-500/50" : "border-emerald-500/50"}
            `}>
                            <div className="text-sm font-mono text-slate-400 absolute top-2 right-2">Target Process</div>
                            <div className="p-3 bg-slate-800 rounded-lg shadow-lg border border-slate-600 w-40">
                                <div className="font-bold text-blue-400">lsass.exe</div>
                                <div className="text-xs text-slate-400 font-mono">PID: 442</div>

                                {/* EPROCESS Structure Visualization */}
                                <div className="mt-3 pt-3 border-t border-slate-700">
                                    <div className="text-[10px] text-slate-500 uppercase font-bold text-center mb-1">EPROCESS Structure</div>
                                    <div className={`
                    text-xs font-mono p-1 rounded text-center transition-colors duration-500
                    ${step < 3 ? "bg-emerald-900 text-emerald-200" : "bg-red-900 text-red-200 line-through"}
                  `}>
                                        Protection: PPL-WinTcb
                                    </div>
                                    {step >= 3 && (
                                        <div className="text-xs font-mono p-1 rounded text-center bg-slate-900 text-slate-400 mt-1 animate-in zoom-in">
                                            Protection: None
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 min-h-[80px] flex items-center">
                        <p className="text-slate-300 text-sm font-mono leading-relaxed">
                            <span className="text-blue-500 mr-2">root@kernel:~$</span>
                            {getStepDescription(step)}
                        </p>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
