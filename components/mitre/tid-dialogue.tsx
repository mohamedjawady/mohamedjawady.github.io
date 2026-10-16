import type React from "react"
import { cn } from "@/lib/utils"

export type Speaker = "facilitator" | "soc" | "cti" | "detection" | "lead"

interface SpeakerMeta {
  name: string
  role: string
  initials: string
  color: string
}

export const SPEAKERS: Record<Speaker, SpeakerMeta> = {
  facilitator: {
    name: "Sam Reyes",
    role: "Threat-Informed Defense Lead",
    initials: "SR",
    color: "border-slate-400/50 bg-slate-400/10 text-slate-600 dark:text-slate-300",
  },
  soc: {
    name: "Priya Nair",
    role: "SOC Analyst",
    initials: "PN",
    color: "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  cti: {
    name: "Marcus Webb",
    role: "CTI Analyst",
    initials: "MW",
    color: "border-purple-500/50 bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  detection: {
    name: "Elena Cruz",
    role: "Detection Engineer",
    initials: "EC",
    color: "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  lead: {
    name: "Jordan Okafor",
    role: "Security Program Lead",
    initials: "JO",
    color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
}

export interface DialogueLine {
  speaker: Speaker
  text: string
}

interface TIDDialogueProps {
  title: string
  lines: DialogueLine[]
}

export function TIDDialogue({ title, lines }: TIDDialogueProps) {
  return (
    <div className="w-full my-8 not-prose">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="bg-muted/40 border-b border-border px-4 py-2.5">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Dialogue</span>
          <div className="text-sm font-medium mt-0.5">{title}</div>
        </div>
        <div className="divide-y divide-border/60">
          {lines.map((line, i) => {
            const meta = SPEAKERS[line.speaker]
            return (
              <div key={i} className="flex gap-3 px-4 py-3">
                <div
                  className={cn(
                    "shrink-0 w-9 h-9 rounded-full border flex items-center justify-center text-xs font-mono font-semibold",
                    meta.color,
                  )}
                  title={`${meta.name} — ${meta.role}`}
                >
                  {meta.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-sm font-semibold">{meta.name}</span>
                    <span className="text-xs text-muted-foreground">{meta.role}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{line.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
