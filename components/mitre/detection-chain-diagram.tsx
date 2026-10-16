"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stage {
  id: string
  label: string
  sublabel: string
  desc: string
}

const stages: Stage[] = [
  {
    id: "technique",
    label: "Technique",
    sublabel: "T1021.002",
    desc: "SMB/Windows Admin Shares. The behavior: an adversary with valid credentials reaches a remote host over SMB using ADMIN$ or C$ to move laterally, the exact pattern C0029 used with Impacket-style tooling.",
  },
  {
    id: "strategy",
    label: "Detection Strategy",
    sublabel: "DET0530",
    desc: "\"Multi-Event Detection for SMB Admin Share Lateral Movement.\" The high-level approach: don't trust one event, correlate SMB share access with what happens on the target right after.",
  },
  {
    id: "analytic",
    label: "Analytic",
    sublabel: "AN1468",
    desc: "The platform-agnostic logic: SMB-based remote file share access to ADMIN$ or C$, followed by remote service creation, task scheduling, or suspicious process execution on the same target host.",
  },
  {
    id: "telemetry",
    label: "Telemetry It Needs",
    sublabel: "What has to actually be collected",
    desc: "Network share access (Windows Event ID 5140), the logon that preceded it (4624, LogonType 3), and what happened next on the target: new service installation (7045) or a suspicious child process.",
  },
]

export function DetectionChainDiagram() {
  const [active, setActive] = useState(0)

  return (
    <div className="w-full max-w-4xl mx-auto my-8 not-prose">
      <div className="rounded-lg border border-border p-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
          From Technique to Telemetry: T1021.002, for Real
        </div>

        <div className="flex flex-wrap items-center gap-1 mb-4">
          {stages.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => setActive(i)}
                className={cn(
                  "px-3 py-2 rounded-lg border text-sm font-medium transition-colors text-left",
                  active === i
                    ? "border-emerald-500/60 bg-emerald-500/10 text-foreground"
                    : "border-border bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground",
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

        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-1">{stages[active].sublabel}</div>
          <div className="text-sm font-semibold mb-2">{stages[active].label}</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{stages[active].desc}</p>
        </div>
      </div>
    </div>
  )
}
