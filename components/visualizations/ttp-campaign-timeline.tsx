"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// 12-month campaign timeline for a simulated APT campaign
// Each layer shows rotation events (when indicators changed)
// Format: decimal month (e.g. 2.5 = mid-March in a Jan-start campaign)
const TOTAL_MONTHS = 12

const LAYERS = [
	{
		id: 5,
		name: "TTPs",
		label: "Tactics, Techniques & Procedures",
		rotations: [] as number[], // Never rotates
		color: "#dc2626",
		bgClass: "bg-red-600",
		lightBg: "bg-red-50 dark:bg-red-950/20",
		textClass: "text-red-600 dark:text-red-400",
		badgeClass: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
		rotationLabel: "0 rotations",
		note: "TTPs persist unchanged for the entire 12-month campaign. Infrastructure rotates around the same behavioral playbook.",
	},
	{
		id: 4,
		name: "Tools",
		label: "Malware Families & Frameworks",
		rotations: [6.8],
		color: "#ea580c",
		bgClass: "bg-orange-500",
		lightBg: "bg-orange-50 dark:bg-orange-950/20",
		textClass: "text-orange-600 dark:text-orange-400",
		badgeClass: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
		rotationLabel: "1 rotation",
		note: "Loader replaced at month 7 after public YARA signature released by vendor. New tool, same delivery and post-exploitation pattern.",
	},
	{
		id: 3,
		name: "Artifacts",
		label: "Network & Host Behavioral Signatures",
		rotations: [2.8, 6.2, 9.7],
		color: "#d97706",
		bgClass: "bg-amber-500",
		lightBg: "bg-amber-50 dark:bg-amber-950/20",
		textClass: "text-amber-600 dark:text-amber-400",
		badgeClass: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300",
		rotationLabel: "3 rotations",
		note: "C2 malleable profile updated three times, after the JARM fingerprint appeared in Shodan and two tool-level detection alerts.",
	},
	{
		id: 2,
		name: "IPs & Domains",
		label: "Infrastructure Indicators",
		rotations: [0.7, 1.5, 2.3, 3.1, 4.0, 4.9, 5.8, 6.6, 7.5, 8.3, 9.2, 10.1],
		color: "#2563eb",
		bgClass: "bg-blue-500",
		lightBg: "bg-sky-50 dark:bg-sky-950/20",
		textClass: "text-blue-600 dark:text-blue-400",
		badgeClass: "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300",
		rotationLabel: "12 rotations",
		note: "New VPS and domain provisioned roughly every 3–4 weeks. Automated pipeline means rotation takes under 2 hours from detection.",
	},
	{
		id: 1,
		name: "Hash Values",
		label: "File Fingerprints",
		rotations: [
			0.3, 0.6, 1.0, 1.4, 1.8, 2.1, 2.5, 2.9, 3.3, 3.7,
			4.1, 4.5, 4.8, 5.2, 5.6, 5.9, 6.3, 6.7, 7.1, 7.4,
			7.8, 8.2, 8.6, 8.9, 9.3, 9.7, 10.1, 10.5, 10.9, 11.3, 11.7
		],
		color: "#16a34a",
		bgClass: "bg-emerald-600",
		lightBg: "bg-emerald-50 dark:bg-emerald-950/20",
		textClass: "text-emerald-600 dark:text-emerald-400",
		badgeClass: "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300",
		rotationLabel: "31 rotations",
		note: "Malware repacked or recompiled roughly every 10–14 days throughout the campaign. Each new hash is a new detection-evasion step.",
	},
]

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function RotationTrack({ layer }: { layer: typeof LAYERS[0] }) {
	// Build segments between rotation points
	const points = [0, ...layer.rotations, TOTAL_MONTHS].sort((a, b) => a - b)

	return (
		<div className="relative flex items-center h-7 w-full">
			{/* Continuous background rail */}
			<div className="absolute inset-y-[11px] left-0 right-0 h-[5px] rounded-full bg-muted/40" />

			{/* Segments between rotations */}
			{points.slice(0, -1).map((start, i) => {
				const end = points[i + 1]
				const segLeft = (start / TOTAL_MONTHS) * 100
				const segWidth = ((end - start) / TOTAL_MONTHS) * 100
				return (
					<motion.div
						key={i}
						className="absolute inset-y-[11px] h-[5px] rounded-full"
						style={{
							left: `${segLeft}%`,
							width: `${segWidth}%`,
							backgroundColor: layer.color,
							opacity: 0.9,
						}}
						initial={{ scaleX: 0, originX: 0 }}
						animate={{ scaleX: 1 }}
						transition={{ delay: 0.05 * i, duration: 0.4 }}
					/>
				)
			})}

			{/* Rotation tick marks */}
			{layer.rotations.map((month, i) => (
				<motion.div
					key={`tick-${i}`}
					className="absolute flex flex-col items-center"
					style={{ left: `${(month / TOTAL_MONTHS) * 100}%` }}
					initial={{ opacity: 0, y: -4 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 + i * 0.03 }}
				>
					<div
						className="w-[2px] h-4 rounded-full -translate-x-px"
						style={{ backgroundColor: layer.color }}
					/>
					<div
						className="w-[5px] h-[5px] rounded-full -translate-x-[1.5px] mt-[1px]"
						style={{ backgroundColor: layer.color }}
					/>
				</motion.div>
			))}
		</div>
	)
}

