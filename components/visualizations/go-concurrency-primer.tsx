"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type TabId = "gmp" | "chan" | "mutex" | "select"

const tabs: { id: TabId; label: string }[] = [
  { id: "gmp", label: "Goroutines (GMP)" },
  { id: "chan", label: "Channels (hchan)" },
  { id: "mutex", label: "Mutex" },
  { id: "select", label: "select" },
]

function GMPDiagram() {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[0, 1].map((p) => (
          <div key={p} className="rounded-md border border-emerald-500/40 bg-emerald-500/5 p-2.5">
            <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-2">P{p} (processor)</div>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: p === 0 ? 4 : 2 }, (_, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono">
                  G{p * 4 + i}
                </span>
              ))}
            </div>
            <div className="text-[10px] text-muted-foreground mt-2">local run queue</div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-emerald-500" /> bound to M{p}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-md border border-border bg-background p-2.5">
        <div className="text-xs font-mono text-muted-foreground mb-1">global run queue</div>
        <div className="flex flex-wrap gap-1">
          {["G6", "G7"].map((g) => (
            <span key={g} className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ChanDiagram() {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
      <div className="text-xs font-mono text-muted-foreground">runtime.hchan</div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[0, 1, 2].map((i) => (
          <div key={i} className={cn("h-10 rounded border flex items-center justify-center text-xs font-mono",
            i === 0 ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-border bg-background text-muted-foreground")}>
            {i === 0 ? "val" : "empty"}
          </div>
        ))}
      </div>
      <div className="text-[10px] text-muted-foreground text-center">ring buffer (dataqsiz slots)</div>
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="rounded-md border border-border bg-background p-2">
          <div className="text-[10px] font-mono text-muted-foreground mb-1">sendq</div>
          <div className="text-xs font-mono text-muted-foreground">parked senders (sudog)</div>
        </div>
        <div className="rounded-md border border-border bg-background p-2">
          <div className="text-[10px] font-mono text-muted-foreground mb-1">recvq</div>
          <div className="text-xs font-mono text-muted-foreground">parked receivers (sudog)</div>
        </div>
      </div>
    </div>
  )
}

function MutexDiagram() {
  const [locked, setLocked] = useState(false)
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
      <button
        onClick={() => setLocked((l) => !l)}
        className={cn(
          "w-full h-16 rounded-md border font-mono text-sm flex items-center justify-center transition-colors",
          locked
            ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
            : "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        )}
      >
        state = {locked ? "1 (locked)" : "0 (unlocked)"}
      </button>
      <p className="text-xs text-muted-foreground text-center">click to toggle, like a goroutine calling Lock()/Unlock()</p>
      <div className="text-xs font-mono text-muted-foreground bg-background rounded p-2 border border-border">
        lock cmpxchg [state], 1 {"->"} {locked ? "fails, falls into lockSlow" : "succeeds, returns immediately"}
      </div>
    </div>
  )
}

function SelectDiagram() {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {["case A", "case B", "time.After"].map((c, i) => (
          <div key={c} className={cn("h-10 rounded border flex items-center justify-center text-xs font-mono",
            i === 1 ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "border-border bg-background text-muted-foreground")}>
            {c}
          </div>
        ))}
      </div>
      <div className="text-[10px] text-muted-foreground text-center">
        selectgo parks the goroutine on every channel at once; the first one ready wins, the rest are torn down
      </div>
    </div>
  )
}

export function GoConcurrencyPrimer() {
  const [active, setActive] = useState<TabId>("gmp")

  const content: Record<TabId, { diagram: React.ReactNode; body: string }> = {
    gmp: {
      diagram: <GMPDiagram />,
      body: "Every goroutine is a G: a lightweight unit of work with its own small, growable stack (the cmp rsp, [r14+0x10] check at the top of every function in this series exists to grow it). A G can't run on its own, it needs an M (an OS thread) and a P (a processor, a scheduling context; there are GOMAXPROCS of them). Each P keeps a local run queue of runnable G's; when an M needs work, it pulls from its P's queue, steals from another P's queue, or checks the global queue. This is why 16 goroutines ran across only 5 OS threads in Level 1: the scheduler multiplexes G's onto a small, fixed pool of M's through P's, not one thread per goroutine.",
    },
    chan: {
      diagram: <ChanDiagram />,
      body: "A channel is runtime.hchan: a ring buffer for buffered sends, plus two wait queues, sendq and recvq, each a linked list of sudog (a goroutine parked waiting to send or receive). An internal lock guards all of it. A buffered send with room just copies into the next free slot. An unbuffered send (Level 3's results channel) skips the buffer entirely: if a receiver is already parked in recvq, the value is copied directly from sender to receiver's stack and the receiver is woken, a direct handoff. If nobody's listening, the sender parks itself on sendq instead, which is exactly the leak Level 3 catches live with Delve.",
    },
    mutex: {
      diagram: <MutexDiagram />,
      body: "sync.Mutex is a single word of state. Lock()'s fast path is one atomic instruction: lock cmpxchg tries to flip the state from 0 to 1. Uncontended, that succeeds and the function returns immediately, no scheduler involvement at all, which is exactly what Level 2's disassembly shows. Contended, the CAS fails and the call falls into lockSlow, which eventually parks the goroutine via a semaphore (sync.runtime_Semacquire) until the holder calls Unlock(). The fast path is why mutexes are cheap when uncontended and why Level 2's goroutine dump showed main blocked in semacquire while waiting on the WaitGroup, the same underlying mechanism.",
    },
    select: {
      diagram: <SelectDiagram />,
      body: "Every select with more than one case compiles to a single call: runtime.selectgo, regardless of how many cases it has. It shuffles the case order for fairness, then does one pass checking if any case can proceed immediately. If one can, it runs. If none can, the goroutine registers a sudog on every channel involved simultaneously and parks. Whichever channel becomes ready first wakes the goroutine, which then removes its sudog from all the other channels it had registered on. Level 3's watchdog pattern, racing a channel send against time.After, is exactly this: two cases, one wait, whichever resolves first wins.",
    },
  }

  const sel = content[active]

  return (
    <div className="w-full max-w-4xl mx-auto my-8 not-prose">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="font-mono text-lg">How These Primitives Actually Work</CardTitle>
          <CardDescription>
            Before reversing them: what a goroutine, a channel, a mutex, and select actually are under the hood.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={cn(
                  "px-3 py-2 rounded-lg border text-sm font-mono transition-colors",
                  active === t.id
                    ? "border-emerald-500/60 bg-emerald-500/10 text-foreground"
                    : "border-border bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start"
            >
              {sel.diagram}
              <p className="text-sm text-muted-foreground leading-relaxed">{sel.body}</p>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}
