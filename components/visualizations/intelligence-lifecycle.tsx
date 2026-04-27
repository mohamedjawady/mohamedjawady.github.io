"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, ArrowRight, Circle } from "lucide-react"

interface LifecycleStage {
	id: string
	name: string
	description: string
	examples: string[]
}

interface CycleType {
	name: string
	duration: string
	color: string
	stages: LifecycleStage[]
}

export function IntelligenceLifecycle() {
	const [activeCycle, setActiveCycle] = useState<"tactical" | "operational" | "strategic">("tactical")
	const [activeStage, setActiveStage] = useState<number>(0)

	const cycles: Record<"tactical" | "operational" | "strategic", CycleType> = {
		tactical: {
			name: "Tactical (Hours)",
			duration: "2-4 hours",
			color: "bg-red-500",
			stages: [
				{
					id: "direction",
					name: "Direction",
					description: "IOC sharing partner reports suspicious C2 domain",
					examples: ["Immediate indicator report", "Partner notification", "SOC escalation"]
				},
				{
					id: "collection",
					name: "Collection",
					description: "Pull passive DNS and current infrastructure status",
					examples: ["Query pDNS database", "Check certificate history", "Scan URL databases"]
				},
				{
					id: "processing",
					name: "Processing",
					description: "Normalize and link to previous infrastructure",
					examples: ["Deduplicate records", "Link related domains", "Attach metadata"]
				},
				{
					id: "analysis",
					name: "Analysis",
					description: "Confirm consistency with known actor patterns",
					examples: ["Pattern matching", "Historical comparison", "Confidence assessment"]
				},
				{
					id: "dissemination",
					name: "Dissemination",
					description: "Send detection rules to SOC within 2 hours",
					examples: ["Deploy YARA rules", "Block indicators", "Alert analysts"]
				},
				{
					id: "feedback",
					name: "Feedback",
					description: "Measure block rates and detections overnight",
					examples: ["Count blocks", "Validate accuracy", "Adjust thresholds"]
				}
			]
		},
		operational: {
			name: "Operational (Days)",
			duration: "3-7 days",
			color: "bg-yellow-500",
			stages: [
				{
					id: "direction",
					name: "Direction",
					description: "Hunting lead develops TTP persistence hypothesis",
					examples: ["Hunting tasking", "Threat model review", "Technique prioritization"]
				},
				{
					id: "collection",
					name: "Collection",
					description: "Query telemetry for behavioral indicators over weeks",
					examples: ["SIEM queries", "EDR searches", "Log aggregation"]
				},
				{
					id: "processing",
					name: "Processing",
					description: "De-duplicate and normalize telemetry patterns",
					examples: ["Pattern extraction", "False positive filtering", "Normalization"]
				},
				{
					id: "analysis",
					name: "Analysis",
					description: "Identify statistically significant anomalies",
					examples: ["Baseline comparison", "Statistical tests", "Correlation analysis"]
				},
				{
					id: "dissemination",
					name: "Dissemination",
					description: "Brief detection engineering on new rule requirements",
					examples: ["Present findings", "Rule specifications", "Tuning guidance"]
				},
				{
					id: "feedback",
					name: "Feedback",
					description: "Measure new rule coverage over the following month",
					examples: ["Coverage metrics", "False positive rate", "Rule effectiveness"]
				}
			]
		},
		strategic: {
			name: "Strategic (Months)",
			duration: "4-12 weeks",
			color: "bg-blue-500",
			stages: [
				{
					id: "direction",
					name: "Direction",
					description: "CISO needs threat prioritization for budget allocation",
					examples: ["Executive question", "Budget planning", "Risk assessment"]
				},
				{
					id: "collection",
					name: "Collection",
					description: "Aggregate trend data across campaigns and sectors",
					examples: ["Industry reports", "Campaign tracking", "Sector mapping"]
				},
				{
					id: "processing",
					name: "Processing",
					description: "Normalize data into decision-ready format",
					examples: ["Data consolidation", "Risk scoring", "Prioritization"]
				},
				{
					id: "analysis",
					name: "Analysis",
					description: "Assess likelihood of sector targeting and required controls",
					examples: ["Gap analysis", "Control mapping", "Risk prioritization"]
				},
				{
					id: "dissemination",
					name: "Dissemination",
					description: "Present risk brief to leadership",
					examples: ["Executive summary", "Risk dashboard", "Recommendations"]
				},
				{
					id: "feedback",
					name: "Feedback",
					description: "Validate assessments through industry reports six months later",
					examples: ["Incident correlation", "Trend validation", "Program effectiveness"]
				}
			]
		}
	}

	const cycle = cycles[activeCycle]
	const stage = cycle.stages[activeStage]

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6 my-8">
			<Card className="border-border/50 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CheckCircle2 className="w-5 h-5 text-primary" />
						The Intelligence Lifecycle
					</CardTitle>
					<CardDescription>
						Six-stage cycle that repeats at different speeds depending on the question being answered
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-8">
					<div className="flex flex-wrap gap-3">
						{(["tactical", "operational", "strategic"] as const).map((type) => (
							<Button
								key={type}
								variant={activeCycle === type ? "default" : "outline"}
								onClick={() => {
									setActiveCycle(type)
									setActiveStage(0)
								}}
								className="capitalize"
							>
								{cycles[type].name}
							</Button>
						))}
					</div>

					<div className={`p-4 rounded-lg ${cycle.color} text-white`}>
						<div className="font-semibold">{cycle.name}</div>
						<div className="text-sm opacity-90">Complete cycle: {cycle.duration}</div>
					</div>

					<div className="flex justify-center items-center">
						<div className="relative w-80 h-80 rounded-full border-2 border-border/50 flex items-center justify-center">
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="text-center">
									<div className="text-sm text-muted-foreground">Current Stage</div>
									<div className="text-2xl font-bold">{stage.name}</div>
								</div>
							</div>

							{cycle.stages.map((s, index) => {
								const angle = (index / cycle.stages.length) * 360
								const isActive = index === activeStage
								const radius = 140

								return (
									<button
										key={s.id}
										className={`absolute w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
											isActive
												? `${cycle.color} text-white shadow-lg`
												: "bg-muted border border-border hover:border-primary hover:scale-110"
										}`}
										style={{
											left: `calc(50% + ${Math.cos((angle - 90) * (Math.PI / 180)) * radius}px)`,
											top: `calc(50% + ${Math.sin((angle - 90) * (Math.PI / 180)) * radius}px)`,
											transform: `translate(-50%, -50%) ${isActive ? "scale(1.25)" : "scale(1)"}`,
											lineHeight: "1"
										}}
										onClick={() => setActiveStage(index)}
									>
										{index + 1}
									</button>
								)
							})}
						</div>
					</div>

					<AnimatePresence mode="wait">
						<motion.div
							key={`${activeCycle}-${activeStage}`}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50"
						>
							<div>
								<div className="font-semibold mb-2">{stage.name}</div>
								<p className="text-sm text-muted-foreground">{stage.description}</p>
							</div>

							{stage.examples.length > 0 && (
								<div>
									<div className="text-sm font-medium mb-2">What this looks like:</div>
									<div className="flex flex-wrap gap-2">
										{stage.examples.map((example) => (
											<Badge key={example} variant="secondary">
												{example}
											</Badge>
										))}
									</div>
								</div>
							)}
						</motion.div>
					</AnimatePresence>

					<div className="flex justify-between items-center pt-4 border-t border-border/50">
						<Button
							variant="outline"
							onClick={() => setActiveStage((prev) => (prev - 1 + cycle.stages.length) % cycle.stages.length)}
						>
							Previous
						</Button>
						<div className="text-sm text-muted-foreground">
							Stage {activeStage + 1} of {cycle.stages.length}
						</div>
						<Button
							onClick={() => setActiveStage((prev) => (prev + 1) % cycle.stages.length)}
						>
							Next
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
