"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp } from "lucide-react"

interface PyramidLevel {
	id: number
	name: string
	subtitle: string
	pain: string
	evadeTime: string
	roi: string
	colorClass: string
	hoverClass: string
	ringClass: string
	bgClass: string
	borderClass: string
	painBadgeClass: string
	examples: string[]
	detection: string
	insight: string
}

// Ordered top-to-bottom: TTPs at top (narrow = extreme pain), Hash Values at bottom (wide = trivial pain)
// This matches the canonical Pyramid of Pain orientation from Bianco 2013
const levels: PyramidLevel[] = [
	{
		id: 5,
		name: "TTPs",
		subtitle: "Tactics, Techniques & Procedures",
		pain: "Extreme",
		evadeTime: "Months → Years",
		roi: "Highest",
		colorClass: "bg-red-600",
		hoverClass: "hover:bg-red-700",
		ringClass: "ring-red-400",
		bgClass: "bg-red-50 dark:bg-red-950/20",
		borderClass: "border-red-300 dark:border-red-700",
		painBadgeClass: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
		examples: ["T1566.001: Spearphishing Attachment", "T1574.002: DLL Side-Loading", "T1059.001: PowerShell", "T1003: OS Credential Dumping"],
		detection: "ATT&CK-mapped Sigma rules, behavioral hunting, anomaly detection across technique patterns",
		insight: "Changing TTPs requires retraining operators, retooling operational pipelines, and rebuilding tradecraft in test environments. This is a multi-month undertaking with significant operational risk and cost. No weekend rotation."
	},
	{
		id: 4,
		name: "Tools",
		subtitle: "Malware Families & Frameworks",
		pain: "High",
		evadeTime: "Weeks → Months",
		roi: "High",
		colorClass: "bg-orange-600",
		hoverClass: "hover:bg-orange-700",
		ringClass: "ring-orange-400",
		bgClass: "bg-orange-50 dark:bg-orange-950/20",
		borderClass: "border-orange-300 dark:border-orange-700",
		painBadgeClass: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
		examples: ["Cobalt Strike Beacon (T1219)", "Mimikatz (T1003.001)", "Qakbot / IcedID loader", "Custom RATs"],
		detection: "YARA signatures, tool-specific behavioral rules, memory forensics, imphash clustering",
		insight: "Developing and operationalizing a new tool requires weeks of development, testing, and validation. Nation-state actors invest in custom tooling to evade public signatures. Commodity actors rarely can afford to."
	},
	{
		id: 3,
		name: "Network & Host Artifacts",
		subtitle: "Behavioral Signatures",
		pain: "Medium",
		evadeTime: "Days → Weeks",
		roi: "Medium-High",
		colorClass: "bg-amber-500",
		hoverClass: "hover:bg-amber-600",
		ringClass: "ring-amber-400",
		bgClass: "bg-amber-50 dark:bg-amber-950/20",
		borderClass: "border-amber-300 dark:border-amber-700",
		painBadgeClass: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300",
		examples: ["JARM TLS fingerprint", "HTTP User-Agent pattern (T1071.001)", "Mutex name (T1106)", "Registry key path", "Named pipe pattern"],
		detection: "YARA rules, network behavioral signatures, EDR artifact rules, JARM scanning",
		insight: "Baked into how tools are built. Changing these requires modifying framework source code, recompiling, and retesting across environments. More work than rotating an IP, and it scales poorly across large operational footprints."
	},
	{
		id: 2,
		name: "IP Addresses & Domains",
		subtitle: "Infrastructure Indicators",
		pain: "Low",
		evadeTime: "Hours → Days",
		roi: "Low-Medium",
		colorClass: "bg-sky-600",
		hoverClass: "hover:bg-sky-700",
		ringClass: "ring-sky-400",
		bgClass: "bg-sky-50 dark:bg-sky-950/20",
		borderClass: "border-sky-300 dark:border-sky-700",
		painBadgeClass: "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300",
		examples: ["C2 IP address (T1071)", "Phishing domain (T1583.001)", "DGA-generated domain (T1568.002)", "Bulletproof VPS"],
		detection: "Passive DNS pivoting, threat feeds, certificate SAN analysis, infrastructure clustering",
		insight: "Automated provisioning pipelines let adversaries rotate infrastructure within hours. The real value is not in blocking single IPs. It is in using them as seeds for infrastructure mapping that survives individual rotations."
	},
	{
		id: 1,
		name: "Hash Values",
		subtitle: "File Fingerprints",
		pain: "Trivial",
		evadeTime: "Seconds → Minutes",
		roi: "Baseline",
		colorClass: "bg-emerald-600",
		hoverClass: "hover:bg-emerald-700",
		ringClass: "ring-emerald-400",
		bgClass: "bg-emerald-50 dark:bg-emerald-950/20",
		borderClass: "border-emerald-300 dark:border-emerald-700",
		painBadgeClass: "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
		examples: ["MD5 / SHA-256 of malware sample", "Imphash of loader (T1027.002)", "Ssdeep fuzzy hash", "TLSH trend hash"],
		detection: "Hash lookups in threat feeds and SIEM telemetry, imphash clustering, fuzzy hash matching",
		insight: "One byte changed produces a new hash. Repacking with UPX generates a different hash in seconds. High-volume, fast-decaying. Useful for triage and retrohunting. Never a complete detection strategy on its own."
	}
]

