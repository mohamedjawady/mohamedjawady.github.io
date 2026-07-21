"use client"

import type { ReactNode } from "react"
import { ShieldCheck, Network, Layers, AlertTriangle, Radar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

function Section({ icon, title, subtitle, children }: { icon: ReactNode; title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-2 flex items-start gap-3">
        {icon}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

function RefTable({ head, rows }: { head: string[]; rows: (string | ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="text-left font-semibold px-3 py-2 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border/60 align-top">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ToolCard({ name, category, watches, examples }: { name: string; category: string; watches: string; examples: string[] }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between gap-2">
          {name}
          <Badge variant="outline" className="text-xs">{category}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-xs text-muted-foreground">{watches}</p>
        <div className="flex flex-wrap gap-1">
          {examples.map((e) => (
            <Badge key={e} variant="secondary" className="text-xs font-mono">{e}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function SecurityMonitoringToolsNotes() {
  return (
    <div className="space-y-10">
      <Alert>
        <ShieldCheck className="h-4 w-4" />
        <AlertDescription>
          Seven overlapping product categories, what each actually watches, how it detects, and where its blind spot is.
          Vendors blur these on purpose; the boundaries below are the ones that matter for reasoning about coverage.
        </AlertDescription>
      </Alert>

      <Section icon={<Layers className="h-6 w-6 mt-1" />} title="The Full Comparison" subtitle="One table, seven categories, no marketing">
        <RefTable
          head={["Category", "Watches", "Detection method", "Response capability", "Blind spot"]}
          rows={[
            ["AV", "Files on disk, pre-execution", "Signatures + heuristics", "Quarantine / delete", "Fileless malware, LOLBins, novel payloads"],
            ["EDR", "Process behavior, memory, network, files on one endpoint", "Behavioral analysis + telemetry", "Kill process, isolate host, rollback", "No cross-host correlation on its own; needs tuning against FPs"],
            ["XDR", "EDR telemetry fused with identity, email, cloud, and network signals", "Cross-domain correlation", "Coordinated response across all fused sources", "Only as good as what's actually plugged into it"],
            ["NDR", "Network traffic and flow metadata, encrypted or not", "Behavioral baselining of traffic, not signatures", "Alert; some can trigger firewall/NAC action", "No process-level attribution; sees the wire, not the endpoint"],
            ["IDS", "Network traffic, out-of-band (copy of traffic)", "Signature and/or anomaly rules", "Alert only, cannot block", "Cannot stop what it sees; misses encrypted payload content"],
            ["IPS", "Network traffic, inline (in the traffic path)", "Signature and/or anomaly rules", "Can drop/block in real time", "A false positive drops legitimate traffic; adds latency"],
            ["SIEM", "Logs and events forwarded from everything else", "Correlation rules, enrichment, search", "Alerting and reporting, not direct response", "Produces nothing itself; only as good as what feeds it"],
          ]}
        />
      </Section>

      <Section icon={<ShieldCheck className="h-6 w-6 mt-1" />} title="Endpoint Layer: AV → EDR → XDR" subtitle="Each one is a superset that adds a new dimension">
        <p className="text-sm text-muted-foreground">
          AV asks "is this file bad." EDR asks "is this <em>behavior</em> bad," which is why it catches fileless attacks and living-off-the-land
          binaries that never touch disk as a distinct malicious file. XDR then takes EDR's endpoint view and fuses it with identity, email,
          and cloud telemetry so an alert isn't just "process X did Y," it's "this user's identity, this endpoint, and this email all point
          to the same incident."
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ToolCard name="Antivirus" category="Signature-based" watches="Files on disk, pre-execution scanning" examples={["Microsoft Defender AV", "ClamAV", "ESET", "Kaspersky"]} />
          <ToolCard name="EDR" category="Behavioral, single endpoint" watches="Process trees, memory, network connections, file activity on one host" examples={["CrowdStrike Falcon", "SentinelOne", "Microsoft Defender for Endpoint", "Carbon Black"]} />
          <ToolCard name="XDR" category="Cross-domain correlation" watches="EDR + identity (Entra/AD) + email + cloud + network, fused into one incident graph" examples={["Microsoft Defender XDR", "Palo Alto Cortex XDR", "CrowdStrike XDR", "Trend Vision One"]} />
        </div>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            XDR is not a new sensor, it's a correlation layer over sensors you already have. An XDR platform with only EDR feeding it
            is functionally still an EDR with a different dashboard.
          </AlertDescription>
        </Alert>
      </Section>

      <Section icon={<Network className="h-6 w-6 mt-1" />} title="Network Layer: IDS vs IPS vs NDR" subtitle="Placement and detection philosophy differ, not just the acronym">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">IDS vs IPS: it's about placement</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong>IDS</strong> sits out-of-band on a tap or mirror port. It sees a <em>copy</em> of traffic, so it can alert but never block; a blocked packet has already been delivered by the time IDS sees the copy.</p>
              <p><strong>IPS</strong> sits inline, in the actual traffic path. It can drop a malicious packet before it reaches the target, at the cost of adding latency and the operational risk that a false positive blocks legitimate traffic.</p>
              <p className="text-xs">Same rule engines often run in both modes: Suricata and Snort can operate as either, and most next-gen firewalls run IPS functionality inline by default.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Where NDR fits</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>IDS/IPS are largely signature-driven: they catch known-bad patterns. NDR is behavioral: it baselines what's normal for a given network segment or host and flags deviation, closer in spirit to EDR but for the wire instead of the endpoint.</p>
              <p>NDR is what catches lateral movement and C2 that never trips a signature: unusual internal SMB traffic, a workstation suddenly talking to a domain controller like a DC would, beaconing patterns hidden in encrypted traffic via timing and volume.</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ToolCard name="IDS" category="Out-of-band, alert only" watches="Copy of traffic via tap or mirror port" examples={["Snort", "Suricata", "Zeek", "Security Onion"]} />
          <ToolCard name="IPS" category="Inline, can block" watches="Live traffic in the network path" examples={["Palo Alto NGFW", "Cisco Firepower", "Suricata (inline mode)"]} />
          <ToolCard name="NDR" category="Behavioral baselining" watches="Flow metadata and traffic patterns across the network" examples={["Darktrace", "ExtraHop", "Corelight", "Vectra AI"]} />
        </div>
      </Section>

      <Section icon={<Radar className="h-6 w-6 mt-1" />} title="The Aggregation Layer: SIEM" subtitle="Doesn't detect anything on its own; makes everything else searchable">
        <p className="text-sm text-muted-foreground">
          Every category above produces its own alerts in its own console. A SIEM's job is to be the one place all of that lands: it
          ingests logs from AV, EDR/XDR, IDS/IPS, NDR, firewalls, and applications, parses and enriches them, and applies correlation
          rules that can span sources no individual tool could see together on its own (a failed VPN login followed by an unusual
          Kerberos ticket request followed by a large outbound transfer, none of which is alarming alone).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToolCard name="SIEM" category="Log aggregation + correlation" watches="Everything forwarded to it, nothing on its own" examples={["Splunk", "Elastic Security", "Microsoft Sentinel", "IBM QRadar", "Google SecOps (Chronicle)"]} />
          <ToolCard name="SOAR (adjacent)" category="Automation on top of SIEM/EDR" watches="Alert data from connected tools, not raw telemetry" examples={["Splunk SOAR", "Microsoft Sentinel Playbooks", "Cortex XSOAR", "TheHive + Cortex"]} />
        </div>
        <Alert><AlertDescription className="text-xs">Garbage in, garbage out applies literally: a SIEM with poor log source coverage or bad parsing is a fast, expensive search box over incomplete data.</AlertDescription></Alert>
      </Section>

      <Section icon={<Layers className="h-6 w-6 mt-1" />} title="How They Actually Compose" subtitle="A realistic modern stack, layer by layer">
        <RefTable
          head={["Layer", "Role", "Typical products"]}
          rows={[
            ["Endpoint", "EDR/XDR agent on every workstation and server", "CrowdStrike, Defender for Endpoint, SentinelOne"],
            ["Network", "IDS/IPS at chokepoints, NDR watching internal east-west traffic", "Suricata/Zeek at the perimeter, Darktrace or Corelight internally"],
            ["Identity", "Feeds XDR and SIEM with auth and privilege signal", "Entra ID / Active Directory logs, Okta"],
            ["Aggregation", "SIEM centralizes everything above for search, correlation, and reporting", "Splunk, Sentinel, Elastic"],
            ["Response", "SOAR automates the repetitive parts of acting on what the SIEM surfaces", "Sentinel Playbooks, Cortex XSOAR"],
          ]}
        />
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            No single product in this table replaces another; each answers a different question. The SOC's actual detection
            surface is the union of what's deployed, not the most expensive single line item.
          </AlertDescription>
        </Alert>
      </Section>
    </div>
  )
}
