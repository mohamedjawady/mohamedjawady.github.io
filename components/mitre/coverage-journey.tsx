"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stage {
  id: string
  label: string
  color: string
  desc: string
}

const stages: Stage[] = [
  {
    id: "unknown",
    label: "Unknown",
    color: "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400",
    desc: "Start of Part 5: T1021.002 is on a Navigator layer because C0029 used it. Nobody has checked whether the required telemetry (Event IDs 5140, 4624, 7045, 4648) is even being collected.",
  },
  {
    id: "claimed",
    label: "Claimed",
    color: "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    desc: "AN1468 exists on the technique page, and the telemetry mapping looks right on paper. Nobody has run an authorized test against it yet. This is the most dangerous state to mistake for done.",
  },
  {
    id: "validated",
    label: "Validated",
    color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    desc: "End of Part 5's five-step process: an authorized admin-share-plus-remote-service test generated the expected events, the correlation fired, and the resulting alert carried enough context to investigate.",
  },
]

export function CoverageJourney() {
  const [active, setActive] = useState(2)

  return (
    <div className="w-full max-w-4xl mx-auto my-8 not-prose">
      <div className="rounded-lg border border-border p-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
          T1021.002&apos;s Own Journey Through This Series
        </div>

        <div className="flex items-center gap-1 mb-4">
          {stages.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button
                onClick={() => setActive(i)}
                className={cn(
                  "flex-1 px-3 py-2.5 rounded-lg border text-sm font-semibold transition-colors text-center",
                  active === i ? s.color : "border-border bg-muted/20 text-muted-foreground hover:border-border",
                )}
              >
                {s.label}
              </button>
              {i < stages.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground/40 mx-1 shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="rounded-md border border-border bg-muted/20 p-4">
          <p className="text-sm text-muted-foreground leading-relaxed">{stages[active].desc}</p>
        </div>
      </div>
    </div>
  )
}
