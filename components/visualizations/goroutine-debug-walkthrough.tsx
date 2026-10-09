"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pause, Play, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type ThreadState = "idle" | "busy"
type ChipState = "spawning" | "running" | "parked" | "done"

interface Chip {
  id: string
  label: string
  thread: number // index into threads, -1 = not yet scheduled
  state: ChipState
}

interface Step {
  id: string
  title: string
  command: string
  note: string
  threads: ThreadState[]
  chips: Chip[]
}

const steps: Step[] = [
  {
    id: "build",
    title: "1. Build with debug info",
    command: 'go build -gcflags="all=-N -l" -o crackme.exe main.go',
    note: "No optimization, no inlining. The disassembly will match the source one line at a time.",
    threads: ["idle"],
    chips: [],
  },
  {
    id: "break-main",
    title: "2. Break on main.main",
    command: "break 'main.main'\nrun G0R0UT1NES_YEAH!",
    note: "GDB reports 5 new OS threads before a single line of our code runs. Those are the Go scheduler's own M's, spun up for GOMAXPROCS, not anything we spawned.",
    threads: ["busy", "idle", "idle", "idle", "idle"],
    chips: [],
  },
  {
    id: "spawn",
    title: "3. 16 goroutines spawn",
    command: "for i := range candidate { go checkByte(i, ...) }",
    note: "runtime.newproc is called once per go statement in the source, sixteen times at runtime. The scheduler fans every goroutine across the same handful of OS threads.",
    threads: ["busy", "busy", "busy", "busy", "busy"],
    chips: Array.from({ length: 16 }, (_, i) => ({
      id: `g${i}`,
      label: `g${i}`,
      thread: i % 5,
      state: "running" as ChipState,
    })),
  },
  {
    id: "break-checkbyte",
    title: "4. Break on checkByte, read registers",
    command: "break 'main.checkByte'\ninfo registers rax rbx rcx rdi",
    note: "idx lands in RAX, b in RBX, the channel in RCX, *sync.WaitGroup in RDI. That's Part 1's ABIInternal table, confirmed live across two different threads mid-execution.",
    threads: ["busy", "busy", "idle", "idle", "idle"],
    chips: Array.from({ length: 16 }, (_, i) => ({
      id: `g${i}`,
      label: `g${i}`,
      thread: i < 2 ? i : -1,
      state: i < 2 ? ("parked" as ChipState) : ("done" as ChipState),
    })),
  },
  {
    id: "chansend",
    title: "5. Each worker sends its verdict",
    command: "out <- result{index: idx, ok: transformed == target[idx]}",
    note: "runtime.chansend1 hands the result struct to the buffered channel. sete, not a branch, computes result.ok.",
    threads: ["idle", "idle", "idle", "idle", "idle"],
    chips: Array.from({ length: 16 }, (_, i) => ({
      id: `g${i}`,
      label: `g${i}`,
      thread: -1,
      state: "done" as ChipState,
    })),
  },
  {
    id: "collect",
    title: "6. main collects and prints the verdict",
    command: "for r := range results { votes[r.index] = r.ok }",
    note: "runtime.chanrecv2 drains the channel until it's closed, then fmt.Println reports Access Granted or Access Denied.",
    threads: ["busy", "idle", "idle", "idle", "idle"],
    chips: [],
  },
]

const STEP_MS = 3200

export function GoroutineDebugWalkthrough() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % steps.length)
    }, STEP_MS)
    return () => clearInterval(t)
  }, [playing])

  const step = steps[index]
  const maxThreads = 5

  return (
    <div className="w-full max-w-4xl mx-auto my-8 not-prose">
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="font-mono text-lg">GDB Walkthrough: Level 1</CardTitle>
              <CardDescription>
                What the scheduler and the debugger were each doing at every step of the Level 1 session above.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs shrink-0">
              {index + 1} / {steps.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Thread / goroutine lane diagram */}
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
              OS Threads (M)
            </div>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {Array.from({ length: maxThreads }, (_, t) => {
                const busy = step.threads[t] === "busy"
                return (
                  <div
                    key={t}
                    className={cn(
                      "h-10 rounded-md border flex items-center justify-center text-xs font-mono transition-colors duration-300",
                      busy
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-border bg-background text-muted-foreground",
                    )}
                  >
                    thread {t}
                  </div>
                )
              })}
            </div>

            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
              Goroutines
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[2.5rem]">
              <AnimatePresence mode="popLayout">
                {step.chips.map((c) => (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.25 }}
                    className={cn(
                      "px-2 py-1 rounded text-[11px] font-mono border",
                      c.state === "running" && "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                      c.state === "parked" && "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400",
                      c.state === "done" && "border-border bg-muted/40 text-muted-foreground",
                    )}
                    title={c.thread >= 0 ? `on thread ${c.thread}` : "finished"}
                  >
                    {c.label}
                  </motion.div>
                ))}
              </AnimatePresence>
              {step.chips.length === 0 && (
                <span className="text-xs text-muted-foreground italic">no goroutines yet</span>
              )}
            </div>
          </div>

          {/* Step detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-semibold text-sm mb-2">{step.title}</div>
              <pre className="rounded-md bg-muted p-3 text-xs font-mono overflow-x-auto mb-2 whitespace-pre-wrap">
                {step.command}
              </pre>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.note}</p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <button
              onClick={() => {
                setPlaying(false)
                setIndex((i) => (i - 1 + steps.length) % steps.length)
              }}
              className="p-2 rounded-md border border-border hover:border-emerald-500/40 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setPlaying((p) => !p)}
              className="flex items-center gap-2 px-3 py-2 rounded-md border border-border hover:border-emerald-500/40 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing ? "Pause" : "Play"}
            </button>

            <button
              onClick={() => {
                setPlaying(false)
                setIndex((i) => (i + 1) % steps.length)
              }}
              className="p-2 rounded-md border border-border hover:border-emerald-500/40 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Next step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