export function TTPCampaignTimeline() {
	const [activeLayer, setActiveLayer] = useState<number | null>(null)

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6 my-8">
			<Card className="border-border/50 shadow-lg">
				<CardHeader>
					<CardTitle>TTP Persistence vs Indicator Churn</CardTitle>
					<CardDescription>
						A simulated 12-month APT campaign. Each tick mark is an indicator rotation. Click a layer for context.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">

					{/* Timeline grid */}
					<div className="overflow-x-auto pb-2">
						<div className="min-w-[520px]">
							{/* Month labels */}
							<div className="flex items-center mb-3 pl-[180px] pr-4">
								<div className="flex flex-1 justify-between text-[10px] text-muted-foreground font-mono">
									{MONTH_LABELS.map((m) => (
										<span key={m} className="w-6 text-center">{m}</span>
									))}
								</div>
							</div>

							{/* Layer rows */}
							<div className="space-y-[5px]">
								{LAYERS.map((layer) => {
									const isActive = activeLayer === layer.id
									return (
										<motion.button
											key={layer.id}
											onClick={() => setActiveLayer(isActive ? null : layer.id)}
											className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
												isActive
													? `${layer.lightBg} border border-current/20`
													: "hover:bg-muted/40"
											}`}
											whileHover={{ x: 2 }}
										>
											{/* Layer label */}
											<div className="w-[160px] flex-shrink-0">
												<div className={`text-xs font-bold ${layer.textClass}`}>{layer.name}</div>
												<div className="text-[10px] text-muted-foreground truncate">{layer.rotationLabel}</div>
											</div>

											{/* Track */}
											<div className="flex-1 flex items-center relative min-w-0">
												<div className="w-full">
													<RotationTrack layer={layer} />
												</div>
											</div>

											{/* Count badge */}
											<div className="flex-shrink-0 w-16 flex justify-end">
												<Badge
													className={`text-[10px] font-mono ${layer.badgeClass}`}
												>
													{layer.rotations.length}×
												</Badge>
											</div>
										</motion.button>
									)
								})}
							</div>

							{/* Month tick reference line */}
							<div className="flex items-center mt-1 pl-[180px] pr-[76px]">
								<div className="flex-1 relative h-3">
									{MONTH_LABELS.map((_, i) => (
										<div
											key={i}
											className="absolute top-0 w-px h-2 bg-border/60"
											style={{ left: `${(i / (MONTH_LABELS.length - 1)) * 100}%` }}
										/>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Detail panel */}
					<AnimatePresence>
						{activeLayer !== null && (() => {
							const layer = LAYERS.find(l => l.id === activeLayer)
							if (!layer) return null
							return (
								<motion.div
									key={activeLayer}
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.2 }}
									className="overflow-hidden"
								>
									<div className={`p-4 rounded-xl border ${layer.lightBg} border-current/20 space-y-3`}>
										<div className="flex items-center gap-2">
											<span className={`font-bold text-sm ${layer.textClass}`}>{layer.name}</span>
											<span className="text-xs text-muted-foreground">{layer.label}</span>
										</div>
										<p className="text-sm leading-relaxed">{layer.note}</p>
										{layer.rotations.length === 0 && (
											<div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${layer.badgeClass}`}>
												<span className="w-1.5 h-1.5 rounded-full bg-current" />
												Stable across entire campaign, no change observed
											</div>
										)}
									</div>
								</motion.div>
							)
						})()}
					</AnimatePresence>

					{/* Legend */}
					<div className="flex flex-wrap gap-x-5 gap-y-2 pt-2 border-t border-border/40">
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<div className="w-5 h-[4px] rounded-full bg-foreground/30" />
							<span>Stable period</span>
						</div>
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<div className="flex items-center gap-0.5">
								<div className="w-[2px] h-3 bg-foreground/50 rounded-full" />
								<div className="w-[4px] h-[4px] rounded-full bg-foreground/50" />
							</div>
							<span>Indicator rotated (new hash / IP / domain / tool)</span>
						</div>
					</div>

					{/* Takeaway */}
					<div className="p-4 rounded-xl bg-muted/30 border border-border/30 space-y-1">
						<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">The Pattern</p>
						<p className="text-sm leading-relaxed">
							Same adversary. Same campaign. Same objectives. Hash values rotate 31 times. Infrastructure rotates 12 times.
							TTPs rotate <span className="font-bold">zero times</span>. Detection built on TTPs survives every rotation.
							Detection built on hashes is obsolete before the analyst who wrote it has finished their coffee.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
