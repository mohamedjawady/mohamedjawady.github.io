"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw } from "lucide-react"

interface Token {
    type: string
    value: string
    color: string
}

interface ParsedSection {
    name: string
    entries: Record<string, string>
}

const SAMPLE_LOG = `=== Chrome Passwords ===
URL: https://bank.example.com/login
Username: victim@email.com
Password: Summer2024!

=== System Info ===
OS: Windows 10 Pro
IP: 192.168.1.105
HWID: A1B2C3D4E5F6

=== Crypto Wallets ===
MetaMask: 0x742d35Cc6634C0532925a3b844Bc9e7595f...
Phantom: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA8...`

export function StealerParserDemo() {
    const [input, setInput] = useState(SAMPLE_LOG)
    const [tokens, setTokens] = useState<Token[]>([])
    const [parsed, setParsed] = useState<ParsedSection[]>([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [phase, setPhase] = useState<"idle" | "lexing" | "parsing" | "done">("idle")

    const tokenColors: Record<string, string> = {
        SECTION_HEADER: "bg-purple-500/20 text-purple-400 border-purple-500/50",
        KEY: "bg-blue-500/20 text-blue-400 border-blue-500/50",
        COLON: "bg-gray-500/20 text-gray-400 border-gray-500/50",
        VALUE: "bg-green-500/20 text-green-400 border-green-500/50",
        NEWLINE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
    }

    const tokenize = (text: string): Token[] => {
        const result: Token[] = []
        const lines = text.split('\n')

        for (const line of lines) {
            const trimmed = line.trim()

            if (!trimmed) {
                result.push({ type: "NEWLINE", value: "\\n", color: tokenColors.NEWLINE })
                continue
            }

            // Section header
            const sectionMatch = trimmed.match(/^===\s*(.+?)\s*===$/)
            if (sectionMatch) {
                result.push({
                    type: "SECTION_HEADER",
                    value: sectionMatch[1],
                    color: tokenColors.SECTION_HEADER
                })
                result.push({ type: "NEWLINE", value: "\\n", color: tokenColors.NEWLINE })
                continue
            }

            // Key: Value pair
            const kvMatch = trimmed.match(/^(\w+):\s*(.+)$/)
            if (kvMatch) {
                result.push({ type: "KEY", value: kvMatch[1], color: tokenColors.KEY })
                result.push({ type: "COLON", value: ":", color: tokenColors.COLON })
                result.push({ type: "VALUE", value: kvMatch[2], color: tokenColors.VALUE })
                result.push({ type: "NEWLINE", value: "\\n", color: tokenColors.NEWLINE })
            }
        }

        return result
    }

    const parse = (tokenList: Token[]): ParsedSection[] => {
        const sections: ParsedSection[] = []
        let currentSection: ParsedSection | null = null
        let i = 0

        while (i < tokenList.length) {
            const token = tokenList[i]

            if (token.type === "SECTION_HEADER") {
                if (currentSection) {
                    sections.push(currentSection)
                }
                currentSection = { name: token.value, entries: {} }
                i++
            } else if (token.type === "KEY" && currentSection) {
                const key = token.value
                i++ // skip KEY
                i++ // skip COLON
                if (i < tokenList.length && tokenList[i].type === "VALUE") {
                    currentSection.entries[key] = tokenList[i].value
                    i++
                }
            } else {
                i++
            }
        }

        if (currentSection) {
            sections.push(currentSection)
        }

        return sections
    }

    const runDemo = async () => {
        setIsRunning(true)
        setTokens([])
        setParsed([])
        setCurrentStep(0)

        // Phase 1: Lexing
        setPhase("lexing")
        const tokenList = tokenize(input)

        for (let i = 0; i < tokenList.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 50))
            setTokens(prev => [...prev, tokenList[i]])
            setCurrentStep(i + 1)
        }

        await new Promise(resolve => setTimeout(resolve, 500))

        // Phase 2: Parsing
        setPhase("parsing")
        const parsedResult = parse(tokenList)

        for (let i = 0; i < parsedResult.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 300))
            setParsed(prev => [...prev, parsedResult[i]])
        }

        setPhase("done")
        setIsRunning(false)
    }

    const reset = () => {
        setTokens([])
        setParsed([])
        setCurrentStep(0)
        setPhase("idle")
        setIsRunning(false)
    }

    return (
        <Card className="w-full max-w-4xl mx-auto my-8 border-border/50">
            <CardHeader>
                <CardTitle className="text-lg">Interactive Stealer Log Parser</CardTitle>
                <CardDescription>
                    Watch lexical analysis and parsing in action. Tokens are identified first, then the grammar builds structured output.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Input */}
                <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Input (Stealer Log Format)
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => { setInput(e.target.value); reset(); }}
                        className="w-full h-40 p-3 rounded-md border border-border bg-muted/30 font-mono text-xs resize-none"
                        disabled={isRunning}
                    />
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                    <Button onClick={runDemo} disabled={isRunning} size="sm">
                        <Play className="w-4 h-4 mr-1" /> Run Parser
                    </Button>
                    <Button onClick={reset} variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4 mr-1" /> Reset
                    </Button>
                    <div className="flex-1" />
                    <div className="text-sm text-muted-foreground flex items-center">
                        Phase: <span className="ml-2 font-mono text-primary">{phase.toUpperCase()}</span>
                    </div>
                </div>

                {/* Token Stream */}
                {tokens.length > 0 && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Token Stream ({tokens.length} tokens)
                        </label>
                        <div className="flex flex-wrap gap-1 p-3 rounded-md border border-border bg-muted/30 max-h-32 overflow-y-auto">
                            <AnimatePresence>
                                {tokens.map((token, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`px-2 py-0.5 rounded text-xs font-mono border ${token.color}`}
                                    >
                                        {token.type === "NEWLINE" ? "NL" : token.value.length > 20 ? token.value.slice(0, 20) + "..." : token.value}
                                    </motion.span>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Parsed Output */}
                {parsed.length > 0 && (
                    <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                            Parsed Structure (AST)
                        </label>
                        <div className="p-3 rounded-md border border-border bg-muted/30 space-y-3">
                            <AnimatePresence>
                                {parsed.map((section, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-1"
                                    >
                                        <div className="text-sm font-semibold text-purple-400">
                                            {section.name}
                                        </div>
                                        <div className="pl-4 space-y-0.5">
                                            {Object.entries(section.entries).map(([key, value]) => (
                                                <div key={key} className="text-xs font-mono">
                                                    <span className="text-blue-400">{key}</span>
                                                    <span className="text-muted-foreground">: </span>
                                                    <span className="text-green-400">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Legend */}
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground border-t border-border/50 pt-3">
                    <span className={`px-2 py-0.5 rounded border ${tokenColors.SECTION_HEADER}`}>SECTION_HEADER</span>
                    <span className={`px-2 py-0.5 rounded border ${tokenColors.KEY}`}>KEY</span>
                    <span className={`px-2 py-0.5 rounded border ${tokenColors.COLON}`}>COLON</span>
                    <span className={`px-2 py-0.5 rounded border ${tokenColors.VALUE}`}>VALUE</span>
                    <span className={`px-2 py-0.5 rounded border ${tokenColors.NEWLINE}`}>NEWLINE</span>
                </div>
            </CardContent>
        </Card>
    )
}
