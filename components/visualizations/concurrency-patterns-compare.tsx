"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitFork, Lock, Timer } from "lucide-react"
import { cn } from "@/lib/utils"

interface Level {
  id: string
  icon: React.ReactNode
  label: string
  pattern: string
  summary: string
  runtimeCalls: string[]
  goroutines: string
  watch: string
}

const levels: Level[] = [
  {
    id: "l1",
    icon: <GitFork className="w-4 h-4" />,
    label: "Level 1",
    pattern: "Fan-out + buffered channel",
    summary: "One goroutine per byte. Each computes independently and sends its verdict into a shared buffered channel; main ranges over it until the channel closes.",
    runtimeCalls: ["runtime.newproc", "runtime.makechan", "runtime.chansend1", "runtime.chanrecv2"],
    goroutines: "16 one-shot goroutines, 1 collector",
    watch: "idx/b/chan/wg land in RAX/RBX/RCX/RDI, exactly as Part 1's ABIInternal table predicts.",
  },
  {
    id: "l2",
    icon: <Lock className="w-4 h-4" />,
    label: "Level 2",
    pattern: "Worker pool + mutex",
    summary: "A fixed pool of 4 workers pulls indices from a jobs channel and writes verdicts directly into a shared array, guarded by sync.Mutex instead of a channel.",
    runtimeCalls: ["sync.(*Mutex).Lock", "LOCK CMPXCHG", "sync.(*Mutex).Unlock", "sync.runtime_Semacquire"],
    goroutines: "4 persistent workers, bounded regardless of input size",
    watch: "The uncontended fast path is a single LOCK CMPXCHG, no syscall. Contention falls into lockSlow.",
  },
  {
    id: "l3",
    icon: <Timer className="w-4 h-4" />,
    label: "Level 3",
    pattern: "select + timeout, unbuffered channel",
    summary: "Each worker races a channel send against a 2s timeout via select. A deliberately unread decoy goroutine demonstrates a real goroutine leak.",
    runtimeCalls: ["runtime.selectgo", "runtime.gopark", "[chan send] (parked forever)"],
    goroutines: "16 workers + 1 permanently leaked goroutine",
    watch: "dlv goroutines catches the leak directly: one goroutine parked in [chan send], nobody listening.",
  },
]

export function ConcurrencyPatternsCompare() {
  const [active, setActive] = useState("l1")
  const sel = levels.find((l) => l.id === active) ?? levels[0]

  return (
    <div className="w-full max-w-4xl mx-auto my-8 not-prose">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-mono text-lg">Three Levels, Three Concurrency Patterns</CardTitle>
          <CardDescription>
            Same crackme shape, three different ways Go code coordinates goroutines. Click a level.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {levels.map((l) => (
              <button
                key={l.id}
                onClick={() => setActive(l.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-mono transition-colors",
                  active === l.id
                    ? "border-emerald-500/60 bg-emerald-500/10 text-foreground"
                    : "border-border bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                {l.icon}
                {l.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={sel.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-4"
            >
              <div>
                <div className="font-semibold text-sm">{sel.pattern}</div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">{sel.summary}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    Runtime calls to look for
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sel.runtimeCalls.map((c) => (
                      <Badge key={c} variant="secondary" className="text-xs font-mono">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    Goroutine shape
                  </div>
                  <p className="text-sm text-muted-foreground">{sel.goroutines}</p>
                </div>
              </div>

              <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Watch for: </span>
                  {sel.watch}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
