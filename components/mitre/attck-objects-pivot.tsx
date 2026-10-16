"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ObjectInfo {
  id: string
  label: string
  question: string
  forC0029: string
}

const objects: ObjectInfo[] = [
  {
    id: "technique",
    label: "Techniques",
    question: "What behavior was used?",
    forC0029: "28 distinct techniques, from Exploit Public-Facing Application to Indicator Removal. This is the layer that's actually populated and specific.",
  },
  {
    id: "group",
    label: "Groups",
    question: "Who is this associated with?",
    forC0029: "Nothing. C0029's campaign page has no Groups field. Only prose naming UNC5221/UTA0178 and UNC5325, Mandiant's own uncategorized-cluster designators, not a formal ATT&CK group.",
  },
  {
    id: "software",
    label: "Software",
    question: "What tools were used?",
    forC0029: "12 tools: custom malware built for this campaign (ZIPLINE, BUSHWALK, WIREFIRE) alongside publicly available pentest tools (Impacket, CrackMapExec) that hundreds of unrelated actors also use.",
  },
  {
    id: "campaign",
    label: "Campaigns",
    question: "Which tracked operation?",
    forC0029: "C0029, \"Cutting Edge.\" Active Dec 2023-Feb 2024, chained two Ivanti Connect Secure zero-days. One of its victims, confirmed by MITRE's own incident report, was MITRE itself.",
  },
]

export function ATTCKObjectsPivot() {
  const [active, setActive] = useState("campaign")
  const sel = objects.find((o) => o.id === active)!

  return (
    <div className="w-full my-8 not-prose">
      <div className="rounded-lg border border-border p-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
          C0029, Walked Through Each Object Type
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {objects.map((o) => (
            <button
              key={o.id}
              onClick={() => setActive(o.id)}
              className={cn(
                "px-3 py-2.5 rounded-lg border text-sm font-semibold transition-colors text-center",
                active === o.id
                  ? "border-emerald-500/60 bg-emerald-500/10 text-foreground"
                  : "border-border bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>

        <div className="rounded-md border border-border bg-muted/20 p-4">
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            {sel.question}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{sel.forC0029}</p>
        </div>
      </div>
    </div>
  )
}
