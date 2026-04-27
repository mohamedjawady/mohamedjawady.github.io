"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

interface PyramidLevel {
	level: number
	name: string
	description: string
	evasonCost: string
	lifespan: string
	examples: string[]
	detection: string
	color: string
	bgColor: string
}

export function PyramidOfPain() {
	const [activeLevel, setActiveLevel] = useState<number | null>(null)

	const levels: PyramidLevel[] = [
		{
			level: 1,
			name: "Hash Values",
			description: "File hashes (MD5, SHA1, SHA256) - Trivia Layer",
			evasonCost: "Trivial (seconds)",
			lifespan: "Hours to days",
			examples: ["Malware hash on VirusTotal", "Binary repackaging", "One-byte code changes"],
			detection: "Hash lookups in telemetry or intelligence feeds",
			color: "bg-red-500",
			bgColor: "bg-red-50 dark:bg-red-950/20"
		},
		{
			level: 2,
			name: "IP Addresses & Domains",
			description: "C2 infrastructure - Fast-rotating infrastructure",
			evasonCost: "Low (hours to days)",
			lifespan: "Days to weeks",
			examples: ["C2 IP address", "Phishing domain", "Malware callback domain"],
			detection: "Passive DNS, Shodan, threat feeds, infrastructure pivoting",
			color: "bg-orange-500",
			bgColor: "bg-orange-50 dark:bg-orange-950/20"
		},
		{
			level: 3,
			name: "Network & Host Artifacts",
			description: "Behavioral signatures - Baked-in patterns",
			evasonCost: "Medium (days to weeks)",
			lifespan: "Weeks to months",
			examples: ["HTTP User-Agent string", "TLS certificate fingerprint", "Registry keys", "Mutex names"],
			detection: "YARA rules, behavioral signatures, EDR detection",
			color: "bg-yellow-500",
			bgColor: "bg-yellow-50 dark:bg-yellow-950/20"
		},
		{
			level: 4,
			name: "Tools & Frameworks",
			description: "Malware families and attack frameworks",
			evasonCost: "High (weeks to months)",
			lifespan: "Months",
			examples: ["Cobalt Strike", "Mimikatz", "Emotet infrastructure", "PsExec usage patterns"],
			detection: "Tool-specific detection rules, MITRE ATT&CK mapping",
			color: "bg-blue-500",
			bgColor: "bg-blue-50 dark:bg-blue-950/20"
		},
		{
			level: 5,
			name: "TTPs (Tactics, Techniques, Procedures)",
			description: "How attackers operate - Hardest to change",
			evasonCost: "Extreme (months to years)",
			lifespan: "Years",
			examples: ["Initial access method", "Lateral movement pattern", "Data exfiltration technique", "Persistence mechanism"],
			detection: "Hunt-based detection, behavioral anomaly detection, threat actor profiling",
			color: "bg-purple-500",
			bgColor: "bg-purple-50 dark:bg-purple-950/20"
		}
	]

	const maxWidth = 90
	const minWidth = 20

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6 my-8">
			<Card className="border-border/50 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<AlertTriangle className="w-5 h-5 text-primary" />
						The Pyramid of Pain
					</CardTitle>
					<CardDescription>
						Click each layer to explore evasion costs, lifespans, and detection methods
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-8">
					<div className="flex flex-col items-center gap-1">
						{levels.map((level, index) => {
							const width = maxWidth - (index * (maxWidth - minWidth)) / (levels.length - 1)
							const isActive = activeLevel === level.level
							const position = levels.length - index

							return (
								<motion.div
									key={level.level}
									className="w-full flex justify-center"
									whileHover={{ scale: 1.02 }}
								>
									<motion.button
										onClick={() => setActiveLevel(isActive ? null : level.level)}
										className={`${level.color} text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all cursor-pointer hover:shadow-xl ${
											isActive ? "ring-2 ring-offset-2 ring-primary" : ""
										}`}
										style={{ width: `${width}%` }}
										whileTap={{ scale: 0.98 }}
									>
										<div className="flex items-center justify-between">
											<span className="text-lg">{level.name}</span>
											<span className="text-xs opacity-75">Level {position}/5</span>
										</div>
									</motion.button>
								</motion.div>
							)
						})}
					</div>

					<AnimatePresence>
						{activeLevel !== null && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								className={`p-6 rounded-lg border-2 ${levels.find(l => l.level === activeLevel)?.bgColor}`}
							>
								{levels.find(l => l.level === activeLevel) && (
									<div className="space-y-4">
										{(() => {
											const level = levels.find(l => l.level === activeLevel)!
											return (
												<>
													<div>
														<h4 className="font-bold text-lg mb-1">{level.name}</h4>
														<p className="text-sm text-muted-foreground">{level.description}</p>
													</div>

													<div className="grid grid-cols-2 gap-4">
														<div>
															<div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
																Evasion Cost
															</div>
															<div className="font-bold text-sm">{level.evasonCost}</div>
														</div>
														<div>
															<div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
																Average Lifespan
															</div>
															<div className="font-bold text-sm">{level.lifespan}</div>
														</div>
													</div>

													<div>
														<div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
															Real-World Examples
														</div>
														<div className="flex flex-wrap gap-2">
															{level.examples.map((example) => (
																<Badge key={example} variant="secondary" className="text-xs">
																	{example}
																</Badge>
															))}
														</div>
													</div>

													<div>
														<div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
															Detection Approach
														</div>
														<p className="text-sm">{level.detection}</p>
													</div>
												</>
											)
										})()}
									</div>
								)}
							</motion.div>
						)}
					</AnimatePresence>

					<div className="p-4 bg-muted/50 rounded-lg border border-border/50 space-y-2">
						<div className="font-semibold text-sm">The Pattern</div>
						<p className="text-sm text-muted-foreground">
							As you move up the pyramid, indicators become progressively more durable. Hashes change in seconds. TTPs take years to restructure. Effective CTI prioritizes detection and hunting at the upper layers where adversaries have invested operational cost.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
