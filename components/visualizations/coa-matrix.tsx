"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Kind = "passive" | "mitigating" | "restricted"

interface Action {
	id: string
	name: string
	kind: Kind
	blurb: string
	// gain/loss for the worked C2-domain indicator; null where not meaningful
	gain: string | null
	loss: string | null
}

const actions: Action[] = [
	{
		id: "discover",
		name: "Discover",
		kind: "passive",
		blurb: "Search history: has this indicator appeared before?",
		gain: null,
		loss: null,
	},
	{
		id: "detect",
		name: "Detect",
		kind: "passive",
		blurb: "Alert if the indicator appears again in future.",
		gain: null,
		loss: null,
	},
	{
		id: "deny",
		name: "Deny",
		kind: "mitigating",
		blurb: "Prevent the event outright (block the domain at DNS).",
		gain: "Nothing new. The threat is stopped on your network, but you learn no more about it.",
		loss: "The adversary's next beacon fails, they learn the domain is burned, and they rotate within hours. You lose all further visibility into the loader.",
	},
	{
		id: "disrupt",
		name: "Disrupt",
		kind: "mitigating",
		blurb: "Interfere mid-event to make it fail (reset the C2 sessions).",
		gain: "Partial. You stop this instance and may capture the session before it dies.",
		loss: "The adversary may notice the instability and investigate. Ongoing observation ends.",
	},
	{
		id: "degrade",
		name: "Degrade",
		kind: "mitigating",
		blurb: "Slow it to buy response time (rate-limit the C2 channel).",
		gain: "Time. Responders get a wider window before objectives complete.",
		loss: "Low intelligence value, and the activity may still eventually succeed. A last resort.",
	},
	{
		id: "deceive",
		name: "Deceive",
		kind: "mitigating",
		blurb: "Make the adversary believe they succeeded (sinkhole the domain to your host).",
		gain: "Highest. Every infected host beacons to you, you observe second-stage behavior, and you can measure the campaign's true scope.",
		loss: "Near zero if done quietly. The adversary believes their infrastructure is live and keeps operating in the open.",
	},
	{
		id: "destroy",
		name: "Destroy",
		kind: "restricted",
		blurb: "Offensive action to remove capability (takedown, law enforcement).",
		gain: "Removes the adversary capability entirely, at scale, when authorized.",
		loss: "Legal authority required; not available to most organizations. Ends all observation.",
	},
]

const phases = ["Recon", "Weapon.", "Delivery", "Exploit", "Install", "C2", "Actions"]

// Example cell contents keyed by action id, one per kill chain phase.
const cellExamples: Record<string, (string | null)[]> = {
	discover: ["WHOIS history search", "Sample repo retrohunt", "Proxy log search", "EDR retrohunt", "Autoruns sweep", "DNS log retrohunt", "File access audit"],
	detect: ["New-domain alert", "YARA on inbound files", "URL sig", "Exploit sig", "Persistence rule", "Beacon analytic", "Exfil analytic"],
	deny: [null, null, "Attachment block", "Patch the CVE", "AppLocker rule", "DNS block", "Egress block"],
	disrupt: [null, null, "Quarantine email", "DEP / ASLR", "Sandboxing", "TCP reset", "Kill session on stage"],
	degrade: [null, null, "Sender rate limit", null, null, "Session rate limit", "Egress throttle"],
	deceive: ["Seed fake contacts", null, "Reroute to analysis", null, null, "Sinkhole to honeypot", "Sinkhole to honeypot"],
	destroy: [null, null, null, null, null, "Domain takedown", "LE arrest"],
}

const kindStyle: Record<Kind, string> = {
	passive: "bg-sky-600 hover:bg-sky-700 ring-sky-400",
	mitigating: "bg-emerald-600 hover:bg-emerald-700 ring-emerald-400",
	restricted: "bg-violet-600 hover:bg-violet-700 ring-violet-400",
}

const kindLabel: Record<Kind, string> = {
	passive: "Passive (always run both)",
	mitigating: "Mitigating (choose one)",
	restricted: "Restricted (authority required)",
}

