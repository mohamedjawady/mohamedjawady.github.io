"use client"
import React, { useEffect, useState } from "react"

export function HeroBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dark overlay base */}
      <div className="absolute inset-0 bg-background/90" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          maskImage: 'linear-gradient(to bottom, white, transparent)'
        }}
      />
      
      {/* Glowing Orbs */}
      <div className="absolute top-[20%] left-[20%] w-[30vw] h-[30vw] min-w-[300px] min-h-[300px] rounded-full bg-emerald-500/10 blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] rounded-full bg-blue-900/20 blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      <div className="absolute top-[40%] right-[30%] w-[20vw] h-[20vw] min-w-[200px] min-h-[200px] rounded-full bg-emerald-600/10 blur-[80px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />

      {/* Top Gradient Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
    </div>
  )
}
