"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, TrendingUp, BarChart3 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface DataPoint {
  sampleSize: number
  measuredMean: number
  confidenceInterval: [number, number]
}

export function LawOfLargeNumbers() {
  const [trueMean, setTrueMean] = useState(150)
  const [stdDev, setStdDev] = useState(20)
  const [maxSamples, setMaxSamples] = useState(1000)
  const [systemType, setSystemType] = useState("normal")
  const [data, setData] = useState<DataPoint[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentSample, setCurrentSample] = useState(0)

  // Simulate different system response time distributions
  const generateSample = (): number => {
    switch (systemType) {
      case "normal":
        // Normal distribution - typical for well-behaved systems
        return normalRandom(trueMean, stdDev)
      case "skewed":
        // Exponential distribution - typical for systems with occasional slowdowns
        return exponentialRandom(trueMean * 0.7) + 30
      case "bimodal":
        // Bimodal - system with two performance modes (fast/slow)
        const mode = Math.random() < 0.8 ? 0 : 1
        return mode === 0 ? normalRandom(120, 10) : normalRandom(250, 30)
      default:
        return normalRandom(trueMean, stdDev)
    }
  }

  // Box-Muller transform for normal distribution
  const normalRandom = (mean: number, stdDev: number): number => {
    const u1 = Math.random()
    const u2 = Math.random()
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return z0 * stdDev + mean
  }

  // Exponential distribution
  const exponentialRandom = (lambda: number): number => {
    return -Math.log(1 - Math.random()) / (1 / lambda)
  }

  // Calculate confidence interval for the mean
  const calculateConfidenceInterval = (samples: number[], mean: number): [number, number] => {
    const n = samples.length
    const sem = stdDev / Math.sqrt(n) // Standard error of the mean
    const marginOfError = 1.96 * sem // 95% confidence interval
    return [mean - marginOfError, mean + marginOfError]
  }

  // Run the simulation
  const runSimulation = async () => {
    setIsRunning(true)
    setData([])
    setCurrentSample(0)

    const samples: number[] = []
    const newData: DataPoint[] = []
    
    // Sample sizes to test
    const sampleSizes = [5, 10, 20, 30, 50, 75, 100, 150, 200, 300, 500, 750, 1000]
      .filter(size => size <= maxSamples)

    for (const targetSize of sampleSizes) {
      // Generate samples up to target size
      while (samples.length < targetSize) {
        samples.push(generateSample())
        setCurrentSample(samples.length)
        
        // Add a small delay for visual effect
        if (samples.length % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      }

      const currentSamples = samples.slice(0, targetSize)
      const measuredMean = currentSamples.reduce((sum, val) => sum + val, 0) / currentSamples.length
      const confidenceInterval = calculateConfidenceInterval(currentSamples, measuredMean)

      newData.push({
        sampleSize: targetSize,
        measuredMean,
        confidenceInterval
      })

      setData([...newData])
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    setIsRunning(false)
  }

  const reset = () => {
    setData([])
    setCurrentSample(0)
    setIsRunning(false)
  }

  // Calculate how close we are to the true mean
  const getAccuracy = (measuredMean: number): string => {
    const error = Math.abs(measuredMean - trueMean)
    const percentage = ((trueMean - error) / trueMean) * 100
    return `${Math.max(0, percentage).toFixed(1)}%`
  }

  // Get color based on how close to true mean
  const getAccuracyColor = (measuredMean: number): string => {
    const error = Math.abs(measuredMean - trueMean)
    const errorPercentage = (error / trueMean) * 100
    
    if (errorPercentage < 2) return "text-green-600"
    if (errorPercentage < 5) return "text-yellow-600"
    return "text-red-600"
  }

  const systemDescriptions = {
    normal: "Normal Distribution - Well-behaved system with consistent performance",
    skewed: "Exponential Distribution - System with occasional slowdowns (long tail)",
    bimodal: "Bimodal Distribution - System with two performance modes (fast/slow)"
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Law of Large Numbers in System Benchmarking
          </CardTitle>
          <CardDescription>
            See how increasing sample size makes your benchmark measurements more reliable and closer to the true system performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="trueMean">True Mean (ms)</Label>
              <Input
                id="trueMean"
                type="number"
                value={trueMean}
                onChange={(e) => setTrueMean(Number(e.target.value))}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stdDev">Std Deviation (ms)</Label>
              <Input
                id="stdDev"
                type="number"
                value={stdDev}
                onChange={(e) => setStdDev(Number(e.target.value))}
                disabled={isRunning}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSamples">Max Samples</Label>
              <Select value={maxSamples.toString()} onValueChange={(value) => setMaxSamples(Number(value))} disabled={isRunning}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                  <SelectItem value="1000">1000</SelectItem>
                  <SelectItem value="2000">2000</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemType">System Type</Label>
              <Select value={systemType} onValueChange={setSystemType} disabled={isRunning}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="skewed">Skewed</SelectItem>
                  <SelectItem value="bimodal">Bimodal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4">
            <Badge variant="outline" className="mb-2">
              {systemDescriptions[systemType as keyof typeof systemDescriptions]}
            </Badge>
          </div>

          <div className="flex gap-2 mb-6">
            <Button onClick={runSimulation} disabled={isRunning} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              {isRunning ? `Running... (${currentSample} samples)` : "Run Simulation"}
            </Button>
            <Button onClick={reset} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>

          {data.length > 0 && (
            <div className="space-y-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="sampleSize" 
                      label={{ value: 'Sample Size', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: 'Measured Mean (ms)', angle: -90, position: 'insideLeft' }}
                      domain={['dataMin - 10', 'dataMax + 10']}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `${value.toFixed(2)} ms`,
                        name === 'measuredMean' ? 'Measured Mean' : name
                      ]}
                      labelFormatter={(label) => `Sample Size: ${label}`}
                    />
                    <ReferenceLine 
                      y={trueMean} 
                      stroke="#ef4444" 
                      strokeDasharray="5 5" 
                      label="True Mean"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="measuredMean" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.slice(-3).map((point, index) => {
                  const error = Math.abs(point.measuredMean - trueMean)
                  const errorPercentage = (error / trueMean) * 100
                  const ciWidth = point.confidenceInterval[1] - point.confidenceInterval[0]
                  
                  return (
                    <Card key={point.sampleSize} className="border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                          n = {point.sampleSize} samples
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Measured Mean:</span>
                          <span className={`font-mono text-sm ${getAccuracyColor(point.measuredMean)}`}>
                            {point.measuredMean.toFixed(2)} ms
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Error:</span>
                          <span className="font-mono text-sm">
                            {errorPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">95% CI Width:</span>
                          <span className="font-mono text-sm">
                            ±{(ciWidth / 2).toFixed(1)} ms
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          CI: [{point.confidenceInterval[0].toFixed(1)}, {point.confidenceInterval[1].toFixed(1)}]
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>As sample size increases, the measured mean converges to the true mean ({trueMean} ms)</li>
                  <li>Confidence intervals get narrower with more samples, indicating higher precision</li>
                  <li>Even with non-normal distributions, the sample means approach the true value</li>
                  <li>Small sample sizes (n &lt; 30) can be misleading, especially for variable systems</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
