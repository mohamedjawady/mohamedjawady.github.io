"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Mode = "assets" | "adversaries"

interface Asset {
	id: string
	name: string
	cia: string
	fill: string
	summary: string
	attracts: { who: string; why: string }[]
}

interface Adversary {
	id: string
	name: string
	fill: string
	wants: string
	tools: string
	dependencies: string
	triggers: string
}

const assets: Asset[] = [
	{
		id: "models",
		name: "Forecasting Models",
		cia: "Integrity + Confidentiality",
		fill: "#7c3aed",
		summary: "The proprietary climate models that are the product's entire competitive edge. Years of R&D encoded in code and weights.",
		attracts: [
			{ who: "Competitor", why: "Closes a capability gap without paying for the R&D. Wants the models copied, not broken." },
			{ who: "State economic espionage", why: "National-champion industries benefit from the stolen methodology. Patient, long-dwell, quiet." },
		],
	},
	{
		id: "datasets",
		name: "Customer Datasets",
		cia: "Confidentiality",
		fill: "#0284c7",
		summary: "Customer PII plus the commercial data customers uploaded. Valuable to anyone who resells data or leverages it for extortion.",
		attracts: [
			{ who: "Financially motivated criminal", why: "Bulk PII resells; commercial data enables extortion. Opportunistic and fast." },
			{ who: "Access broker", why: "Does not want the data itself; wants to sell the access to whoever does." },
		],
	},
	{
		id: "availability",
		name: "Platform Availability",
		cia: "Availability",
		fill: "#059669",
		summary: "The running SaaS product. If it is down, customers cannot work, so downtime itself is the leverage.",
		attracts: [
			{ who: "Ransomware / extortion crew", why: "Encrypt or threaten the platform and the outage pressure forces a fast payment decision." },
			{ who: "Hacktivist", why: "A relevant news cycle turns your customers into a cause. Downtime and defacement are the message." },
		],
	},
]

const adversaries: Adversary[] = [
	{
		id: "espionage",
		name: "Economic Espionage",
		fill: "#7c3aed",
		wants: "The forecasting models: the methodology, not the disruption.",
		tools: "Tailored spearphishing, living-off-the-land tradecraft, long-dwell custom implants that avoid commodity signatures.",
		dependencies: "Reconnaissance on your researchers and their publications; infrastructure that blends with normal traffic; time.",
		triggers: "You announce a new model, win a marquee contract, publish research, or open an office in a region of interest.",
	},
	{
		id: "criminal",
		name: "Financially Motivated",
		fill: "#0284c7",
		wants: "Customer datasets to resell, and platform availability to extort.",
		tools: "Commodity loaders, ransomware-as-a-service, credential theft, purchased initial access.",
		dependencies: "Initial-access brokers, bulletproof hosting, and a crypto cash-out path.",
		triggers: "Opportunistic: an exposed VPN or RDP, credentials in a breach dump, an unpatched internet-facing bug.",
	},
	{
		id: "hacktivist",
		name: "Hacktivist",
		fill: "#059669",
		wants: "Platform availability and attention. Embarrassment is the objective.",
		tools: "DDoS, defacement, opportunistic exploitation of public vulnerabilities, leaked-credential reuse.",
		dependencies: "A cause or news hook that ties your customers to a controversy; booter or botnet services.",
		triggers: "A geopolitical or environmental controversy involving your customers or your sector.",
	},
	{
		id: "insider",
		name: "Insider",
		fill: "#d97706",
		wants: "Whatever they already have access to: usually the datasets or the models.",
		tools: "Legitimate credentials, sanctioned cloud sync, removable media. No exploit required.",
		dependencies: "None external. That is what makes the insider hard.",
		triggers: "A grievance, a resignation in progress, or financial pressure.",
	},
]

