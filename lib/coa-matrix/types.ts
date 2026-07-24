export type CoaActionKind = "passive" | "mitigating" | "restricted"

export interface CoaAction {
  id: string
  name: string
  kind: CoaActionKind
  blurb: string
}

export const COA_ACTIONS: CoaAction[] = [
  { id: "discover", name: "Discover", kind: "passive", blurb: "Search history: has this indicator appeared before?" },
  { id: "detect", name: "Detect", kind: "passive", blurb: "Alert if the indicator appears again in future." },
  { id: "deny", name: "Deny", kind: "mitigating", blurb: "Prevent the event outright." },
  { id: "disrupt", name: "Disrupt", kind: "mitigating", blurb: "Interfere mid-event to make it fail." },
  { id: "degrade", name: "Degrade", kind: "mitigating", blurb: "Slow it to buy response time." },
  { id: "deceive", name: "Deceive", kind: "mitigating", blurb: "Make the adversary believe they succeeded." },
  { id: "destroy", name: "Destroy", kind: "restricted", blurb: "Offensive action to remove capability (takedown, law enforcement)." },
]

export const KILL_CHAIN_PHASES = [
  "Reconnaissance",
  "Weaponization",
  "Delivery",
  "Exploitation",
  "Installation",
  "Command & Control",
  "Actions on Objectives",
]

export const COA_KIND_COLOR: Record<CoaActionKind, string> = {
  passive: "#0284c7",
  mitigating: "#059669",
  restricted: "#7c3aed",
}

export const COA_KIND_LABEL: Record<CoaActionKind, string> = {
  passive: "Passive (run every time)",
  mitigating: "Mitigating (choose one)",
  restricted: "Restricted (authority required)",
}

// Seeded from the worked C2-callback-domain example used in the Courses of Action blog post,
// one cell per (action, kill chain phase) pair. Null where the combination isn't meaningful.
export const COA_SEED_EXAMPLES: Record<string, (string | null)[]> = {
  discover: ["WHOIS history search", "Sample repo retrohunt", "Proxy log search", "EDR retrohunt", "Autoruns sweep", "DNS log retrohunt", "File access audit"],
  detect: ["New-domain alert", "YARA on inbound files", "URL signature", "Exploit signature", "Persistence rule", "Beacon analytic", "Exfil analytic"],
  deny: [null, null, "Attachment block", "Patch the CVE", "AppLocker rule", "DNS block", "Egress block"],
  disrupt: [null, null, "Quarantine email", "DEP / ASLR", "Sandboxing", "TCP reset", "Kill session on stage"],
  degrade: [null, null, "Sender rate limit", null, null, "Session rate limit", "Egress throttle"],
  deceive: ["Seed fake contacts", null, "Reroute to analysis", null, null, "Sinkhole to honeypot", "Sinkhole to honeypot"],
  destroy: [null, null, null, null, null, "Domain takedown", "LE arrest"],
}

export function coaCellKey(actionId: string, phaseIndex: number): string {
  return `${actionId}::${phaseIndex}`
}

export function seededCoaText(): Record<string, string> {
  const out: Record<string, string> = {}
  for (const action of COA_ACTIONS) {
    const row = COA_SEED_EXAMPLES[action.id]
    KILL_CHAIN_PHASES.forEach((_, phaseIndex) => {
      const value = row?.[phaseIndex]
      if (value) out[coaCellKey(action.id, phaseIndex)] = value
    })
  }
  return out
}