export function CoAMatrix() {
	const [active, setActive] = useState<string>("deceive")
	const activeAction = actions.find((a) => a.id === active)!

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6 my-8">
			<Card className="border-border/50 shadow-lg">
				<CardHeader>
					<CardTitle>Courses of Action Matrix</CardTitle>
					<CardDescription>
						Seven kill chain phases against the seven Ds. Click a column header for the action's role, and for
						mitigating actions, the intelligence gain and loss on a worked example: a C2 callback domain found on one
						infected host.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">

					{/* Legend */}
					<div className="flex flex-wrap items-center gap-3">
						{(["passive", "mitigating", "restricted"] as Kind[]).map((k) => (
							<span key={k} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
								<span className={`w-3 h-3 rounded ${kindStyle[k].split(" ")[0]}`} />
								{kindLabel[k]}
							</span>
						))}
					</div>

					{/* Matrix */}
					<div className="w-full overflow-x-auto">
						<table className="w-full border-collapse min-w-[720px]">
							<thead>
								<tr>
									<th className="text-left text-[10px] font-semibold text-muted-foreground uppercase tracking-wider p-2 border-b border-border/50 w-[15%]">Phase</th>
									{actions.map((a) => (
										<th key={a.id} className="p-1.5 border-b border-border/50 align-bottom">
											<button
												onClick={() => setActive(a.id)}
												className={`w-full text-white rounded-lg px-1.5 py-2 text-[11px] font-bold transition-all ${kindStyle[a.kind]} ${active === a.id ? "ring-2 ring-offset-1 shadow-md" : "opacity-90"}`}
											>
												{a.name}
											</button>
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{phases.map((phase, pi) => (
									<tr key={phase}>
										<td className="p-2 border-b border-border/30 text-xs font-semibold">{phase}</td>
										{actions.map((a) => {
											const ex = cellExamples[a.id][pi]
											const isActiveCol = active === a.id
											return (
												<td key={a.id} className="p-1.5 border-b border-border/30 text-center align-middle">
													{ex ? (
														<div
															className={`text-[10px] leading-tight rounded-md px-1 py-1.5 border ${
																isActiveCol
																	? "border-primary/50 bg-primary/5 font-medium"
																	: "border-border/30 text-muted-foreground"
															}`}
														>
															{ex}
														</div>
													) : (
														<span className="text-[10px] text-muted-foreground/30">&middot;</span>
													)}
												</td>
											)
										})}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Detail panel */}
					<AnimatePresence mode="wait">
						<motion.div
							key={activeAction.id}
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -6 }}
							transition={{ duration: 0.18 }}
						>
							<div className="p-5 rounded-xl border-2 border-border/50 bg-muted/20 space-y-4">
								<div className="flex items-start justify-between gap-3">
									<div>
										<h4 className="font-bold text-base">{activeAction.name}</h4>
										<p className="text-sm text-muted-foreground">{activeAction.blurb}</p>
									</div>
									<Badge className={`text-xs font-semibold text-white ${kindStyle[activeAction.kind].split(" ")[0]}`}>
										{kindLabel[activeAction.kind]}
									</Badge>
								</div>
								{activeAction.gain && activeAction.loss ? (
									<div className="grid sm:grid-cols-2 gap-3">
										<div className="p-3 rounded-lg bg-background/60 border border-border/40">
											<div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Intelligence gain</div>
											<p className="text-sm leading-relaxed">{activeAction.gain}</p>
										</div>
										<div className="p-3 rounded-lg bg-background/60 border border-border/40">
											<div className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Intelligence loss + signal</div>
											<p className="text-sm leading-relaxed">{activeAction.loss}</p>
										</div>
									</div>
								) : (
									<div className="p-3 rounded-lg bg-background/60 border border-border/40">
										<p className="text-sm leading-relaxed text-muted-foreground italic">
											Passive actions carry no strategic cost and compose freely. Run both Discover and Detect on
											nearly every indicator; there is no gain/loss tradeoff to weigh.
										</p>
									</div>
								)}
							</div>
						</motion.div>
					</AnimatePresence>

					{/* Core principle footer */}
					<div className="flex gap-3 p-4 bg-muted/30 rounded-xl border border-border/30 items-start">
						<div className="w-2 flex-shrink-0 self-stretch rounded-full bg-gradient-to-b from-sky-500 via-emerald-500 to-red-500" />
						<div>
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Core Principle</p>
							<p className="text-sm leading-relaxed">
								Run both passive actions every time. Then choose exactly one mitigating action, because they exclude
								each other: you cannot deny an event and also deceive the adversary through it. Deny is the reflex and
								usually the worst intelligence trade. Deceive, when you have the capability, is frequently the option
								that protects you and teaches you at once.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
