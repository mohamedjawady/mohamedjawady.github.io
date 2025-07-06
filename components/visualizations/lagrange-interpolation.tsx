"use client"

import React, { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Plus, Minus, Eye, EyeOff } from "lucide-react"

interface Point {
  x: number
  y: number
  id: string
}

export function LagrangeInterpolation() {
  const [points, setPoints] = useState<Point[]>([
    { x: 1, y: 2, id: "p1" },
    { x: 3, y: 1, id: "p2" },
    { x: 5, y: 4, id: "p3" },
    { x: 7, y: 3, id: "p4" }
  ])
  
  const [showBasisPolynomials, setShowBasisPolynomials] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null)

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return

    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        const next = prev + 0.02
        if (next >= 1) {
          setIsAnimating(false)
          return 1
        }
        return next
      })
    }, 50)

    return () => clearInterval(interval)
  }, [isAnimating])

  // Calculate Lagrange basis polynomial Li(x) for point i
  const calculateBasisPolynomial = (i: number, x: number): number => {
    let result = 1
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        result *= (x - points[j].x) / (points[i].x - points[j].x)
      }
    }
    return result
  }

  // Calculate the Lagrange interpolating polynomial P(x)
  const calculateLagrangePolynomial = (x: number): number => {
    let result = 0
    for (let i = 0; i < points.length; i++) {
      result += points[i].y * calculateBasisPolynomial(i, x)
    }
    return result
  }

  // Generate points for plotting
  const plotPoints = useMemo(() => {
    const minX = Math.min(...points.map(p => p.x)) - 1
    const maxX = Math.max(...points.map(p => p.x)) + 1
    const step = (maxX - minX) / 200
    
    const polynomialPoints = []
    const basisPoints = points.map(() => [] as Array<{x: number, y: number}>)
    
    for (let x = minX; x <= maxX; x += step) {
      polynomialPoints.push({
        x,
        y: calculateLagrangePolynomial(x)
      })
      
      // Calculate basis polynomials
      points.forEach((_, i) => {
        basisPoints[i].push({
          x,
          y: calculateBasisPolynomial(i, x)
        })
      })
    }
    
    return { polynomial: polynomialPoints, basis: basisPoints }
  }, [points])

  // SVG dimensions and scaling
  const svgWidth = 800
  const svgHeight = 400
  const padding = 60
  
  const minX = Math.min(...points.map(p => p.x)) - 1
  const maxX = Math.max(...points.map(p => p.x)) + 1
  const minY = Math.min(...points.map(p => p.y), -2) - 1
  const maxY = Math.max(...points.map(p => p.y), 5) + 1
  
  const scaleX = (x: number) => padding + ((x - minX) / (maxX - minX)) * (svgWidth - 2 * padding)
  const scaleY = (y: number) => svgHeight - padding - ((y - minY) / (maxY - minY)) * (svgHeight - 2 * padding)

  // Generate SVG path for polynomial
  const generatePath = (points: Array<{x: number, y: number}>) => {
    if (points.length === 0) return ""
    
    let path = `M ${scaleX(points[0].x)} ${scaleY(points[0].y)}`
    for (let i = 1; i < points.length; i++) {
      path += ` L ${scaleX(points[i].x)} ${scaleY(points[i].y)}`
    }
    return path
  }

  const addPoint = () => {
    if (points.length >= 6) return
    
    const newX = Math.max(...points.map(p => p.x)) + 1
    const newY = Math.random() * 4 + 1
    
    setPoints([...points, {
      x: newX,
      y: newY,
      id: `p${Date.now()}`
    }])
  }

  const removePoint = () => {
    if (points.length <= 2) return
    setPoints(points.slice(0, -1))
  }

  const updatePoint = (index: number, x: number, y: number) => {
    const newPoints = [...points]
    newPoints[index] = { ...newPoints[index], x, y }
    setPoints(newPoints)
  }

  const resetAnimation = () => {
    setAnimationProgress(0)
    setIsAnimating(false)
  }

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore how Lagrange interpolation constructs a polynomial that passes through any set of points. 
          Adjust points, view basis polynomials, and see the mathematical beauty in action.
        </p>
        
        <div className="flex justify-center gap-4 flex-wrap">
          <Button 
            onClick={() => setIsAnimating(!isAnimating)} 
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isAnimating ? "Pause" : "Animate"}
          </Button>
          <Button onClick={resetAnimation} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={() => setShowBasisPolynomials(!showBasisPolynomials)} 
            variant={showBasisPolynomials ? "default" : "outline"}
          >
            {showBasisPolynomials ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            Basis Polynomials
          </Button>
          <Button onClick={addPoint} disabled={points.length >= 6} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Point
          </Button>
          <Button onClick={removePoint} disabled={points.length <= 2} variant="outline">
            <Minus className="w-4 h-4 mr-2" />
            Remove Point
          </Button>
        </div>
      </div>

      {/* Main Visualization */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Lagrange Interpolation</span>
            <div className="flex gap-2">
              <Badge variant="outline">{points.length} Points</Badge>
              <Badge variant="outline">Degree {points.length - 1}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <svg width={svgWidth} height={svgHeight} className="border rounded">
              {/* Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Axes */}
              <line 
                x1={scaleX(minX)} y1={scaleY(0)} 
                x2={scaleX(maxX)} y2={scaleY(0)} 
                stroke="#64748b" strokeWidth="2"
              />
              <line 
                x1={scaleX(0)} y1={scaleY(minY)} 
                x2={scaleX(0)} y2={scaleY(maxY)} 
                stroke="#64748b" strokeWidth="2"
              />
              
              {/* Axis labels */}
              <text x={scaleX(maxX) - 10} y={scaleY(0) - 10} className="text-sm fill-current">x</text>
              <text x={scaleX(0) + 10} y={scaleY(maxY) + 5} className="text-sm fill-current">y</text>
              
              {/* Basis polynomials */}
              {showBasisPolynomials && plotPoints.basis.map((basisPoints, i) => (
                <path
                  key={`basis-${i}`}
                  d={generatePath(basisPoints)}
                  fill="none"
                  stroke={colors[i]}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity={selectedPointIndex === null || selectedPointIndex === i ? 0.6 : 0.2}
                />
              ))}
              
              {/* Main interpolating polynomial */}
              <path
                d={generatePath(plotPoints.polynomial)}
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeDasharray={isAnimating ? `${animationProgress * 1000}, 1000` : "none"}
                strokeDashoffset={isAnimating ? 1000 - animationProgress * 1000 : 0}
              />
              
              {/* Data points */}
              {points.map((point, i) => (
                <g key={point.id}>
                  <circle
                    cx={scaleX(point.x)}
                    cy={scaleY(point.y)}
                    r="8"
                    fill={colors[i]}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-10 transition-all"
                    onMouseEnter={() => setSelectedPointIndex(i)}
                    onMouseLeave={() => setSelectedPointIndex(null)}
                  />
                  <text
                    x={scaleX(point.x)}
                    y={scaleY(point.y) - 15}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-current"
                  >
                    ({point.x.toFixed(1)}, {point.y.toFixed(1)})
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Point Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {points.map((point, i) => (
          <Card key={point.id} className={`transition-all ${selectedPointIndex === i ? 'ring-2 ring-blue-500' : ''}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: colors[i] }}
                />
                Point {i + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium">X: {point.x.toFixed(1)}</label>
                <Slider
                  value={[point.x]}
                  onValueChange={([value]) => updatePoint(i, value, point.y)}
                  min={0}
                  max={10}
                  step={0.1}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Y: {point.y.toFixed(1)}</label>
                <Slider
                  value={[point.y]}
                  onValueChange={([value]) => updatePoint(i, point.x, value)}
                  min={0}
                  max={5}
                  step={0.1}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mathematical Formula */}
      <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="text-green-800 dark:text-green-300 text-lg">
            Current Lagrange Polynomial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="font-mono text-sm">
            <p className="mb-2"><strong>P(x) = Σ yᵢ · Lᵢ(x)</strong></p>
            <div className="space-y-1">
              {points.map((point, i) => (
                <div key={point.id} className="text-xs" style={{ color: colors[i] }}>
                  <strong>L₍{i}₎(x)</strong> = {point.y.toFixed(2)} × 
                  {points.map((p, j) => i !== j && (
                    <span key={j}> (x - {p.x.toFixed(1)}) / ({point.x.toFixed(1)} - {p.x.toFixed(1)})</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Properties:</strong> This polynomial has degree {points.length - 1} and passes exactly through all {points.length} points. 
              Each basis polynomial Lᵢ(x) equals 1 at point i and 0 at all other points.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
