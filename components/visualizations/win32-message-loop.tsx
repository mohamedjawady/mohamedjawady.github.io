"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, MousePointer2, Keyboard, Paintbrush, X } from "lucide-react"

interface Message {
    id: number
    type: string
    label: string
    color: string
    description: string
}

const messageTypes: Omit<Message, 'id'>[] = [
    { type: "WM_PAINT", label: "Paint", color: "bg-blue-500", description: "Window needs repainting" },
    { type: "WM_KEYDOWN", label: "Key", color: "bg-green-500", description: "Keyboard key pressed" },
    { type: "WM_MOUSEMOVE", label: "Mouse", color: "bg-yellow-500", description: "Mouse cursor moved" },
    { type: "WM_LBUTTONDOWN", label: "Click", color: "bg-purple-500", description: "Left mouse button clicked" },
    { type: "WM_SIZE", label: "Size", color: "bg-orange-500", description: "Window was resized" },
    { type: "WM_CLOSE", label: "Close", color: "bg-red-500", description: "Window close requested" },
]

export function Win32MessageLoop() {
    const [isRunning, setIsRunning] = useState(false)
    const [messageQueue, setMessageQueue] = useState<Message[]>([])
    const [currentMessage, setCurrentMessage] = useState<Message | null>(null)
    const [processedCount, setProcessedCount] = useState(0)
    const [step, setStep] = useState<'idle' | 'get' | 'translate' | 'dispatch' | 'process'>('idle')
    const [messageId, setMessageId] = useState(0)

    // Generate random messages
    useEffect(() => {
        if (!isRunning) return

        const interval = setInterval(() => {
            const randomType = messageTypes[Math.floor(Math.random() * messageTypes.length)]
            setMessageQueue(prev => {
                if (prev.length >= 6) return prev
                return [...prev, { ...randomType, id: messageId }]
            })
            setMessageId(prev => prev + 1)
        }, 1200)

        return () => clearInterval(interval)
    }, [isRunning, messageId])

    // Process messages through the loop
    useEffect(() => {
        if (!isRunning || messageQueue.length === 0) {
            if (isRunning && step !== 'idle') {
                setStep('idle')
            }
            return
        }

        const processMessage = async () => {
            // GetMessage
            setStep('get')
            await new Promise(r => setTimeout(r, 400))

            // Take message from queue
            const msg = messageQueue[0]
            setMessageQueue(prev => prev.slice(1))
            setCurrentMessage(msg)

            // TranslateMessage
            setStep('translate')
            await new Promise(r => setTimeout(r, 400))

            // DispatchMessage
            setStep('dispatch')
            await new Promise(r => setTimeout(r, 400))

            // WindowProc processing
            setStep('process')
            await new Promise(r => setTimeout(r, 600))

            // Complete
            setCurrentMessage(null)
            setProcessedCount(prev => prev + 1)
            setStep('idle')
        }

        if (step === 'idle') {
            processMessage()
        }
    }, [isRunning, messageQueue, step])

    const reset = () => {
        setIsRunning(false)
        setMessageQueue([])
        setCurrentMessage(null)
        setProcessedCount(0)
        setStep('idle')
    }

    const getIconForType = (type: string) => {
        switch (type) {
            case "WM_KEYDOWN": return <Keyboard className="w-3 h-3" />
            case "WM_MOUSEMOVE":
            case "WM_LBUTTONDOWN": return <MousePointer2 className="w-3 h-3" />
            case "WM_PAINT": return <Paintbrush className="w-3 h-3" />
            case "WM_CLOSE": return <X className="w-3 h-3" />
            default: return null
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4 my-8">
            <Card className="border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <RotateCcw className="w-5 h-5 text-blue-500" />
                        Win32 Message Loop Simulator
                    </CardTitle>
                    <CardDescription>
                        Visualize how Windows processes messages through GetMessage, TranslateMessage, and DispatchMessage.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Controls */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant={isRunning ? "destructive" : "default"}
                            onClick={() => setIsRunning(!isRunning)}
                            className="min-w-[100px]"
                        >
                            {isRunning ? (
                                <><Pause className="w-4 h-4 mr-2" /> Pause</>
                            ) : (
                                <><Play className="w-4 h-4 mr-2" /> Start</>
                            )}
                        </Button>
                        <Button variant="outline" onClick={reset}>
                            <RotateCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <div className="ml-auto text-sm text-muted-foreground">
                            Processed: <span className="font-mono font-bold">{processedCount}</span>
                        </div>
                    </div>

                    {/* Main Visualization */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Message Queue */}
                        <div className="space-y-2">
                            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                Message Queue
                            </h4>
                            <div className="border border-border rounded-lg p-3 bg-muted/30 min-h-[200px] space-y-2">
                                {messageQueue.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        {isRunning ? "Waiting for messages..." : "Click Start to begin"}
                                    </p>
                                ) : (
                                    messageQueue.map((msg, idx) => (
                                        <div
                                            key={msg.id}
                                            className={`flex items-center gap-2 p-2 rounded border transition-all duration-300 ${idx === 0 && step === 'get'
                                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 scale-105'
                                                    : 'border-border/50 bg-background'
                                                }`}
                                        >
                                            <Badge className={`${msg.color} text-white text-xs`}>
                                                {getIconForType(msg.type)}
                                            </Badge>
                                            <span className="font-mono text-xs">{msg.type}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Processing Pipeline */}
                        <div className="space-y-2">
                            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                Message Loop
                            </h4>
                            <div className="border border-border rounded-lg p-3 bg-background min-h-[200px] flex flex-col justify-center gap-3">
                                {/* GetMessage */}
                                <div className={`p-3 rounded border transition-all duration-300 ${step === 'get'
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50 shadow-md'
                                        : 'border-border/30 bg-muted/20'
                                    }`}>
                                    <code className="text-xs font-mono">GetMessageW(&msg, ...)</code>
                                    <p className="text-[10px] text-muted-foreground mt-1">Retrieve from queue</p>
                                </div>

                                <div className="text-center text-muted-foreground">↓</div>

                                {/* TranslateMessage */}
                                <div className={`p-3 rounded border transition-all duration-300 ${step === 'translate'
                                        ? 'border-green-500 bg-green-50 dark:bg-green-950/50 shadow-md'
                                        : 'border-border/30 bg-muted/20'
                                    }`}>
                                    <code className="text-xs font-mono">TranslateMessage(&msg)</code>
                                    <p className="text-[10px] text-muted-foreground mt-1">VK → WM_CHAR</p>
                                </div>

                                <div className="text-center text-muted-foreground">↓</div>

                                {/* DispatchMessage */}
                                <div className={`p-3 rounded border transition-all duration-300 ${step === 'dispatch'
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50 shadow-md'
                                        : 'border-border/30 bg-muted/20'
                                    }`}>
                                    <code className="text-xs font-mono">DispatchMessageW(&msg)</code>
                                    <p className="text-[10px] text-muted-foreground mt-1">Send to WindowProc</p>
                                </div>
                            </div>
                        </div>

                        {/* Window Procedure */}
                        <div className="space-y-2">
                            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                                WindowProc
                            </h4>
                            <div className="border border-border rounded-lg p-3 bg-muted/30 min-h-[200px]">
                                {currentMessage && step === 'process' ? (
                                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge className={`${currentMessage.color} text-white`}>
                                                {currentMessage.type}
                                            </Badge>
                                        </div>
                                        <div className="space-y-2 text-xs font-mono bg-background p-2 rounded border border-border/50">
                                            <p className="text-muted-foreground">switch (uMsg) {"{"}</p>
                                            <p className="pl-4 text-green-600 dark:text-green-400">
                                                case {currentMessage.type}:
                                            </p>
                                            <p className="pl-8 text-blue-600 dark:text-blue-400">
                                                // {currentMessage.description}
                                            </p>
                                            <p className="pl-8">return 0;</p>
                                            <p className="text-muted-foreground">{"}"}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                                        Waiting for message...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-3 pt-2 border-t border-border/50">
                        {messageTypes.slice(0, 4).map((msg) => (
                            <div key={msg.type} className="flex items-center gap-1.5 text-xs">
                                <div className={`w-2 h-2 rounded-full ${msg.color}`} />
                                <span className="font-mono">{msg.type}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
