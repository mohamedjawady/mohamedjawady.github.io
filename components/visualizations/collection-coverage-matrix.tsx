"use client"

import { Fragment, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp } from "lucide-react"

type Visibility = "full" | "partial" | "blind"

interface Source {
	id: string
	name: string
	dataType: string
	retentionDays: number
	followOn: string
	blindSpot: string
	coverage: Visibility[]
}

const phases = ["Recon", "Weapon.", "Delivery", "Exploit", "Install", "C2", "Actions"]

const sources: Source[] = [
	{
		id: "email",
		name: "Email Gateway",
		dataType: "Message metadata, verdicts, attachments",
		retentionDays: 90,
		followOn: "Original message and attachment retrieval for detonation and analysis",
		blindSpot: "Anything after the click: sees the lure arrive, never what it did",
		coverage: ["partial", "blind", "full", "partial", "blind", "blind", "blind"],
	},
	{
		id: "edr",
		name: "EDR (Workstations)",
		dataType: "Process, file, registry, network telemetry",
		retentionDays: 30,
		followOn: "Triage package collection, memory capture, live response",
		blindSpot: "Deployed on workstations only: the server estate is dark",
		coverage: ["blind", "blind", "partial", "full", "full", "partial", "partial"],
	},
	{
		id: "wef",
		name: "Windows Event Forwarding",
		dataType: "Host event logs (auth, services, tasks)",
		retentionDays: 180,
		followOn: "Targeted log pulls from systems outside the forwarding set",
		blindSpot: "Only the event IDs someone chose to forward, years ago",
		coverage: ["blind", "blind", "blind", "partial", "full", "blind", "partial"],
	},
	{
		id: "dns",
		name: "DNS Resolver Logs",
		dataType: "Query and response records",
		retentionDays: 14,
		followOn: "Passive DNS enrichment, domain infrastructure pivoting",
		blindSpot: "Encrypted DNS (DoH) bypasses the resolver entirely",
		coverage: ["blind", "blind", "partial", "blind", "blind", "full", "partial"],
	},
	{
		id: "proxy",
		name: "Web Proxy",
		dataType: "HTTP/S requests, categories, verdicts",
		retentionDays: 60,
		followOn: "Full URL retrieval, download sample recovery",
		blindSpot: "Traffic that never crosses it: direct-to-IP, non-web ports",
		coverage: ["blind", "blind", "full", "partial", "blind", "full", "partial"],
	},
	{
		id: "netflow",
		name: "Netflow",
		dataType: "Connection metadata, volumes, timing",
		retentionDays: 14,
		followOn: "Packet capture on flagged flows where sensors exist",
		blindSpot: "No content at all: sees that a conversation happened, never what was said",
		coverage: ["partial", "blind", "blind", "blind", "blind", "partial", "partial"],
	},
	{
		id: "idp",
		name: "IdP / SSO Logs",
		dataType: "Authentication events, token grants, MFA",
		retentionDays: 365,
		followOn: "Session revocation, per-app access review",
		blindSpot: "Local accounts and anything not behind the IdP",
		coverage: ["partial", "blind", "blind", "partial", "blind", "blind", "partial"],
	},
	{
		id: "cloud",
		name: "Cloud Audit Logs",
		dataType: "Control plane and data access events",
		retentionDays: 90,
		followOn: "Per-service data-plane log enablement, snapshot forensics",
		blindSpot: "Enabled on the production tenant only; dev and shadow tenants are dark",
		coverage: ["partial", "blind", "blind", "partial", "partial", "blind", "full"],
	},
]

const timePresets = [7, 30, 60, 90, 180]

const visStyles: Record<Visibility, { cell: string; label: string }> = {
	full: { cell: "bg-emerald-500/80 dark:bg-emerald-500/60", label: "Sees it" },
	partial: { cell: "bg-amber-400/70 dark:bg-amber-500/50", label: "Partial" },
	blind: { cell: "bg-muted", label: "Blind" },
}