export function ThreatModelExplorer() {
	const [mode, setMode] = useState<Mode>("assets")
	const [activeId, setActiveId] = useState<string>("models")

	const activeAsset = assets.find((a) => a.id === activeId)
	const activeAdversary = adversaries.find((a) => a.id === activeId)

	const switchMode = (m: Mode) => {
		setMode(m)
		setActiveId(m === "assets" ? "models" : "espionage")
	}

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6 my-8">
			<Card className="border-border/50 shadow-lg">
				<CardHeader>
					<CardTitle>Target-Centric Threat Model: Northwind Analytics</CardTitle>
					<CardDescription>
						A mid-size climate-data SaaS company. Pivot on its crown jewels to see which adversaries each one
						attracts and why, then pivot on the adversaries to see their tools, dependencies, and the triggers that
						would point them at you.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">

					{/* Mode toggle */}
					<div className="inline-flex rounded-lg border border-border/60 p-1 bg-muted/30">
						<button
							onClick={() => switchMode("assets")}
							className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${mode === "assets" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
						>
							Pivot on assets
						</button>
						<button
							onClick={() => switchMode("adversaries")}
							className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${mode === "adversaries" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
						>
							Pivot on adversaries
						</button>
					</div>

					{/* Hub-and-spoke visual */}
					<div className="w-full overflow-x-auto">
						<svg viewBox="0 0 640 200" className="w-full min-w-[560px]" role="img" aria-label="Northwind Analytics at the center with the active pivot set radiating out">
							{(mode === "assets"
								? [[520, 52], [520, 148], [120, 100]]
								: [[120, 52], [120, 148], [520, 52], [520, 148]]
							).map(([lx, ly], i) => (
								<line key={`edge-${i}`} x1="320" y1="100" x2={lx < 320 ? 202 : 438} y2={ly} stroke="currentColor" strokeWidth="1.5" opacity="0.22" />
							))}
							<circle cx="320" cy="100" r="46" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
							<text x="320" y="96" textAnchor="middle" fill="currentColor" fontSize="12" fontWeight="bold">Northwind</text>
							<text x="320" y="111" textAnchor="middle" fill="currentColor" fontSize="9.5" opacity="0.7">the target</text>
							{(mode === "assets" ? assets : adversaries).map((node, i) => {
								const positions = mode === "assets"
									? [[120, 100], [520, 52], [520, 148]]
									: [[120, 52], [120, 148], [520, 52], [520, 148]]
								const [cx, cy] = positions[i]
								const isActive = activeId === node.id
								return (
									<g key={node.id} style={{ cursor: "pointer" }} onClick={() => setActiveId(node.id)}>
										<rect x={cx - 82} y={cy - 18} width="164" height="36" rx="8"
											fill={node.fill}
											fillOpacity={isActive ? 0.95 : 0.5}
											stroke={isActive ? "currentColor" : "none"} strokeOpacity="0.4" strokeWidth="1.5" />
										<text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">{node.name}</text>
									</g>
								)
							})}
						</svg>
					</div>

					{/* Detail panel */}
					<AnimatePresence mode="wait">
						<motion.div
							key={mode + activeId}
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -6 }}
							transition={{ duration: 0.18 }}
						>
							{mode === "assets" && activeAsset && (
								<div className="p-5 rounded-xl border-2 border-border/50 bg-muted/20 space-y-4">
									<div className="flex items-start justify-between gap-3">
										<div>
											<h4 className="font-bold text-base">{activeAsset.name}</h4>
											<p className="text-sm text-muted-foreground">{activeAsset.summary}</p>
										</div>
										<Badge variant="secondary" className="text-xs whitespace-nowrap">{activeAsset.cia}</Badge>
									</div>
									<div>
										<div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Adversaries this attracts</div>
										<div className="grid sm:grid-cols-2 gap-3">
											{activeAsset.attracts.map((a) => (
												<div key={a.who} className="p-3 rounded-lg bg-background/60 border border-border/40">
													<div className="text-sm font-semibold mb-1">{a.who}</div>
													<p className="text-xs leading-relaxed text-muted-foreground">{a.why}</p>
												</div>
											))}
										</div>
									</div>
								</div>
							)}
							{mode === "adversaries" && activeAdversary && (
								<div className="p-5 rounded-xl border-2 border-border/50 bg-muted/20 space-y-4">
									<div>
										<h4 className="font-bold text-base">{activeAdversary.name}</h4>
										<p className="text-sm text-muted-foreground">{activeAdversary.wants}</p>
									</div>
									<div className="grid sm:grid-cols-3 gap-3">
										<div className="p-3 rounded-lg bg-background/60 border border-border/40">
											<div className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">Tools</div>
											<p className="text-xs leading-relaxed">{activeAdversary.tools}</p>
										</div>
										<div className="p-3 rounded-lg bg-background/60 border border-border/40">
											<div className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Dependencies</div>
											<p className="text-xs leading-relaxed">{activeAdversary.dependencies}</p>
										</div>
										<div className="p-3 rounded-lg bg-background/60 border border-border/40">
											<div className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Triggers</div>
											<p className="text-xs leading-relaxed">{activeAdversary.triggers}</p>
										</div>
									</div>
								</div>
							)}
						</motion.div>
					</AnimatePresence>

					{/* Core principle footer */}
					<div className="flex gap-3 p-4 bg-muted/30 rounded-xl border border-border/30 items-start">
						<div className="w-2 flex-shrink-0 self-stretch rounded-full bg-gradient-to-b from-violet-500 via-sky-500 to-emerald-500" />
						<div>
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Core Principle</p>
							<p className="text-sm leading-relaxed">
								The model starts at the center, with what Northwind has, not with a list of trending actors. Each
								crown jewel attracts a different adversary for a different reason, and each adversary reveals different
								things to watch for. Build the model from your assets outward and the actors who matter select
								themselves.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
