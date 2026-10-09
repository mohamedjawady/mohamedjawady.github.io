"use client"

import { ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stop {
  symbol: string
  what: string
  accent?: boolean
}

const stops: Stop[] = [
  { symbol: "_rt0_amd64_windows / _rt0_amd64_linux", what: "Assembly entry point. No runtime exists yet." },
  { symbol: "runtime.rt0_go", what: "Bootstraps the runtime: stack, memory allocator, scheduler, GC." },
  { symbol: "runtime.main", what: "The first real goroutine. Starts the GC, runs package init() funcs." },
  { symbol: "main.main", what: "Your code, finally.", accent: true },
]

export function GoEntryPointFlow() {
  return (
    <div className="w-full max-w-xl mx-auto my-8 not-prose">
      <div className="rounded-lg border border-border bg-muted/10 p-5">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
          Execution Flow Before Your Code Runs
        </div>
        <div className="flex flex-col items-start">
          {stops.map((s, i) => (
            <div key={s.symbol} className="w-full">
              <div
                className={cn(
                  "rounded-md border px-3 py-2 font-mono text-sm",
                  s.accent
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-border bg-background text-foreground",
                )}
              >
                {s.symbol}
              </div>
              <p className="text-xs text-muted-foreground mt-1 mb-2 pl-1">{s.what}</p>
              {i < stops.length - 1 && (
                <div className="flex justify-start pl-3 mb-1">
                  <ArrowDown className="w-4 h-4 text-muted-foreground/50" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
