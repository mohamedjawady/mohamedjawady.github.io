"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertTriangle, ShieldCheck, Search, Database, Cpu } from "lucide-react"

export function ProcessMemoryMap() {
    const [injected, setInjected] = useState(false)
    const [spoofed, setSpoofed] = useState(false)
    const [scanning, setScanning] = useState(false)

    const toggleInjection = (checked: boolean) => {
        setInjected(checked)
        if (!checked) setSpoofed(false) // Can't spoof if not injected
    }

    const getStackStatus = () => {
        if (!injected) return { status: "Legitimate", color: "bg-green-500", text: "Backed by kernel32.dll" }
        if (spoofed) return { status: "Spoofed", color: "bg-orange-400", text: "Fake Return Address (kernel32.dll)" }
        return { status: "Anomalous", color: "bg-red-500", text: "Unbacked Memory (0x414141...)" }
    }

    const stackInfo = getStackStatus()

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 my-8">
            <Card className="border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Cpu className="w-5 h-5 text-purple-500" />
                        Memory Forensics Simulator
                    </CardTitle>
                    <CardDescription>
                        Visualize how malware hides in memory and how "Stack Spoofing" defeats simple thread analysis.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">

                    {/* Controls */}
                    <div className="flex flex-wrap gap-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex items-center space-x-2">
                            <Switch id="inject" checked={injected} onCheckedChange={toggleInjection} />
                            <Label htmlFor="inject" className="font-semibold">Inject Shellcode (RWX)</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="spoof"
                                checked={spoofed}
                                onCheckedChange={setSpoofed}
                                disabled={!injected}
                            />
                            <Label htmlFor="spoof" className={!injected ? "text-muted-foreground" : "font-semibold"}>
                                Enable Stack Spoofing
                            </Label>
                        </div>

                        <Button
                            variant={scanning ? "destructive" : "secondary"}
                            onClick={() => {
                                setScanning(true)
                                setTimeout(() => setScanning(false), 2000)
                            }}
                            disabled={scanning}
                        >
                            {scanning ? "Scanning..." : "Run Memory Scan (Moneta)"}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Virtual Memory Map */}
                        <div className="md:col-span-2 space-y-2">
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Virtual Address Space (svchost.exe)</Label>
                            <div className="border border-border rounded-md overflow-hidden bg-background h-[300px] relative flex flex-col">

                                {/* Legitimate Code Section */}
                                <div className="h-16 bg-blue-100 dark:bg-blue-950/40 border-b border-border/50 p-2 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs text-muted-foreground">0x00400000</span>
                                        <Badge variant="outline" className="bg-background text-blue-600 border-blue-200">.text (Code)</Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground hidden sm:block">RX / MEM_IMAGE</span>
                                </div>

                                {/* Loaded DLLs */}
                                <div className="h-24 bg-blue-50 dark:bg-blue-900/20 border-b border-border/50 p-2 flex flex-col justify-center gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs text-muted-foreground">0x7FF...</span>
                                        <span className="text-xs font-medium">ntdll.dll</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs text-muted-foreground">0x7FF...</span>
                                        <span className="text-xs font-medium">kernel32.dll</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground mt-1 text-right w-full block">RX / MEM_IMAGE</span>
                                </div>

                                {/* Injected Shellcode (Conditional) */}
                                {injected && (
                                    <div className="absolute top-[45%] w-full h-16 bg-red-100 dark:bg-red-950/60 border-y-2 border-red-500 p-2 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-red-600">0x00E10000</span>
                                            <Badge variant="destructive" className="animate-pulse">Malicious Payload</Badge>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-bold text-red-600">RWX / MEM_PRIVATE</span>
                                            <span className="text-[10px] text-red-500">Unbacked</span>
                                        </div>
                                    </div>
                                )}

                                {/* Heap */}
                                <div className="flex-1 bg-yellow-50 dark:bg-yellow-950/20 p-2 flex items-end justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs text-muted-foreground">0x02000000</span>
                                        <Badge variant="outline" className="bg-background text-yellow-600 border-yellow-200">Heap</Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground">RW / MEM_PRIVATE</span>
                                </div>

                            </div>
                        </div>

                        {/* Call Stack Visualization */}
                        <div className="space-y-2">
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Thread Call Stack</Label>
                            <div className="border border-border rounded-md bg-background h-[300px] p-4 flex flex-col gap-2 overflow-y-auto">

                                {/* Top of Stack */}
                                <div className="p-2 rounded bg-muted text-xs font-mono text-center border border-border/50">
                                    NtDelayExecution
                                </div>
                                <div className="text-center text-muted-foreground">↓</div>

                                {/* Critical Return Address */}
                                <div className={`p-2 rounded text-xs font-mono text-center border transition-colors duration-300 ${injected && !spoofed ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-950" : "border-green-500 bg-green-50 text-green-600 dark:bg-green-950"}`}>
                                    {stackInfo.text}
                                </div>
                                <div className="text-center text-muted-foreground">↓</div>

                                {/* Rest of Stack */}
                                <div className="p-2 rounded bg-muted text-xs font-mono text-center border border-border/50">
                                    RtlUserThreadStart
                                </div>
                                <div className="text-center text-muted-foreground">↓</div>
                                <div className="p-2 rounded bg-muted text-xs font-mono text-center border border-border/50 opaque-50">
                                    Top of Stack
                                </div>

                            </div>
                        </div>

                    </div>

                    {/* Analysis Result */}
                    <div className="flex items-start gap-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">
                        <Search className={`w-6 h-6 mt-1 flex-shrink-0 ${scanning ? "animate-pulse text-blue-500" : "text-muted-foreground"}`} />
                        <div>
                            <h4 className="font-semibold text-sm">Scanner Output (Moneta/Pe-sieve)</h4>
                            {scanning ? (
                                <p className="text-sm text-blue-500 font-mono mt-1">Scanning process memory regions...</p>
                            ) : (
                                <div className="text-sm mt-1">
                                    {injected ? (
                                        spoofed ? (
                                            <>
                                                <p className="text-orange-500 font-bold mb-1">⚠ SUSPICIOUS</p>
                                                <p className="text-muted-foreground">Stack looks legitimate (Spoofed), but scanning found <b>Private RWX Memory</b> at 0x00E10000.</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-red-500 font-bold mb-1">❌ DETECTED</p>
                                                <p className="text-muted-foreground">Thread call stack points to <b>Unbacked Memory</b>. Immediate IoC.</p>
                                            </>
                                        )
                                    ) : (
                                        <>
                                            <p className="text-green-500 font-bold mb-1">✔ CLEAN</p>
                                            <p className="text-muted-foreground">No memory anomalies or unbacked execution detected.</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
