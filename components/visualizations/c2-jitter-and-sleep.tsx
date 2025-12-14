"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Activity, Radio, ShieldAlert } from "lucide-react"

export function C2JitterAndSleep() {
  const [sleepInterval, setSleepInterval] = useState([5])
  const [jitter, setJitter] = useState([0])
  const [beacons, setBeacons] = useState<number[]>([])
  const [detectionScore, setDetectionScore] = useState(0)

  // Calculate new beacon times whenever controls change
  useEffect(() => {
    const baseInterval = sleepInterval[0]
    const jitterPercent = jitter[0] / 100
    
    // Simulate 10 beacons
    const newBeacons: number[] = [0] // Start at 0
    let currentTime = 0
    
    for (let i = 0; i < 9; i++) {
        // Jitter formula: Random value between (Interval - Jitter) and (Interval + Jitter)
        // Standard C2 implementation: random range [Mean * (1-Jitter), Mean * (1+Jitter)]
        const randomFactor = (Math.random() * 2 - 1) * jitterPercent 
        const actualDelay = baseInterval * (1 + randomFactor)
        
        // Ensure delay is never negative
        const delay = Math.max(0.1, actualDelay)
        currentTime += delay
        newBeacons.push(currentTime)
    }

    setBeacons(newBeacons)
    calculateDetectionScore(baseInterval, jitterPercent)
  }, [sleepInterval, jitter])

  const calculateDetectionScore = (interval: number, jitterPct: number) => {
    // Simplified risk score logic
    // High jitter = Low Detection Risk
    // Low jitter = High Detection Risk
    // Very fast beacons (<2s) = High Detection Risk regardless of jitter
    
    let risk = 100

    // Jitter reduces risk significantly
    risk -= (jitterPct * 100) * 1.5 
    
    // Fast beacons increase risk
    if (interval < 2) risk += 30
    else if (interval > 10) risk -= 20

    // Cap at 0-100
    setDetectionScore(Math.min(100, Math.max(0, Math.round(risk))))
  }

  const getRiskColor = (score: number) => {
    if (score > 75) return "text-red-500"
    if (score > 40) return "text-orange-500"
    return "text-green-500"
  }

  const getRiskLabel = (score: number) => {
    if (score > 75) return "CRITICAL (Easily Detected)"
    if (score > 40) return "MODERATE (Suspicious)"
    return "LOW (Stealthy)"
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 my-8">
      <Card className="border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-green-500" />
            C2 Jitter Simulator
          </CardTitle>
          <CardDescription>
            Visualize how "Jitter" breaks time-based detection patterns. Adjust the Sleep and Jitter to see the impact on beacon regularity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Label>Sleep Interval (Mean)</Label>
                        <span className="font-mono text-muted-foreground">{sleepInterval}s</span>
                    </div>
                    <Slider 
                        value={sleepInterval} 
                        onValueChange={setSleepInterval} 
                        min={1} 
                        max={30} 
                        step={0.5} 
                    />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between">
                        <Label>Jitter Percentage</Label>
                        <span className="font-mono text-muted-foreground">{jitter}%</span>
                    </div>
                    <Slider 
                        value={jitter} 
                        onValueChange={setJitter} 
                        min={0} 
                        max={50} 
                        step={1}
                        className="[&>span:first-child]:bg-green-500" 
                    />
                </div>
            </div>

            {/* Score Panel */}
            <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-lg border border-border/50">
                <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    Detection Probability
                </div>
                <div className={`text-5xl font-bold ${getRiskColor(detectionScore)}`}>
                    {detectionScore}%
                </div>
                <div className={`text-sm mt-2 font-medium ${getRiskColor(detectionScore)}`}>
                    {getRiskLabel(detectionScore)}
                </div>
            </div>
          </div>

          {/* Visualization Timeline */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <Label className="mb-4 block">Beacon Timeline (Seconds)</Label>
            <div className="relative h-24 bg-muted/50 rounded-lg border border-border/50 overflow-hidden">
                {/* Time Markers */}
                <div className="absolute inset-0 flex items-end px-4 pb-2 text-xs text-muted-foreground/50 justify-between">
                    <span>0s</span>
                    <span>{(sleepInterval[0] * 10).toFixed(0)}s+</span>
                </div>

                {/* Beacons */}
                <div className="absolute inset-0 flex items-center px-4">
                    <div className="w-full h-px bg-border relative">
                        {beacons.map((time, idx) => {
                            // Normalize position based on max expected time
                            const maxTime = sleepInterval[0] * 11 // slightly more than 10 intervals
                            const leftPos = (time / maxTime) * 100
                            
                            return (
                                <div 
                                    key={idx}
                                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300"
                                    style={{ left: `${Math.min(leftPos, 99)}%` }}
                                >
                                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap font-mono text-muted-foreground">
                                        {time.toFixed(1)}s
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
          </div>

          {/* Legend/Info */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-md flex gap-4 text-sm text-blue-900 dark:text-blue-200">
            <Activity className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
                <p className="font-semibold">How to read this:</p>
                <p className="opacity-90 mt-1">
                    Regular spacing (low jitter) creates a predictable "heartbeat" that is easily detected by mathematical analysis (Fourier Transforms). 
                    High jitter introduces chaos, blending the traffic with random noise.
                </p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
