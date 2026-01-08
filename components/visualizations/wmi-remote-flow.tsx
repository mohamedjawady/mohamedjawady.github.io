"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Server,
    Monitor,
    ArrowRight,
    Activity,
    ShieldAlert,
    ShieldCheck,
    Terminal,
    Zap,
    Lock,
    Network,
    Cpu,
    CornerDownRight,
    Clock,
    Search,
    AlertTriangle
} from 'lucide-react'

export function WMIRemoteFlow() {
    const [activeMode, setActiveMode] = useState<'legitimate' | 'malicious'>('legitimate')
    const [isAnimating, setIsAnimating] = useState(false)
    const [animationStep, setAnimationStep] = useState(0)

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (isAnimating) {
            timer = setInterval(() => {
                setAnimationStep((prev) => (prev + 1) % 4)
            }, 1500)
        } else {
            setAnimationStep(0)
        }
        return () => clearInterval(timer)
    }, [isAnimating])

    const toggleAnimation = () => setIsAnimating(!isAnimating)

    const processTree = {
        legitimate: [
            { id: 'svchost', name: 'svchost.exe (DCOM)', type: 'system', description: 'RPC/DCOM Service host', icon: Cpu },
            { id: 'wmiprvse', name: 'WmiPrvSE.exe', type: 'system', description: 'WMI Provider Host (Worker)', icon: Server },
            { id: 'powershell', name: 'powershell.exe', type: 'admin', description: 'Check-SystemUpdate.ps1', icon: Terminal }
        ],
        malicious: [
            { id: 'word', name: 'WINWORD.EXE', type: 'malicious', description: 'Malicious Office Document', icon: Monitor },
            { id: 'wmiprvse', name: 'WmiPrvSE.exe', type: 'system', description: 'WMI Provider Host (Weaponized)', icon: Server },
            { id: 'cmd', name: 'cmd.exe', type: 'malicious', description: 'Ghost Execution', icon: Terminal },
            { id: 'ps_enc', name: 'powershell.exe', type: 'malicious', description: '-enc [base64_payload]', icon: Zap }
        ]
    }

    return (
        <Card className="w-full bg-slate-950 border-slate-800 text-slate-200 overflow-hidden">
            <CardHeader className="border-b border-slate-800/50 bg-slate-900/30">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Network className="h-5 w-5 text-blue-400" />
                            WMI Remote Flow & Behavioral Anomaly
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Visualizing Lateral Movement and Process Ancestry Detection
                        </CardDescription>
                    </div>
                    <Tabs value={activeMode} onValueChange={(v) => setActiveMode(v as any)} className="bg-slate-950/50 p-1 rounded-lg border border-slate-800">
                        <TabsList className="bg-transparent gap-1">
                            <TabsTrigger value="legitimate" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                                <ShieldCheck className="w-3 h-3 mr-1" /> Legitimate
                            </TabsTrigger>
                            <TabsTrigger value="malicious" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                                <ShieldAlert className="w-3 h-3 mr-1" /> Malicious
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </CardHeader>

            <CardContent className="p-6 space-y-8">
                {/* Section 1: Network Flow */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">RPC / DCOM Communication Flow</h4>
                        <button
                            onClick={toggleAnimation}
                            className={`text-xs px-3 py-1 rounded-full border transition-all ${isAnimating
                                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {isAnimating ? 'Stop Animation' : 'Animate Flow'}
                        </button>
                    </div>

                    <div className="relative h-32 flex items-center justify-between px-12 bg-slate-900/40 rounded-xl border border-slate-800/50">
                        {/* Attacker / Source */}
                        <div className="z-10 flex flex-col items-center gap-2">
                            <div className={`p-4 rounded-2xl border ${activeMode === 'malicious' ? 'bg-red-500/10 border-red-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
                                <Monitor className={`h-8 w-8 ${activeMode === 'malicious' ? 'text-red-400' : 'text-blue-400'}`} />
                            </div>
                            <span className="text-xs font-mono">{activeMode === 'malicious' ? 'Attacker-PC (10.0.0.5)' : 'Admin-Station'}</span>
                        </div>

                        {/* Network Path */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-full max-w-md h-px bg-slate-800 relative">
                                <AnimatePresence>
                                    {isAnimating && (
                                        <motion.div
                                            initial={{ left: "0%" }}
                                            animate={{ left: "100%" }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-1/2 -translate-y-1/2"
                                        >
                                            <div className={`w-3 h-3 rounded-full blur-sm ${activeMode === 'malicious' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                            <div className={`absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 rounded-full opacity-20 ${activeMode === 'malicious' ? 'bg-red-400' : 'bg-blue-400'}`} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Port Indicators */}
                                <div className="absolute top-2 left-1/4 -translate-x-1/2 flex flex-col items-center gap-1">
                                    <Badge variant="outline" className="text-[10px] bg-slate-950/80 border-slate-700 px-1 py-0 h-4 leading-none">TCP 135</Badge>
                                    <span className="text-[10px] text-slate-500">RPC Endpoint Mapper</span>
                                </div>
                                <div className="absolute top-2 right-1/4 translate-x-1/2 flex flex-col items-center gap-1">
                                    <Badge variant="outline" className="text-[10px] bg-slate-950/80 border-slate-700 px-1 py-0 h-4 leading-none">TCP 49152+</Badge>
                                    <span className="text-[10px] text-slate-500">Dynamic DCOM Port</span>
                                </div>
                            </div>
                        </div>

                        {/* Target Server */}
                        <div className="z-10 flex flex-col items-center gap-2">
                            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                                <Server className="h-8 w-8 text-slate-400" />
                            </div>
                            <span className="text-xs font-mono">DC-PROD-01 (10.0.0.100)</span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Process Ancestry */}
                <div className="space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500 px-4">Behavioral Anomaly: Process Ancestry (Event ID 1)</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Ancestry Legend/Summary */}
                        <div className="space-y-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
                            <div className="flex items-center gap-2 text-sm">
                                <Search className="h-4 w-4 text-blue-400" />
                                <span className="font-semibold text-slate-300">Contextual Detection</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                WMI activity itself is common, but the <strong>Parent Process</strong> of <code>WmiPrvSE.exe</code> provides critical context. Legitimate management tools use standard system service hosts, while attackers often pivot from user-space applications.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-[11px]">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-slate-300 font-mono">Expected:</span>
                                    <span className="text-slate-500 font-mono italic">svchost.exe (RPCSS)</span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px]">
                                    <div className="w-2 h-2 rounded-full bg-red-500" />
                                    <span className="text-slate-300 font-mono">Anomaly:</span>
                                    <span className="text-slate-500 font-mono italic">WINWORD.EXE, EXCEL.EXE</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Tree */}
                        <div className="relative p-4 rounded-xl bg-slate-900/60 border border-slate-800/50 flex flex-col gap-3 min-h-[220px]">
                            {processTree[activeMode].map((node, index) => (
                                <motion.div
                                    key={node.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    style={{ marginLeft: `${index * 24}px` }}
                                    className="flex items-center gap-3"
                                >
                                    {index > 0 && <CornerDownRight className="h-4 w-4 text-slate-700" />}
                                    <div className={`flex flex-1 items-center justify-between p-2 rounded-lg border ${node.type === 'malicious'
                                            ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                                            : 'bg-slate-800/50 border-slate-700'
                                        }`}>
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <node.icon className={`h-4 w-4 shrink-0 ${node.type === 'malicious' ? 'text-red-400' : 'text-slate-400'}`} />
                                            <div className="flex flex-col">
                                                <span className={`text-[11px] font-mono leading-tight truncate ${node.type === 'malicious' ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                                                    {node.name}
                                                </span>
                                                <span className="text-[10px] text-slate-500 leading-tight truncate">
                                                    {node.description}
                                                </span>
                                            </div>
                                        </div>
                                        {node.type === 'malicious' && (
                                            <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/20 text-[9px] uppercase hover:text-red-500 px-1 py-0 h-4 border-none">
                                                SUSPICIOUS
                                            </Badge>
                                        )}
                                    </div>
                                </motion.div>
                            ))}

                            {activeMode === 'malicious' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute bottom-2 right-2"
                                >
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 border border-red-500/30">
                                        <AlertTriangle className="h-3 w-3 text-red-500 animate-pulse" />
                                        <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">Behavioral Alert Generated</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section 3: Mitigation/Detection Tips */}
                <div className={`p-4 rounded-xl border transition-colors ${activeMode === 'malicious'
                        ? 'bg-red-500/5 border-red-500/20'
                        : 'bg-slate-900/30 border-slate-800'
                    }`}>
                    <div className="flex items-start gap-3">
                        <div className={`mt-1 p-2 rounded-lg ${activeMode === 'malicious' ? 'bg-red-500/10' : 'bg-slate-800'}`}>
                            <ShieldAlert className={`h-5 w-5 ${activeMode === 'malicious' ? 'text-red-400' : 'text-slate-400'}`} />
                        </div>
                        <div className="space-y-1">
                            <h5 className="text-sm font-bold text-slate-200">
                                {activeMode === 'malicious' ? 'Defense Tip: WMI Parent Process Control' : 'Normal Operation Baseline'}
                            </h5>
                            <p className="text-xs text-slate-400">
                                {activeMode === 'malicious'
                                    ? "Detect when WmiPrvSE.exe is spawned by anything other than RPCSS (svchost.exe). This typically indicates an attacker pivoting from a compromised application or console to achieve execution."
                                    : "In standard administration, WmiPrvSE.exe is a child of the RPC Service host. Establishing this baseline is the first step in being able to detect malicious WMI lateral movement."
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
