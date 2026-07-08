"use client"

import { Fragment, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, RotateCcw, Eraser } from "lucide-react"

type Score = "C" | "I" | "N"

interface EvidenceRow {
	id: string
	label: string
	note: string
	suggested: Score[]
}

const hypotheses = [
	{ id: "H1", name: "Hacktivist collective", detail: "The attack is exactly what the page claims: a genuine ideological defacement by the group taking credit." },
	{ id: "H2", name: "State actor false flag", detail: "A state-linked operator staged the defacement behind a hacktivist front to send a message deniably." },
	{ id: "H3", name: "Opportunistic defacer", detail: "An untargeted actor mass-exploited a public CMS vulnerability and dressed the result up with a persona." },
	{ id: "H4", name: "Insider", detail: "Someone with legitimate access defaced the site and disguised it as an external intrusion." },
]

const evidence: EvidenceRow[] = [
	{
		id: "E1",
		label: "Defacement page is signed by a previously unknown collective",
		note: "Self-attribution costs the attacker nothing and is consistent with every hypothesis on the board. It feels like the strongest lead and it is the weakest evidence in the matrix.",
		suggested: ["C", "C", "C", "C"],
	},
	{
		id: "E2",
		label: "The exploited CMS vulnerability had a public proof of concept for three weeks",
		note: "Anyone external could have used the public exploit. An insider with legitimate access has no need to exploit the public-facing CMS at all, which makes this row inconsistent with the insider hypothesis.",
		suggested: ["C", "C", "C", "I"],
	},
	{
		id: "E3",
		label: "Internet-wide mass scanning for the same CMS bug spiked in the same window",
		note: "Scanning telemetry says the whole internet was being swept for this bug. That fits an opportunist working down a target list and says little about the others.",
		suggested: ["N", "N", "C", "N"],
	},
	{
		id: "E4",
		label: "More than 40 unrelated organizations were defaced with a near-identical page that week",
		note: "A targeted state operation and a personal grievance both fit poorly with 40 random victims across unrelated sectors. Mass replication is the signature of opportunistic exploitation.",
		suggested: ["N", "I", "C", "I"],
	},
	{
		id: "E5",
		label: "The defacement landed within days of the geopolitical flashpoint",
		note: "This is the row that anchors most analysts. Timing correlation feels decisive but two hypotheses absorb it equally well, and coincidence absorbs the rest. Exciting, weakly diagnostic.",
		suggested: ["C", "C", "N", "N"],
	},
	{
		id: "E6",
		label: "Access logs show no reconnaissance or targeting activity before the exploit fired",
		note: "State operations are almost always preceded by reconnaissance of the specific target. Its absence counts against the false flag hypothesis and fits spray-and-pray exploitation.",
		suggested: ["N", "I", "C", "N"],
	},
	{
		id: "E7",
		label: "The persona's social account was created two weeks ago with no prior history",
		note: "New collectives do appear from nowhere, but a freshly minted persona is also exactly what a manufactured front or an opportunist borrowing credibility would look like.",
		suggested: ["N", "C", "C", "N"],
	},
	{
		id: "E8",
		label: "The page pushes no specific cause beyond a slogan reused from a public defacement archive",
		note: "Genuine hacktivism usually foregrounds the cause. A recycled template slogan with no demands or messaging fits an actor who only needed the page to look ideological.",
		suggested: ["I", "N", "C", "N"],
	},
]

const scoreStyles: Record<Score, string> = {
	C: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
	I: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700",
	N: "bg-muted text-muted-foreground border-border/50",
}

const scoreLabels: Record<Score, string> = {
	C: "Consistent",
	I: "Inconsistent",
	N: "Neutral",
}

function nextScore(s: Score): Score {
	if (s === "C") return "I"
	if (s === "I") return "N"
	return "C"
}

