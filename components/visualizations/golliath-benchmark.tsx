"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart2 } from "lucide-react"

interface MetricCard {
    label: string
    value: string
    sub: string
}

interface IOCRow {
    type: string
    count: string
    pct: string
}

interface ModelRow {
    name: string
    f1: string
    speed: string
    lang: string
    note: string
}

export function GolliathBenchmark() {
    const [activeTab, setActiveTab] = useState<"corpus" | "ioc" | "models">("corpus")

    const metrics: MetricCard[] = [
        { label: "Credentials", value: "314,717", sub: "URL + username + password" },
        { label: "Cookies", value: "14.9 M", sub: "Netscape-format records" },
        { label: "Throughput", value: "10.5 MB/s", sub: "end-to-end archive parsing" },
        { label: "IOCs extracted", value: "277,965", sub: "from 2.2M+ indexed messages" },
        { label: "Autofill records", value: "28,409", sub: "form field name/value pairs" },
        { label: "Msg indexing", value: "1,958 msg/s", sub: "IOC extraction baseline" },
    ]

    const iocRows: IOCRow[] = [
        { type: "Domain", count: "189,432", pct: "68.1%" },
        { type: "URL", count: "51,204", pct: "18.4%" },
        { type: "IPv4", count: "28,917", pct: "10.4%" },
        { type: "Crypto wallet", count: "6,144", pct: "2.2%" },
        { type: "CVE-ID", count: "2,268", pct: "0.8%" },
        { type: "Email", count: "0", pct: "backlog" },
    ]

    const modelRows: ModelRow[] = [
        { name: "DistilBERT-NER", f1: "0.81", speed: "fast", lang: "en", note: "Default; balanced accuracy/speed on English logs" },
        { name: "CyNER", f1: "0.74", speed: "fast", lang: "en", note: "Cybersecurity-specific NER, best for en CTI text" },
        { name: "XLM-RoBERTa", f1: "0.76", speed: "slow", lang: "multilingual", note: "Best for non-English archives (RU/TR stealer logs)" },
        { name: "HDBSCAN", f1: "N/A", speed: "fast", lang: "any", note: "Session dedup via multilingual embeddings; ~12% duplicate reduction" },
    ]

    const iocMax = 189432

    return (
        <div className="w-full max-w-4xl mx-auto my-8 space-y-4">
            <Card className="border-border/50 shadow-lg bg-background/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-primary" />
                        Golliath Benchmark Results
                    </CardTitle>
                    <CardDescription>
                        Numbers from a single pipeline run on a real-world corpus.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {metrics.map((m) => (
                            <div key={m.label} className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-1">
                                <div className="text-lg font-bold font-mono">{m.value}</div>
                                <div className="text-xs font-semibold text-foreground">{m.label}</div>
                                <div className="text-xs text-muted-foreground">{m.sub}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 border-b border-border/30">
                        {(["corpus", "ioc", "models"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 px-3 text-sm font-mono border-b-2 transition-colors ${activeTab === tab ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                            >
                                {tab === "corpus" ? "Corpus" : tab === "ioc" ? "IOC Breakdown" : "NLP Models"}
                            </button>
                        ))}
                    </div>

                    {activeTab === "corpus" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {[
                                    ["Credentials", "314,717"],
                                    ["Cookies", "14,900,000"],
                                    ["Autofill records", "28,409"],
                                    ["Credit cards", "1,204"],
                                    ["Throughput", "10.5 MB/s"],
                                    ["Msg indexing", "1,958.7 msg/s"],
                                    ["IOC pipeline", "277,965 IOCs"],
                                    ["Family match rate", "85%"],
                                    ["Generic fallback", "15%"],
                                    ["Session dedup", "~12% reduction"],
                                ].map(([label, val]) => (
                                    <div key={label} className="flex justify-between border-b border-border/20 pb-2">
                                        <span className="text-muted-foreground">{label}</span>
                                        <span className="font-mono font-semibold">{val}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs text-muted-foreground italic pt-1">
                                Families covered: Lumma C2, RisePro, WhiteSnake, RedLine, plus 8 aggregator brands handled by GenericGrammar.
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "ioc" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            <div className="space-y-2">
                                {iocRows.map((row) => (
                                    <div key={row.type} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground font-mono">{row.type}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono">{row.count}</span>
                                                <Badge variant="outline" className="text-xs w-16 text-center">{row.pct}</Badge>
                                            </div>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: row.count === "0" ? "0%" : `${(parseInt(row.count.replace(/,/g, "")) / iocMax) * 100}%` }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                                className="h-full rounded-full bg-primary/70"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-xs text-muted-foreground pt-1">
                                Total: 277,965 IOCs across 2.2M+ indexed messages. Domain TLD allowlist eliminates false positives from free-form text.
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "models" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                            {modelRows.map((row) => (
                                <div key={row.name} className="p-3 rounded-lg bg-muted/20 border border-border/30 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono font-semibold text-sm">{row.name}</span>
                                        <div className="flex items-center gap-2">
                                            {row.f1 !== "N/A" && <Badge variant="outline" className="text-xs font-mono">F1 {row.f1}</Badge>}
                                            <Badge variant="secondary" className="text-xs">{row.speed}</Badge>
                                            <Badge variant="outline" className="text-xs">{row.lang}</Badge>
                                        </div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">{row.note}</div>
                                </div>
                            ))}
                            <div className="text-xs text-muted-foreground pt-1">
                                DistilBERT-NER is the default config. XLM-RoBERTa is toggled on for non-English archive batches. HDBSCAN runs post-extraction for deduplication.
                            </div>
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