// Widths: TTPs (top, index 0) = narrow, Hash Values (bottom, index 4) = wide
const MIN_WIDTH_PCT = 30
const MAX_WIDTH_PCT = 97

export function PyramidOfPain() {
	const [activeLevel, setActiveLevel] = useState<number | null>(null)

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6 my-8">
			<Card className="border-border/50 shadow-lg">
				<CardHeader>
					<CardTitle>The Pyramid of Pain</CardTitle>
					<CardDescription>
						Higher layers inflict more pain on the adversary. Click each layer to explore evasion costs, detection strategies, and ROI.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">

					{/* Pain direction label */}
					<div className="flex flex-col items-center gap-1 select-none">
						<span className="text-xs font-semibold text-red-600 dark:text-red-400">More pain for the attacker</span>
					</div>

					{/* Pyramid bars */}
					<div className="flex flex-col items-center gap-[3px]">
						{levels.map((level, index) => {
							const widthPct = MIN_WIDTH_PCT + (index * (MAX_WIDTH_PCT - MIN_WIDTH_PCT)) / (levels.length - 1)
							const isActive = activeLevel === level.id

							return (
								<motion.div
									key={level.id}
									className="w-full flex justify-center"
									initial={{ opacity: 0, scaleX: 0.85 }}
									animate={{ opacity: 1, scaleX: 1 }}
									transition={{ delay: index * 0.07, duration: 0.3 }}
								>
									<motion.button
										onClick={() => setActiveLevel(isActive ? null : level.id)}
										className={`
											${level.colorClass} ${level.hoverClass}
											text-white font-semibold py-3 px-5 transition-all duration-200 cursor-pointer
											flex items-center justify-between gap-3 shadow-sm hover:shadow-md
											${index === 0 ? "rounded-t-lg" : ""}
											${index === levels.length - 1 ? "rounded-b-lg" : ""}
											${isActive ? `ring-2 ring-offset-1 ${level.ringClass} shadow-lg` : ""}
										`}
										style={{ width: `${widthPct}%` }}
										whileTap={{ scale: 0.99 }}
										whileHover={{ scale: 1.01 }}
									>
										<div className="flex flex-col items-start min-w-0 text-left">
											<span className="text-sm font-bold leading-tight">{level.name}</span>
											<span className="text-[11px] opacity-75 leading-tight hidden sm:block">{level.subtitle}</span>
										</div>
										<div className="flex items-center gap-2 flex-shrink-0">
											<span className="text-[11px] opacity-60 font-mono hidden md:block whitespace-nowrap">{level.evadeTime}</span>
											{isActive
												? <ChevronUp className="w-3.5 h-3.5 opacity-75 flex-shrink-0" />
												: <ChevronDown className="w-3.5 h-3.5 opacity-75 flex-shrink-0" />
											}
										</div>
									</motion.button>
								</motion.div>
							)
						})}
					</div>

					{/* Pain direction label (bottom) */}
					<div className="flex flex-col items-center gap-1 select-none">
						<span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Less pain for the attacker</span>
					</div>

					{/* Detail panel */}
					<AnimatePresence>
						{activeLevel !== null && (() => {
							const level = levels.find(l => l.id === activeLevel)
							if (!level) return null
							return (
								<motion.div
									key={activeLevel}
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.22 }}
									className="overflow-hidden"
								>
									<div className={`p-5 rounded-xl border-2 ${level.bgClass} ${level.borderClass} space-y-4`}>
										{/* Header */}
										<div className="flex items-start justify-between gap-3">
											<div>
												<h4 className="font-bold text-base">{level.name}</h4>
												<p className="text-sm text-muted-foreground">{level.subtitle}</p>
											</div>
											<Badge className={`${level.painBadgeClass} text-xs font-semibold`}>
												{level.pain} Pain
											</Badge>
										</div>

										{/* Stats row */}
										<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
											<div className="space-y-0.5">
												<div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Evasion Time</div>
												<div className="text-sm font-bold font-mono">{level.evadeTime}</div>
											</div>
											<div className="space-y-0.5">
												<div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Defensive ROI</div>
												<div className="text-sm font-bold">{level.roi}</div>
											</div>
											<div className="space-y-0.5 col-span-2 sm:col-span-1">
												<div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Detection</div>
												<div className="text-xs leading-relaxed">{level.detection}</div>
											</div>
										</div>

										{/* Examples */}
										<div>
											<div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Examples</div>
											<div className="flex flex-wrap gap-1.5">
												{level.examples.map((ex) => (
													<Badge key={ex} variant="secondary" className="text-xs font-mono">
														{ex}
													</Badge>
												))}
											</div>
										</div>

										{/* Insight */}
										<div className="p-3 rounded-lg bg-background/60 border border-border/40">
											<p className="text-sm leading-relaxed text-muted-foreground italic">{level.insight}</p>
										</div>
									</div>
								</motion.div>
							)
						})()}
					</AnimatePresence>

					{/* Footer summary */}
					<div className="flex gap-3 p-4 bg-muted/30 rounded-xl border border-border/30 items-start">
						<div className="w-2 flex-shrink-0 self-stretch rounded-full bg-gradient-to-b from-red-600 via-amber-500 to-emerald-500" />
						<div>
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Core Principle</p>
							<p className="text-sm leading-relaxed">
								Each level up multiplies attacker cost. Hashes rotate in seconds. TTPs take months to restructure.
								Programs that operate at the upper layers force adversaries into expensive changes that meaningfully reduce their operational tempo.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