export function ACHMatrix() {
	const [scores, setScores] = useState<Score[][]>(evidence.map((row) => [...row.suggested]))
	const [openRow, setOpenRow] = useState<string | null>(null)

	const inconsistencyCounts = useMemo(
		() => hypotheses.map((_, h) => scores.reduce((acc, row) => acc + (row[h] === "I" ? 1 : 0), 0)),
		[scores]
	)

	const minCount = Math.min(...inconsistencyCounts)
	const maxCount = Math.max(...inconsistencyCounts)
	const allEqual = minCount === maxCount

	const toggleCell = (rowIndex: number, hypIndex: number) => {
		setScores((prev) =>
			prev.map((row, r) => (r === rowIndex ? row.map((s, h) => (h === hypIndex ? nextScore(s) : s)) : row))
		)
	}

	const restoreSuggested = () => setScores(evidence.map((row) => [...row.suggested]))
	const clearToNeutral = () => setScores(evidence.map((row) => row.map(() => "N" as Score)))

	const isRowDiagnostic = (rowIndex: number) => new Set(scores[rowIndex]).size > 1

	return (
		<div className="w-full max-w-4xl mx-auto space-y-6 my-8">
			<Card className="border-border/50 shadow-lg">
				<CardHeader>
					<CardTitle>Analysis of Competing Hypotheses</CardTitle>
					<CardDescription>
						Scenario: your public web server was defaced with hacktivist messaging days after a geopolitical flashpoint.
						Click any cell to re-score it as Consistent, Inconsistent, or Neutral. Click an evidence row for analyst notes.
						The hypothesis with the least inconsistent evidence survives.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-5">

					{/* Controls + legend */}
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div className="flex flex-wrap items-center gap-2">
							{(["C", "I", "N"] as Score[]).map((s) => (
								<span key={s} className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border ${scoreStyles[s]}`}>
									<span className="font-bold">{s}</span>
									{scoreLabels[s]}
								</span>
							))}
						</div>
						<div className="flex gap-2">
							<Button size="sm" variant="outline" onClick={clearToNeutral} className="h-8 text-xs">
								<Eraser className="w-3.5 h-3.5 mr-1.5" />
								Clear
							</Button>
							<Button size="sm" variant="outline" onClick={restoreSuggested} className="h-8 text-xs">
								<RotateCcw className="w-3.5 h-3.5 mr-1.5" />
								Suggested scoring
							</Button>
						</div>
					</div>

					{/* Matrix */}
					<div className="w-full overflow-x-auto">
						<table className="w-full border-collapse min-w-[640px]">
							<thead>
								<tr>
									<th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider p-2 border-b border-border/50 w-[40%]">
										Evidence
									</th>
									{hypotheses.map((hyp, h) => {
										const isSurvivor = !allEqual && inconsistencyCounts[h] === minCount
										return (
											<th key={hyp.id} className="p-2 border-b border-border/50 align-bottom">
												<div className="flex flex-col items-center gap-1">
													<span className={`text-xs font-bold leading-tight text-center ${isSurvivor ? "text-emerald-600 dark:text-emerald-400" : ""}`}>
														{hyp.id}
													</span>
													<span className="text-[11px] text-muted-foreground leading-tight text-center hidden sm:block">
														{hyp.name}
													</span>
												</div>
											</th>
										)
									})}
								</tr>
							</thead>
							<tbody>
								{evidence.map((row, r) => (
									<Fragment key={row.id}>
										<tr className="group">
											<td className="p-2 border-b border-border/30 align-top">
												<button
													onClick={() => setOpenRow(openRow === row.id ? null : row.id)}
													className="flex items-start gap-1.5 text-left text-sm leading-snug hover:text-primary transition-colors w-full"
												>
													<span className="font-mono text-xs text-muted-foreground pt-0.5 flex-shrink-0">{row.id}</span>
													<span className="flex-1">{row.label}</span>
													<span className="flex-shrink-0 pt-0.5 flex items-center gap-1">
														{!isRowDiagnostic(r) && (
															<Badge variant="secondary" className="text-[9px] px-1.5 py-0 hidden md:inline-flex">
																non-diagnostic
															</Badge>
														)}
														{openRow === row.id
															? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
															: <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
														}
													</span>
												</button>
											</td>
											{hypotheses.map((hyp, h) => (
												<td key={hyp.id} className="p-2 border-b border-border/30 text-center align-middle">
													<button
														onClick={() => toggleCell(r, h)}
														title={`${row.id} vs ${hyp.name}: ${scoreLabels[scores[r][h]]}. Click to change.`}
														className={`w-9 h-9 rounded-lg border font-bold text-sm transition-all hover:scale-110 hover:shadow-md ${scoreStyles[scores[r][h]]}`}
													>
														{scores[r][h]}
													</button>
												</td>
											))}
										</tr>
										<AnimatePresence>
											{openRow === row.id && (
												<tr key={`${row.id}-note`}>
													<td colSpan={hypotheses.length + 1} className="p-0 border-b border-border/30">
														<motion.div
															initial={{ opacity: 0, height: 0 }}
															animate={{ opacity: 1, height: "auto" }}
															exit={{ opacity: 0, height: 0 }}
															transition={{ duration: 0.18 }}
															className="overflow-hidden"
														>
															<p className="text-xs leading-relaxed text-muted-foreground italic px-3 py-2.5 bg-muted/40">
																{row.note}
															</p>
														</motion.div>
													</td>
												</tr>
											)}
										</AnimatePresence>
									</Fragment>
								))}

								{/* Totals row */}
								<tr>
									<td className="p-2 pt-3 text-sm font-semibold">Inconsistent evidence count</td>
									{hypotheses.map((hyp, h) => {
										const count = inconsistencyCounts[h]
										const isSurvivor = !allEqual && count === minCount
										const isMostRefuted = !allEqual && count === maxCount
										return (
											<td key={hyp.id} className="p-2 pt-3 text-center">
												<div className="flex flex-col items-center gap-1">
													<span
														className={`inline-flex items-center justify-center w-9 h-9 rounded-lg font-bold text-base border-2 ${
															isSurvivor
																? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border-emerald-500"
																: isMostRefuted
																	? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-400"
																	: "bg-muted text-foreground border-border/50"
														}`}
													>
														{count}
													</span>
													{isSurvivor && (
														<Badge className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[9px] px-1.5 py-0">
															survives
														</Badge>
													)}
													{isMostRefuted && (
														<Badge className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-[9px] px-1.5 py-0">
															most refuted
														</Badge>
													)}
												</div>
											</td>
										)
									})}
								</tr>
							</tbody>
						</table>
					</div>

					{/* Hypothesis descriptions */}
					<div className="grid sm:grid-cols-2 gap-2">
						{hypotheses.map((hyp) => (
							<div key={hyp.id} className="p-3 rounded-lg bg-muted/30 border border-border/30">
								<p className="text-xs leading-relaxed">
									<span className="font-bold font-mono">{hyp.id}</span>
									<span className="font-semibold"> {hyp.name}.</span>{" "}
									<span className="text-muted-foreground">{hyp.detail}</span>
								</p>
							</div>
						))}
					</div>

					{/* Core principle footer */}
					<div className="flex gap-3 p-4 bg-muted/30 rounded-xl border border-border/30 items-start">
						<div className="w-2 flex-shrink-0 self-stretch rounded-full bg-gradient-to-b from-emerald-500 to-red-500" />
						<div>
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Core Principle</p>
							<p className="text-sm leading-relaxed">
								ACH works by refutation, not confirmation. Consistent evidence is cheap: most of it fits several
								hypotheses at once, so counting green cells rewards the story you already believed. Inconsistent
								evidence is what eliminates hypotheses. The judgment goes to the column with the fewest red cells,
								and any row scored the same across the board is telling you nothing at all.
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
