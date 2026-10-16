"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface Branch {
  tactic: string
  why: string
}

interface TechniqueTacticBranchesProps {
  techniqueId: string
  techniqueName: string
  branches: Branch[]
}

export function TechniqueTacticBranches({ techniqueId, techniqueName, branches }: TechniqueTacticBranchesProps) {
  const [active, setActive] = useState(0)
  const sel = branches[active]

  return (
    <div className="w-full my-8 not-prose">
      <div className="rounded-lg border border-border p-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
          One Technique, Several Objectives
        </div>

        <div className="flex justify-center mb-4">
          <div className="px-4 py-2.5 rounded-lg border border-emerald-500/60 bg-emerald-500/10 text-center">
            <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400">{techniqueId}</div>
            <div className="text-sm font-semibold">{techniqueName}</div>
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <svg width="2" height="24" className="text-border">
            <line x1="1" y1="0" x2="1" y2="24" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className={cn("grid gap-2 mb-4", branches.length <= 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4")}>
          {branches.map((b, i) => (
            <button
              key={b.tactic}
              onClick={() => setActive(i)}
              className={cn(
                "px-2 py-2 rounded-md border text-xs font-medium transition-colors text-center",
                active === i
                  ? "border-emerald-500/60 bg-emerald-500/10 text-foreground"
                  : "border-border bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {b.tactic}
            </button>
          ))}
        </div>

        <div className="rounded-md border border-border bg-muted/20 p-4">
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
            As {sel.tactic}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{sel.why}</p>
        </div>
      </div>
    </div>
  )
}
