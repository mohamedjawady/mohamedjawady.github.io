"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Lock, Unlock, AlertTriangle } from "lucide-react"

type SyncMode = 'none' | 'mutex' | 'critical-section'

interface ThreadState {
    id: number
    name: string
    color: string
    position: number
    hasLock: boolean
    waiting: boolean
    value: number
}

export function ThreadSynchronization() {
    const [isRunning, setIsRunning] = useState(false)
    const [syncMode, setSyncMode] = useState<SyncMode>('none')
    const [sharedCounter, setSharedCounter] = useState(0)
    const [expectedCounter, setExpectedCounter] = useState(0)
    const [raceConditions, setRaceConditions] = useState(0)
    const [lockHolder, setLockHolder] = useState<number | null>(null)
    const [threads, setThreads] = useState<ThreadState[]>([
        { id: 1, name: "Thread 1", color: "bg-blue-500", position: 0, hasLock: false, waiting: false, value: 0 },
        { id: 2, name: "Thread 2", color: "bg-green-500", position: 0, hasLock: false, waiting: false, value: 0 },
        { id: 3, name: "Thread 3", color: "bg-purple-500", position: 0, hasLock: false, waiting: false, value: 0 },
    ])

    const counterRef = useRef(0)
    const expectedRef = useRef(0)
    const raceRef = useRef(0)

    const steps = [
        "Read counter",
        "Increment",
        "Write back",
        "Complete"
    ]

    useEffect(() => {
        if (!isRunning) return

        const interval = setInterval(() => {
            setThreads(prev => {
                const updated = [...prev]
                let newLockHolder = lockHolder
                let newRaces = raceRef.current

                updated.forEach((thread, idx) => {
                    // Skip if waiting for lock
                    if (thread.waiting && syncMode !== 'none') {
                        if (lockHolder === null) {
                            // Acquire lock
                            updated[idx] = { ...thread, waiting: false, hasLock: true }
                            newLockHolder = thread.id
                            setLockHolder(thread.id)
                        }
                        return
                    }

                    // Random chance to step forward
                    if (Math.random() > 0.5) {
                        const newPosition = thread.position + 1

                        if (thread.position === 0) {
                            // About to read - check if need lock
                            if (syncMode !== 'none' && !thread.hasLock) {
                                if (lockHolder === null) {
                                    // Acquire lock
                                    updated[idx] = {
                                        ...thread,
                                        hasLock: true,
                                        value: counterRef.current,
                                        position: 1
                                    }
                                    newLockHolder = thread.id
                                    setLockHolder(thread.id)
                                } else {
                                    // Wait for lock
                                    updated[idx] = { ...thread, waiting: true }
                                }
                            } else {
                                // No sync - read current value
                                updated[idx] = {
                                    ...thread,
                                    value: counterRef.current,
                                    position: 1
                                }
                            }
                        } else if (thread.position === 1) {
                            // Increment local value
                            updated[idx] = {
                                ...thread,
                                value: thread.value + 1,
                                position: 2
                            }
                        } else if (thread.position === 2) {
                            // Write back
                            const oldValue = counterRef.current
                            counterRef.current = thread.value
                            setSharedCounter(thread.value)

                            expectedRef.current++
                            setExpectedCounter(expectedRef.current)

                            // Check for race condition (without sync)
                            if (syncMode === 'none' && thread.value !== expectedRef.current) {
                                newRaces++
                                raceRef.current = newRaces
                                setRaceConditions(newRaces)
                            }

                            updated[idx] = { ...thread, position: 3 }
                        } else if (thread.position >= 3) {
                            // Reset for next iteration
                            if (thread.hasLock) {
                                newLockHolder = null
                                setLockHolder(null)
                            }
                            updated[idx] = {
                                ...thread,
                                position: 0,
                                hasLock: false,
                                value: 0
                            }
                        }
                    }
                })

                return updated
            })
        }, 300)

        return () => clearInterval(interval)
    }, [isRunning, syncMode, lockHolder])

    const reset = () => {
        setIsRunning(false)
        setSharedCounter(0)
        setExpectedCounter(0)
        setRaceConditions(0)
        setLockHolder(null)
        counterRef.current = 0
        expectedRef.current = 0
        raceRef.current = 0
        setThreads([
            { id: 1, name: "Thread 1", color: "bg-blue-500", position: 0, hasLock: false, waiting: false, value: 0 },
            { id: 2, name: "Thread 2", color: "bg-green-500", position: 0, hasLock: false, waiting: false, value: 0 },
            { id: 3, name: "Thread 3", color: "bg-purple-500", position: 0, hasLock: false, waiting: false, value: 0 },
        ])
    }

    const hasRaceCondition = syncMode === 'none' && sharedCounter !== expectedCounter

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4 my-8">
            <Card className="border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-orange-500" />
                        Thread Synchronization Visualizer
                    </CardTitle>
                    <CardDescription>
                        See how multiple threads accessing shared data can cause race conditions, and how synchronization primitives prevent them.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-4">
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

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sync Mode:</span>
                            <Select
                                value={syncMode}
                                onValueChange={(v) => {
                                    reset()
                                    setSyncMode(v as SyncMode)
                                }}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Synchronization</SelectItem>
                                    <SelectItem value="mutex">Mutex</SelectItem>
                                    <SelectItem value="critical-section">Critical Section</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Shared Counter Display */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-muted/50 rounded-lg text-center">
                            <div className="text-2xl font-mono font-bold">{sharedCounter}</div>
                            <div className="text-xs text-muted-foreground">Shared Counter</div>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg text-center">
                            <div className="text-2xl font-mono font-bold">{expectedCounter}</div>
                            <div className="text-xs text-muted-foreground">Expected Value</div>
                        </div>
                        <div className={`p-4 rounded-lg text-center ${hasRaceCondition ? 'bg-red-100 dark:bg-red-950/50' : 'bg-green-100 dark:bg-green-950/50'}`}>
                            <div className={`text-2xl font-mono font-bold ${hasRaceCondition ? 'text-red-600' : 'text-green-600'}`}>
                                {hasRaceCondition ? '✗' : '✓'}
                            </div>
                            <div className="text-xs text-muted-foreground">Data Integrity</div>
                        </div>
                        <div className={`p-4 rounded-lg text-center ${raceConditions > 0 ? 'bg-red-100 dark:bg-red-950/50' : 'bg-muted/50'}`}>
                            <div className={`text-2xl font-mono font-bold ${raceConditions > 0 ? 'text-red-600' : ''}`}>
                                {raceConditions}
                            </div>
                            <div className="text-xs text-muted-foreground">Race Conditions</div>
                        </div>
                    </div>

                    {/* Lock Status */}
                    {syncMode !== 'none' && (
                        <div className={`flex items-center gap-3 p-3 rounded-lg border ${lockHolder ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200' : 'bg-green-50 dark:bg-green-950/30 border-green-200'}`}>
                            {lockHolder ? (
                                <>
                                    <Lock className="w-5 h-5 text-orange-500" />
                                    <span className="text-sm">
                                        <strong>{syncMode === 'mutex' ? 'Mutex' : 'Critical Section'}</strong> held by Thread {lockHolder}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <Unlock className="w-5 h-5 text-green-500" />
                                    <span className="text-sm">
                                        <strong>{syncMode === 'mutex' ? 'Mutex' : 'Critical Section'}</strong> available
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                    {/* Thread Visualization */}
                    <div className="space-y-4">
                        {/* Steps Header */}
                        <div className="grid grid-cols-5 gap-2 text-xs text-center text-muted-foreground">
                            <div>Idle</div>
                            {steps.map((step, i) => (
                                <div key={i} className="font-mono">{step}</div>
                            ))}
                        </div>

                        {/* Thread Progress */}
                        {threads.map((thread) => (
                            <div key={thread.id} className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge className={`${thread.color} text-white min-w-[80px] justify-center`}>
                                        {thread.name}
                                    </Badge>
                                    {thread.waiting && (
                                        <span className="text-xs text-orange-500 animate-pulse">
                                            Waiting for lock...
                                        </span>
                                    )}
                                    {thread.hasLock && (
                                        <Lock className="w-4 h-4 text-orange-500" />
                                    )}
                                    {thread.position > 0 && thread.position < 3 && (
                                        <span className="text-xs font-mono text-muted-foreground">
                                            local: {thread.value}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-5 gap-1 h-8">
                                    {[0, 1, 2, 3, 4].map((step) => (
                                        <div
                                            key={step}
                                            className={`rounded transition-all duration-200 flex items-center justify-center ${thread.position === step
                                                    ? `${thread.color} shadow-md`
                                                    : thread.waiting && step === 0
                                                        ? 'bg-orange-200 dark:bg-orange-800'
                                                        : 'bg-muted/30'
                                                }`}
                                        >
                                            {thread.position === step && (
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Race Condition Warning */}
                    {syncMode === 'none' && (
                        <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-semibold text-yellow-700 dark:text-yellow-400">No Synchronization Active</p>
                                <p className="text-muted-foreground mt-1">
                                    Watch what happens when multiple threads read, modify, and write the counter simultaneously.
                                    The actual value may differ from the expected value due to race conditions.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
