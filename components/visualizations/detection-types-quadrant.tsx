"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Quadrant {
	id: string
	name: string
	axis: string
	tagline: string
	colorClass: string
	ringClass: string
	bgClass: string
	borderClass: string
	badgeClass: string
	examples: string[]
	strength: string
	failureMode: string
	contextVerdict: string
}

const quadrants: Quadrant[] = [
	{
		id: "modeling",
		name: "Anomaly Modeling",
		axis: "Environmental + Unknowns",
		tagline: "Math models of normal, alerts on deviation",
		colorClass: "bg-sky-600 hover:bg-sky-700",
		ringClass: "ring-sky-400",
		bgClass: "bg-sky-50 dark:bg-sky-950/20",
		borderClass: "border-sky-300 dark:border-sky-700",
		badgeClass: "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300",
		examples: ["UEBA baselines", "Beacon-interval modeling", "Login volume and geography models", "Data transfer baselines"],
		strength: "Can surface activity nobody has ever encoded a detection for, including genuinely novel tradecraft, because it needs no knowledge of the adversary at all.",
		failureMode: "The alert says something deviated from normal. It cannot say whether that is credential theft, a maintenance window, or a new hire in another timezone. Every environment change retrains the model, and false positives scale with environmental churn.",
		contextVerdict: "High coverage of unknowns, near-zero context per alert",
	},
	{
		id: "behaviors",
		name: "Threat Behaviors",
		axis: "Threat + Unknowns",
		tagline: "Adversary tradecraft encoded as detection logic",
		colorClass: "bg-emerald-600 hover:bg-emerald-700",
		ringClass: "ring-emerald-400",
		bgClass: "bg-emerald-50 dark:bg-emerald-950/20",
		borderClass: "border-emerald-300 dark:border-emerald-700",
		badgeClass: "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
		examples: ["ATT&CK-mapped Sigma rules", "EDR behavioral detections", "Kill chain correlation searches", "LOLBin abuse analytics"],
		strength: "Fires on new campaigns using known tradecraft, with the context built into the alert: what behavior occurred, which technique it maps to, and what the responder should do next. Survives infrastructure rotation entirely.",
		failureMode: "Only catches what an analyst understood well enough to encode. Tradecraft your team has never studied passes through untouched, and writing good analytics requires real intrusion analysis skill, not feed ingestion.",
		contextVerdict: "Durable coverage with full context, bounded by what you encoded",
	},
	{
		id: "config",
		name: "Configuration Analysis",
		axis: "Environmental + Knowns",
		tagline: "Comparing the environment against known-good state",
		colorClass: "bg-violet-600 hover:bg-violet-700",
		ringClass: "ring-violet-400",
		bgClass: "bg-violet-50 dark:bg-violet-950/20",
		borderClass: "border-violet-300 dark:border-violet-700",
		badgeClass: "bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300",
		examples: ["CIS benchmark scanning", "File integrity monitoring", "Firewall ruleset audits", "Unauthorized software inventory"],
		strength: "Catches drift and misconfiguration with no threat knowledge required, and hardens the environment so that adversary activity has fewer places to hide in the first place.",
		failureMode: "A deviation from documented configuration is just as likely to be an administrator with a deadline as an adversary. No context about intent, and it only inspects what the baseline documents.",
		contextVerdict: "Reliable hygiene signal, silent on adversary intent",
	},
	{
		id: "indicators",
		name: "Indicators",
		axis: "Threat + Knowns",
		tagline: "Atoms of past intrusions, matched exactly",
		colorClass: "bg-amber-500 hover:bg-amber-600",
		ringClass: "ring-amber-400",
		bgClass: "bg-amber-50 dark:bg-amber-950/20",
		borderClass: "border-amber-300 dark:border-amber-700",
		badgeClass: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300",
		examples: ["Hash blocklists", "C2 IP and domain matching", "Feed-driven SIEM lookups", "Known-bad certificate fingerprints"],
		strength: "Cheap, instant, and high confidence while fresh: a match against a well-contexted indicator from your own incident is close to a guaranteed true positive.",
		failureMode: "Expires the moment the adversary rotates, which is hours for infrastructure and seconds for hashes. Deployed at feed scale without vetting, it produces the alert queue where nothing is actually critical.",
		contextVerdict: "High confidence briefly, then noise; only catches what already burned someone",
	},
]