export function CollectionCoverageMatrix() {
	const [openSource, setOpenSource] = useState<string | null>(null)
	const [daysAgo, setDaysAgo] = useState<number>(7)

	const aliveCount = sources.filter((s) => s.retentionDays >= daysAgo).length

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6 my-8">
			<Card className="border-border/50 shadow-lg">
				<CardHeader>
					<CardTitle>Collection Coverage Matrix</CardTitle>
					<CardDescription>
						Eight typical sources against the kill chain. Click a source for its data type, retention, and blind
						spots. Then move the incident back in time and watch sources fall out of the fight as retention expires.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">

					{/* Time control */}
					<div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
						<div className="text-sm">
							<span className="font-semibold">The incident happened </span>
							<Badge className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-mono text-xs mx-1">{daysAgo} days ago</Badge>
							<span className="text-muted-foreground text-xs block sm:inline sm:ml-2">
								{aliveCount} of {sources.length} sources still hold data
							</span>
						</div>
						<div className="flex gap-1.5">
							{timePresets.map((d) => (
								<button
									key={d}
									onClick={() => setDaysAgo(d)}
									className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
										daysAgo === d
											? "bg-red-600 text-white border-red-600 shadow-sm"
											: "bg-background border-border/60 hover:border-red-400"
									}`}
								>
									{d}d
								</button>
							))}
						</div>
					</div>

					{/* Legend */}
					<div className="flex flex-wrap items-center gap-3">
						{(Object.keys(visStyles) as Visibility[]).map((v) => (
							<span key={v} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
								<span className={`w-4 h-4 rounded ${visStyles[v].cell} border border-border/40`} />
								{visStyles[v].label}
							</span>
						))}
						<span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
							<span className="w-4 h-4 rounded bg-muted border border-red-400 border-dashed opacity-50" />
							Retention expired
						</span>
					</div>

					{/* Matrix */}
					<div className="w-full overflow-x-auto">
						<table className="w-full border-collapse min-w-[640px]">
							<thead>
								<tr>
									<th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-2 border-b border-border/50 w-[26%]">Source</th>
									{phases.map((p) => (
										<th key={p} className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider p-2 border-b border-border/50">
											{p}
										</th>
									))}
									<th className="text-center text-[10px] font-semibold text-muted-foreground uppercase tracking-wider p-2 border-b border-border/50">Keeps</th>
								</tr>
							</thead>
							<tbody>
								{sources.map((s) => {
									const expired = s.retentionDays < daysAgo
									const isOpen = openSource === s.id
									return (
										<Fragment key={s.id}>
											<tr className={expired ? "opacity-40" : ""}>
												<td className="p-2 border-b border-border/30">
													<button
														onClick={() => setOpenSource(isOpen ? null : s.id)}
														className="flex items-center gap-1.5 text-left text-sm font-medium hover:text-primary transition-colors w-full"
													>
														<span className="flex-1 leading-snug">{s.name}</span>
														{isOpen
															? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
															: <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
														}
													</button>
												</td>
												{s.coverage.map((v, i) => (
													<td key={i} className="p-1.5 border-b border-border/30">
														<div
															title={`${s.name} / ${phases[i]}: ${expired ? "retention expired" : visStyles[v].label}`}
															className={`h-7 rounded-md border ${
																expired
																	? "bg-muted border-red-400 border-dashed"
																	: `${visStyles[v].cell} border-border/30`
															}`}
														/>
													</td>
												))}
												<td className={`p-2 border-b border-border/30 text-center text-xs font-mono font-semibold ${expired ? "text-red-500" : "text-muted-foreground"}`}>
													{s.retentionDays}d
												</td>
											</tr>
											<AnimatePresence>
												{isOpen && (
													<tr key={`${s.id}-detail`}>
														<td colSpan={phases.length + 2} className="p-0 border-b border-border/30">
															<motion.div
																initial={{ opacity: 0, height: 0 }}
																animate={{ opacity: 1, height: "auto" }}
																exit={{ opacity: 0, height: 0 }}
																transition={{ duration: 0.18 }}
																className="overflow-hidden"
															>
																<div className="px-3 py-3 bg-muted/40 grid sm:grid-cols-3 gap-3">
																	<div>
																		<div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Data type</div>
																		<p className="text-xs leading-relaxed">{s.dataType}</p>
																	</div>
																	<div>
																		<div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Follow-on collection</div>
																		<p className="text-xs leading-relaxed">{s.followOn}</p>
																	</div>
																	<div>
																		<div className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Blind spot</div>
																		<p className="text-xs leading-relaxed">{s.blindSpot}</p>
																	</div>
																</div>
															</motion.div>
														</td>
													</tr>
												)}
											</AnimatePresence>
										</Fragment>
									)
								})}
							</tbody>
						</table>
					</div>

					{/* Core principle footer */}
					<div className="flex gap-3 p-4 bg-muted/30 rounded-xl border border-border/30 items-start">
						<div className="w-2 flex-shrink-0 self-stretch rounded-full bg-gradient-to-b from-emerald-500 via-amber-400 to-red-500" />
						<div>
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Core Principle</p>
							<p className="text-sm leading-relaxed">
								Coverage has two dimensions and everyone forgets the second one. A source that sees the right phase
								is worthless if its retention window closed before anyone asked the question. Notice the
								weaponization column too: it stays blind for every internal source, because some phases are
								structurally invisible from inside your own network. That column is what external reporting is for.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
