"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface OrgNode {
  id: string
  label: string
  sublabel: string
  desc: string
}

const nodes: OrgNode[] = [
  {
    id: "mitre",
    label: "MITRE Corporation",
    sublabel: "Parent not-for-profit",
    desc: "Operates several federally funded R&D centers. ATT&CK itself is maintained by MITRE directly, not by Engenuity specifically.",
  },
  {
    id: "engenuity",
    label: "MITRE Engenuity",
    sublabel: "Operating entity",
    desc: "Runs multiple cybersecurity initiatives under one roof. Not a peer of CTID, it's the organization CTID operates inside of.",
  },
  {
    id: "ctid",
    label: "Center for Threat-Informed Defense",
    sublabel: "Research program under Engenuity",
    desc: "Privately funded, ~3 dozen member organizations. Produces Navigator, Workbench, the Technique Inference Engine, and INFORM.",
  },
  {
    id: "evals",
    label: "ATT&CK Evaluations",
    sublabel: "Testing program under Engenuity",
    desc: "A separate program, also under Engenuity, that runs public adversary emulation against commercial security products.",
  },
]

export function TIDOrgChart() {
  const [active, setActive] = useState("ctid")
  const sel = nodes.find((n) => n.id === active)!

  return (
    <div className="w-full my-8 not-prose">
      <div className="rounded-lg border border-border p-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
          Who Actually Runs What
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setActive("mitre")}
            className={cn(
              "px-4 py-2 rounded-lg border text-sm font-medium transition-colors w-full max-w-xs text-center",
              active === "mitre" ? "border-emerald-500/60 bg-emerald-500/10" : "border-border bg-muted/20 hover:border-border",
            )}
          >
            MITRE Corporation
          </button>
          <div className="w-px h-5 bg-border" />
          <button
            onClick={() => setActive("engenuity")}
            className={cn(
              "px-4 py-2 rounded-lg border text-sm font-medium transition-colors w-full max-w-xs text-center",
              active === "engenuity" ? "border-emerald-500/60 bg-emerald-500/10" : "border-border bg-muted/20 hover:border-border",
            )}
          >
            MITRE Engenuity
          </button>
          <div className="w-px h-5 bg-border" />
          <div className="flex gap-3 w-full max-w-md justify-center">
            <button
              onClick={() => setActive("ctid")}
              className={cn(
                "flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors text-center",
                active === "ctid" ? "border-emerald-500/60 bg-emerald-500/10" : "border-border bg-muted/20 hover:border-border",
              )}
            >
              CTID
            </button>
            <button
              onClick={() => setActive("evals")}
              className={cn(
                "flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors text-center",
                active === "evals" ? "border-emerald-500/60 bg-emerald-500/10" : "border-border bg-muted/20 hover:border-border",
              )}
            >
              ATT&CK Evaluations
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="text-sm font-semibold mb-0.5">{sel.label}</div>
          <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-2">{sel.sublabel}</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{sel.desc}</p>
        </div>
      </div>
    </div>
  )
}
