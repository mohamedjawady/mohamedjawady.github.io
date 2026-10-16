"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stage {
  id: string
  label: string
  question: string
  tool: string
  desc: string
}

const stages: Stage[] = [
  {
    id: "understand",
    label: "Understand the Threat",
    question: "How do adversaries actually operate?",
    tool: "ATT&CK describes it",
    desc: "Pull in real adversary behavior from threat intelligence: CTI reports, incident data, public research. ATT&CK is the shared vocabulary for writing that behavior down.",
  },
  {
    id: "improve",
    label: "Improve Defenses",
    question: "What can we build or change to respond to that behavior?",
    tool: "D3FEND structures it",
    desc: "Turn understanding into preventive, detective, and response capability: new detections, hardened configurations, better telemetry.",
  },
  {
    id: "test",
    label: "Test and Measure",
    question: "Do our defenses actually work against that behavior?",
    tool: "ATT&CK Evaluations provide evidence",
    desc: "Emulate the adversary behavior for real and watch what the defense does, rather than assuming a control works because it's installed.",
  },
  {
    id: "learn",
    label: "Learn and Repeat",
    question: "What did the test tell us, and what should we fix first?",
    tool: "INFORM assesses the program",
    desc: "Use the test results to prioritize the next round of improvements, and to understand the maturity of the program doing all of this.",
  },
]

export function TIDLoopDiagram() {
  const [active, setActive] = useState(0)
  const sel = stages[active]

  return (
    <div className="w-full my-8 not-prose">
      <div className="rounded-lg border border-border p-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
          The Threat-Informed Defense Loop
        </div>
        <div className="flex flex-wrap items-center gap-1 mb-4">
          {stages.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                onClick={() => setActive(i)}
                className={cn(
                  "px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
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
          <ArrowRight className="w-4 h-4 text-muted-foreground/20 mx-1 shrink-0 rotate-[135deg]" />
        </div>

        <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4">
          <p className="text-sm font-medium mb-1">{sel.question}</p>
          <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-2">{sel.tool}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{sel.desc}</p>
        </div>
      </div>
    </div>
  )
}
