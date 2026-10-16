"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface Mitigation {
  id: string
  name: string
  use: string
  mechanism: string
  d3fend: string[]
}

const mitigations: Mitigation[] = [
  {
    id: "M1037",
    name: "Filter Network Traffic",
    use: "Consider using the host firewall to restrict file sharing communications such as SMB.",
    mechanism: "Reduce likelihood. If SMB can't reach most hosts from most sources, the lateral-movement path AN1468 watches for mostly stops being reachable in the first place.",
    d3fend: ["D3-NI: Network Isolation"],
  },
  {
    id: "M1035",
    name: "Limit Access to Resource Over Network",
    use: "Consider disabling Windows administrative shares.",
    mechanism: "Reduce likelihood, aggressively. Removes the mechanism entirely, but breaks legitimate remote administration tooling many IT teams depend on. High prevention value, high operational cost.",
    d3fend: [],
  },
  {
    id: "M1027",
    name: "Password Policies",
    use: "Do not reuse local administrator passwords across systems; enforce complexity and uniqueness.",
    mechanism: "Increase attacker cost and reduce blast radius. A cracked local admin password on one host stops being a skeleton key for every other host.",
    d3fend: ["D3-SPP: Strong Password Policy"],
  },
  {
    id: "M1026",
    name: "Privileged Account Management",
    use: "Deny remote use of local admin credentials to log into systems; keep domain users out of local Administrators groups.",
    mechanism: "Reduce blast radius. Close to free operationally, and the single highest-leverage item on this list for limiting how far one compromised account actually reaches.",
    d3fend: ["D3-LAM: Local Account Monitoring", "D3-DAM: Domain Account Monitoring"],
  },
]

export function MitigationD3FENDMap() {
  const [active, setActive] = useState(0)
  const sel = mitigations[active]

  return (
    <div className="w-full my-8 not-prose">
      <div className="rounded-lg border border-border p-4">
        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-4">
          T1021.002&apos;s Four Real Mitigations
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {mitigations.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(i)}
              className={cn(
                "px-2 py-2 rounded-md border text-xs font-mono font-semibold transition-colors text-center",
                active === i
                  ? "border-emerald-500/60 bg-emerald-500/10 text-foreground"
                  : "border-border bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {m.id}
            </button>
          ))}
        </div>

        <div className="rounded-md border border-border bg-muted/20 p-4 space-y-3">
          <div>
            <div className="text-sm font-semibold">{sel.name}</div>
            <p className="text-xs text-muted-foreground italic mt-1">&ldquo;{sel.use}&rdquo;</p>
          </div>
          <div className="pt-2 border-t border-border">
            <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
              Risk mechanism
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{sel.mechanism}</p>
          </div>
          {sel.d3fend.length > 0 && (
            <div className="pt-2 border-t border-border">
              <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">
                D3FEND techniques
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sel.d3fend.map((d) => (
                  <span key={d} className="text-xs font-mono px-2 py-1 rounded bg-background border border-border">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
