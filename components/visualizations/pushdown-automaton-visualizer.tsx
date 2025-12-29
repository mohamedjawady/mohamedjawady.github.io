"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, CheckCircle2, XCircle } from "lucide-react"

export function PushdownAutomatonVisualizer() {
    const [inputString, setInputString] = useState("")
    const [currentState, setCurrentState] = useState<string | null>(null)
    const [stack, setStack] = useState<string[]>([])
    const [processedChars, setProcessedChars] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [result, setResult] = useState<"accepted" | "rejected" | null>(null)
    const [stepDescription, setStepDescription] = useState("")

    // PDA that accepts {a^n b^n | n >= 0} - balanced a's and b's
    // States: q0 (start), q1 (reading b's), q2 (accept)

    const reset = () => {
        setCurrentState(null)
        setStack([])
        setProcessedChars(0)
        setIsRunning(false)
        setResult(null)
        setStepDescription("")
    }

    const runAutomaton = async () => {
        if (!inputString.trim() && inputString !== "") return

        reset()
        setIsRunning(true)

        // Initialize
        let state = "q0"
        let currentStack: string[] = ["Z"] // Z is bottom marker
        setCurrentState(state)
        setStack([...currentStack])
        setStepDescription("Start: State q₀, Stack = [Z]")

        await new Promise(resolve => setTimeout(resolve, 800))

        // Process input
        for (let i = 0; i < inputString.length; i++) {
            const char = inputString[i].toLowerCase()

            if (char === 'a' && state === "q0") {
                // Push 'A' for each 'a'
                currentStack.push("A")
                setStack([...currentStack])
                setProcessedChars(i + 1)
                setStepDescription(`Read 'a': Push A onto stack`)

            } else if (char === 'b' && (state === "q0" || state === "q1")) {
                state = "q1"
                setCurrentState(state)

                // Check if we can pop 'A'
                if (currentStack.length > 1 && currentStack[currentStack.length - 1] === "A") {
                    currentStack.pop()
                    setStack([...currentStack])
                    setProcessedChars(i + 1)
                    setStepDescription(`Read 'b': Pop A from stack`)
                } else {
                    // No 'A' to pop - reject (too many b's)
                    setStepDescription(`Read 'b': No A to pop - REJECT`)
                    setResult("rejected")
                    setIsRunning(false)
                    return
                }

            } else {
                // Invalid character or wrong state
                setStepDescription(`Invalid input or sequence`)
                setResult("rejected")
                setIsRunning(false)
                return
            }

            await new Promise(resolve => setTimeout(resolve, 800))
        }

        // Check acceptance: stack should only have Z
        await new Promise(resolve => setTimeout(resolve, 400))

        if (currentStack.length === 1 && currentStack[0] === "Z") {
            state = "q2"
            setCurrentState(state)
            setStepDescription("Stack empty (only Z) - ACCEPT")
            setResult("accepted")
        } else {
            setStepDescription(`Stack not empty: [${currentStack.join(', ')}] - REJECT`)
            setResult("rejected")
        }

        setIsRunning(false)
    }

    const getStateColor = (stateId: string) => {
        if (currentState === stateId) return "fill-primary stroke-primary"
        return "fill-muted stroke-border"
    }

    return (
        <Card className="w-full max-w-2xl mx-auto my-8 border-border/50">
            <CardHeader>
                <CardTitle className="text-lg">Pushdown Automaton: Accepts aⁿbⁿ</CardTitle>
                <CardDescription>
                    A PDA that accepts equal numbers of a's followed by b's. Uses a stack to count.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    {/* State Diagram */}
                    <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                        <div className="text-xs text-muted-foreground mb-2 text-center">States</div>
                        <svg viewBox="0 0 280 100" className="w-full h-auto">
                            <defs>
                                <marker id="pda-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" className="fill-muted-foreground" />
                                </marker>
                            </defs>

                            {/* Start arrow */}
                            <line x1="10" y1="50" x2="38" y2="50" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" markerEnd="url(#pda-arrow)" />

                            {/* Transitions */}
                            <line x1="88" y1="50" x2="118" y2="50" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" markerEnd="url(#pda-arrow)" />
                            <text x="103" y="42" textAnchor="middle" className="text-[9px] fill-foreground font-mono">b,A/ε</text>

                            <line x1="178" y1="50" x2="208" y2="50" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" markerEnd="url(#pda-arrow)" />
                            <text x="193" y="42" textAnchor="middle" className="text-[9px] fill-foreground font-mono">ε,Z/Z</text>

                            {/* Self loops */}
                            <path d="M 63 25 C 45 0, 85 0, 67 25" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" markerEnd="url(#pda-arrow)" />
                            <text x="65" y="8" textAnchor="middle" className="text-[9px] fill-foreground font-mono">a,ε/A</text>

                            <path d="M 153 25 C 135 0, 175 0, 157 25" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" markerEnd="url(#pda-arrow)" />
                            <text x="155" y="8" textAnchor="middle" className="text-[9px] fill-foreground font-mono">b,A/ε</text>

                            {/* States */}
                            {[
                                { id: "q0", x: 65, y: 50, isStart: true },
                                { id: "q1", x: 155, y: 50 },
                                { id: "q2", x: 235, y: 50, isAccept: true },
                            ].map(state => (
                                <g key={state.id}>
                                    <motion.circle
                                        cx={state.x}
                                        cy={state.y}
                                        r="22"
                                        className={getStateColor(state.id)}
                                        strokeWidth="2"
                                        animate={{ scale: currentState === state.id ? 1.1 : 1 }}
                                    />
                                    {state.isAccept && (
                                        <circle cx={state.x} cy={state.y} r="17" fill="none" stroke="currentColor" strokeWidth="2" className={currentState === state.id ? "text-primary" : "text-border"} />
                                    )}
                                    <text x={state.x} y={state.y + 4} textAnchor="middle" className={`text-xs font-mono ${currentState === state.id ? "fill-primary-foreground" : "fill-foreground"}`}>
                                        {state.id}
                                    </text>
                                </g>
                            ))}
                        </svg>
                    </div>

                    {/* Stack Visualization */}
                    <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                        <div className="text-xs text-muted-foreground mb-2 text-center">Stack</div>
                        <div className="flex flex-col-reverse items-center justify-end h-[80px] border-2 border-dashed border-border/50 rounded p-1">
                            <AnimatePresence>
                                {stack.map((item, index) => (
                                    <motion.div
                                        key={`${item}-${index}`}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`w-8 h-6 flex items-center justify-center text-xs font-mono border rounded ${item === "Z" ? "bg-muted border-border" : "bg-primary/20 border-primary text-primary"
                                            }`}
                                    >
                                        {item}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {stack.length === 0 && (
                                <div className="text-xs text-muted-foreground">Empty</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Step Description */}
                {stepDescription && (
                    <div className="text-sm text-center font-mono bg-muted/30 rounded p-2 border border-border/50">
                        {stepDescription}
                    </div>
                )}

                {/* Input and Controls */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputString}
                        onChange={(e) => { setInputString(e.target.value); reset(); }}
                        placeholder="Enter string (e.g., 'aabb', 'aaabbb')"
                        className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm font-mono"
                        disabled={isRunning}
                    />
                    <Button onClick={runAutomaton} disabled={isRunning} size="sm">
                        <Play className="w-4 h-4 mr-1" /> Run
                    </Button>
                    <Button onClick={reset} variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between text-sm">
                    <div className="font-mono">
                        Input: {inputString.split('').map((char, i) => (
                            <span key={i} className={i < processedChars ? "text-primary font-bold" : "text-muted-foreground"}>
                                {char}
                            </span>
                        ))}
                    </div>
                    {result && (
                        <div className={`flex items-center gap-1 font-medium ${result === "accepted" ? "text-green-500" : "text-red-500"}`}>
                            {result === "accepted" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {result === "accepted" ? "Accepted" : "Rejected"}
                        </div>
                    )}
                </div>

                {/* Grammar */}
                <div className="text-xs text-muted-foreground border-t border-border/50 pt-3 mt-3">
                    <div className="font-mono">
                        Language: L = {"{"} aⁿbⁿ | n ≥ 0 {"}"} — Context-Free, not Regular
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