export function DetectionTypesQuadrant() {
	const [active, setActive] = useState<string | null>(null)
	const activeQuadrant = quadrants.find((q) => q.id === active)

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6 my-8">
			<Card className="border-border/50 shadow-lg">
				<CardHeader>
					<CardTitle>The Four Types of Threat Detection</CardTitle>
					<CardDescription>
						Environmental approaches know your environment but not the adversary. Threat-based approaches know the
						adversary but only what you encoded. Click each quadrant for strengths, failure modes, and the
						context-versus-coverage tradeoff.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">

					{/* Axis label top */}
					<div className="grid grid-cols-[90px_1fr_1fr] gap-2 items-center select-none">
						<div />
						<div className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Environmental</div>
						<div className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Threat-Based</div>
					</div>

					{/* Row: Unknowns */}
					<div className="grid grid-cols-[90px_1fr_1fr] gap-2 items-stretch">
						<div className="flex items-center justify-center">
							<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider -rotate-90 whitespace-nowrap">Unknowns</span>
						</div>
						{quadrants.slice(0, 2).map((q) => (
							<motion.button
								key={q.id}
								onClick={() => setActive(active === q.id ? null : q.id)}
								whileTap={{ scale: 0.98 }}
								whileHover={{ scale: 1.01 }}
								className={`${q.colorClass} text-white rounded-xl p-4 text-left transition-all duration-200 shadow-sm hover:shadow-md min-h-[110px] flex flex-col justify-between gap-2 ${active === q.id ? `ring-2 ring-offset-1 ${q.ringClass} shadow-lg` : ""}`}
							>
								<span className="font-bold text-sm leading-tight">{q.name}</span>
								<span className="text-[11px] opacity-80 leading-snug">{q.tagline}</span>
							</motion.button>
						))}
					</div>

					{/* Row: Knowns */}
					<div className="grid grid-cols-[90px_1fr_1fr] gap-2 items-stretch">
						<div className="flex items-center justify-center">
							<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider -rotate-90 whitespace-nowrap">Knowns</span>
						</div>
						{quadrants.slice(2, 4).map((q) => (
							<motion.button
								key={q.id}
								onClick={() => setActive(active === q.id ? null : q.id)}
								whileTap={{ scale: 0.98 }}
								whileHover={{ scale: 1.01 }}
								className={`${q.colorClass} text-white rounded-xl p-4 text-left transition-all duration-200 shadow-sm hover:shadow-md min-h-[110px] flex flex-col justify-between gap-2 ${active === q.id ? `ring-2 ring-offset-1 ${q.ringClass} shadow-lg` : ""}`}
							>
								<span className="font-bold text-sm leading-tight">{q.name}</span>
								<span className="text-[11px] opacity-80 leading-snug">{q.tagline}</span>
							</motion.button>
						))}
					</div>

					{/* Detail panel */}
					<AnimatePresence>
						{activeQuadrant && (
							<motion.div
								key={activeQuadrant.id}
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.22 }}
								className="overflow-hidden"
							>
								<div className={`p-5 rounded-xl border-2 ${activeQuadrant.bgClass} ${activeQuadrant.borderClass} space-y-4`}>
									<div className="flex items-start justify-between gap-3">
										<div>
											<h4 className="font-bold text-base">{activeQuadrant.name}</h4>
											<p className="text-sm text-muted-foreground">{activeQuadrant.axis}</p>
										</div>
										<Badge className={`${activeQuadrant.badgeClass} text-xs font-semibold whitespace-nowrap`}>
											{activeQuadrant.id === "behaviors" ? "Invest here" : activeQuadrant.id === "indicators" ? "Use, don't lean" : "Necessary layer"}
										</Badge>
									</div>
									<div>
										<div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Examples</div>
										<div className="flex flex-wrap gap-1.5">
											{activeQuadrant.examples.map((ex) => (
												<Badge key={ex} variant="secondary" className="text-xs">{ex}</Badge>
											))}
										</div>
									</div>
									<div className="grid sm:grid-cols-2 gap-3">
										<div className="p-3 rounded-lg bg-background/60 border border-border/40">
											<div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Strength</div>
											<p className="text-sm leading-relaxed">{activeQuadrant.strength}</p>
										</div>
										<div className="p-3 rounded-lg bg-background/60 border border-border/40">
											<div className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Failure Mode</div>
											<p className="text-sm leading-relaxed">{activeQuadrant.failureMode}</p>
										</div>
									</div>
									<div className="p-3 rounded-lg bg-background/60 border border-border/40">
										<p className="text-sm leading-relaxed italic text-muted-foreground">{activeQuadrant.contextVerdict}</p>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Core principle footer */}
					<div className="flex gap-3 p-4 bg-muted/30 rounded-xl border border-border/30 items-start">
						<div className="w-2 flex-shrink-0 self-stretch rounded-full bg-gradient-to-b from-sky-500 via-violet-500 to-emerald-500" />
						<div>
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Core Principle</p>
							<p className="text-sm leading-relaxed">
								Environmental methods trade context for coverage: they can see the unknown but cannot explain it.
								Threat-based methods trade coverage for context: they explain exactly what fired but only see what
								you encoded. A program that buys one quadrant and believes it bought coverage has bought a blind spot.
								The CTI team's leverage lives in the threat behaviors quadrant, and this post is about getting there.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
