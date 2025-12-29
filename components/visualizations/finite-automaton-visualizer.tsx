"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, CheckCircle2, XCircle } from "lucide-react"

interface State {
    id: string
    label: string
    x: number
    y: number
    isStart?: boolean
    isAccept?: boolean
}

interface Transition {
    from: string
    to: string
    label: string
}

export function FiniteAutomatonVisualizer() {
    const [inputString, setInputString] = useState("")
    const [currentState, setCurrentState] = useState<string | null>(null)
    const [processedChars, setProcessedChars] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [result, setResult] = useState<"accepted" | "rejected" | null>(null)

    // DFA that accepts strings ending in "ab"
    const states: State[] = [
        { id: "q0", label: "q₀", x: 80, y: 120, isStart: true },
        { id: "q1", label: "q₁", x: 220, y: 120 },
        { id: "q2", label: "q₂", x: 360, y: 120, isAccept: true },
    ]

    const transitions: Transition[] = [
        { from: "q0", to: "q0", label: "b" },
        { from: "q0", to: "q1", label: "a" },
        { from: "q1", to: "q1", label: "a" },
        { from: "q1", to: "q2", label: "b" },
        { from: "q2", to: "q1", label: "a" },
        { from: "q2", to: "q0", label: "b" },
    ]

    const transitionTable: Record<string, Record<string, string>> = {
        "q0": { "a": "q1", "b": "q0" },
        "q1": { "a": "q1", "b": "q2" },
        "q2": { "a": "q1", "b": "q0" },
    }

    const reset = () => {
        setCurrentState(null)
        setProcessedChars(0)
        setIsRunning(false)
        setResult(null)
    }

    const runAutomaton = async () => {
        if (!inputString.trim()) return

        reset()
        setIsRunning(true)
        setCurrentState("q0")

        let state = "q0"

        for (let i = 0; i < inputString.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 600))

            const char = inputString[i].toLowerCase()
            if (char !== 'a' && char !== 'b') {
                setResult("rejected")
                setIsRunning(false)
                return
            }

            state = transitionTable[state][char]
            setCurrentState(state)
            setProcessedChars(i + 1)
        }

        await new Promise(resolve => setTimeout(resolve, 400))

        const acceptingStates = states.filter(s => s.isAccept).map(s => s.id)
        setResult(acceptingStates.includes(state) ? "accepted" : "rejected")
        setIsRunning(false)
    }

    const getStateColor = (stateId: string) => {
        if (currentState === stateId) return "fill-primary stroke-primary"
        return "fill-muted stroke-border"
    }

    const renderSelfLoop = (state: State, label: string) => {
        const loopRadius = 20
        return (
            <g key={`loop-${state.id}-${label}`}>
                <path
                    d={`M ${state.x - 15} ${state.y - 25} 
                        C ${state.x - 30} ${state.y - 60}, 
                          ${state.x + 30} ${state.y - 60}, 
                          ${state.x + 15} ${state.y - 25}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-muted-foreground"
                    markerEnd="url(#arrowhead)"
                />
                <text
                    x={state.x}
                    y={state.y - 55}
                    textAnchor="middle"
                    className="text-xs fill-foreground font-mono"
                >
                    {label}
                </text>
            </g>
        )
    }

    const renderTransition = (from: State, to: State, label: string, offset: number = 0) => {
        const dx = to.x - from.x
        const dy = to.y - from.y
        const len = Math.sqrt(dx * dx + dy * dy)

        const startX = from.x + (dx / len) * 28
        const startY = from.y + (dy / len) * 28
        const endX = to.x - (dx / len) * 32
        const endY = to.y - (dy / len) * 32

        const midX = (startX + endX) / 2
        const midY = (startY + endY) / 2 + offset

        return (
            <g key={`${from.id}-${to.id}-${label}`}>
                <line
                    x1={startX}
                    y1={startY + offset}
                    x2={endX}
                    y2={endY + offset}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-muted-foreground"
                    markerEnd="url(#arrowhead)"
                />
                <text
                    x={midX}
                    y={midY - 8}
                    textAnchor="middle"
                    className="text-xs fill-foreground font-mono"
                >
                    {label}
                </text>
            </g>
        )
    }

    return (
        <Card className="w-full max-w-2xl mx-auto my-8 border-border/50">
            <CardHeader>
                <CardTitle className="text-lg">Finite Automaton: Accepts strings ending in "ab"</CardTitle>
                <CardDescription>
                    A DFA with 3 states. Enter a string of a's and b's to simulate.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* State Diagram */}
                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                    <svg viewBox="0 0 440 180" className="w-full h-auto">
                        <defs>
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
                                    className="fill-muted-foreground"
                                />
                            </marker>
                        </defs>

                        {/* Start arrow */}
                        <line x1="20" y1="120" x2="48" y2="120" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" markerEnd="url(#arrowhead)" />

                        {/* Self loops */}
                        {renderSelfLoop(states[0], "b")}
                        {renderSelfLoop(states[1], "a")}

                        {/* Transitions */}
                        {renderTransition(states[0], states[1], "a")}
                        {renderTransition(states[1], states[2], "b")}

                        {/* Curved transitions for back edges */}
                        <path
                            d={`M ${states[2].x - 20} ${states[2].y + 20} 
                                Q ${(states[2].x + states[1].x) / 2} ${states[2].y + 50}, 
                                  ${states[1].x + 20} ${states[1].y + 20}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-muted-foreground"
                            markerEnd="url(#arrowhead)"
                        />
                        <text x={(states[2].x + states[1].x) / 2} y={states[2].y + 55} textAnchor="middle" className="text-xs fill-foreground font-mono">a</text>

                        <path
                            d={`M ${states[2].x - 25} ${states[2].y + 25} 
                                Q ${(states[2].x + states[0].x) / 2} ${states[2].y + 80}, 
                                  ${states[0].x + 25} ${states[0].y + 25}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="text-muted-foreground"
                            markerEnd="url(#arrowhead)"
                        />
                        <text x={(states[2].x + states[0].x) / 2} y={states[2].y + 83} textAnchor="middle" className="text-xs fill-foreground font-mono">b</text>

                        {/* States */}
                        {states.map(state => (
                            <g key={state.id}>
                                <motion.circle
                                    cx={state.x}
                                    cy={state.y}
                                    r="28"
                                    className={getStateColor(state.id)}
                                    strokeWidth="2"
                                    animate={{
                                        scale: currentState === state.id ? 1.1 : 1,
                                    }}
                                    transition={{ duration: 0.2 }}
                                />
                                {state.isAccept && (
                                    <circle
                                        cx={state.x}
                                        cy={state.y}
                                        r="22"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className={currentState === state.id ? "text-primary" : "text-border"}
                                    />
                                )}
                                <text
                                    x={state.x}
                                    y={state.y + 5}
                                    textAnchor="middle"
                                    className={`text-sm font-mono ${currentState === state.id ? "fill-primary-foreground" : "fill-foreground"}`}
                                >
                                    {state.label}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>

                {/* Input and Controls */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputString}
                        onChange={(e) => { setInputString(e.target.value); reset(); }}
                        placeholder="Enter string (e.g., 'aab', 'bab')"
                        className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm font-mono"
                        disabled={isRunning}
                    />
                    <Button onClick={runAutomaton} disabled={isRunning || !inputString.trim()} size="sm">
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

                {/* Legend */}
                <div className="text-xs text-muted-foreground border-t border-border/50 pt-3 mt-3">
                    <div className="flex gap-4">
                        <span>→ Start state</span>
                        <span>◎ Accept state (double circle)</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
