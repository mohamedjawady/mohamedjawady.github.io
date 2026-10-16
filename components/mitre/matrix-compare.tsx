"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface MatrixInfo {
  id: string
  label: string
  tactics: string
  environment: string
  realExample: string
}

const matrices: MatrixInfo[] = [
  {
    id: "enterprise",
    label: "Enterprise",
    tactics: "15 tactics",
    environment: "Windows/macOS/Linux endpoints, cloud identity, SaaS, containers, enterprise networks",
    realExample: "Mustang Panda's DLL side-loading (Part 1); Scattered Spider's help-desk social engineering (Part 2)",
  },
  {
    id: "mobile",
    label: "Mobile",
    tactics: "12 tactics",
    environment: "Android and iOS: apps, permissions, accessibility APIs, notifications, device-specific data",
    realExample: "FluBot (S1067) abusing Android Accessibility Services to read banking-app overlays and notifications",
  },
  {
    id: "ics",
    label: "ICS",
    tactics: "2 ICS-only impact tactics",
    environment: "Industrial control systems and OT: safety instrumented systems, protective relays, SCADA",
    realExample: "TRITON/TRISIS disabling a Schneider Electric safety controller; Industroyer2 opening grid breakers directly",
  },
]

export function MatrixCompare() {
  const [active, setActive] = useState("enterprise")
  const sel = matrices.find((m) => m.id === active)!

  return (
    <div className="w-full my-8 not-prose">
      <div className="rounded-lg border border-border p-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
          Three Matrices, Three Environments
        </div>

        <div className="flex gap-2 mb-4">
          {matrices.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={cn(
                "flex-1 px-3 py-2.5 rounded-lg border text-sm font-semibold transition-colors text-center",
                active === m.id
                  ? "border-emerald-500/60 bg-emerald-500/10 text-foreground"
                  : "border-border bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="rounded-md border border-border bg-muted/20 p-4 space-y-3">
          <div>
            <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              {sel.tactics}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{sel.environment}</p>
          </div>
          <div className="pt-2 border-t border-border">
            <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
              Real case from this series
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{sel.realExample}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
