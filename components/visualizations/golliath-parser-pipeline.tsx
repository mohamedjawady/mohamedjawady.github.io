"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileSearch, ChevronRight } from "lucide-react"

interface Stage {
    id: string
    label: string
    sublabel: string
    what: string
    how: string[]
    outputs: string[]
}

export function GolliathParserPipeline() {
    const [active, setActive] = useState<string | null>("walker")

    const stages: Stage[] = [
        {
            id: "walker",
            label: "Walker",
            sublabel: "Recursive Traversal",
            what: "Recursively walk the extracted archive tree. Enforce safety limits before touching anything.",
            how: [
                "Extracts ZIP/RAR/7z/TAR with format-specific decompressors",
                "Archive bomb guard: ratio > 20x above 1 MB — abort",
                "Entry count cap: > 100,000 entries — abort",
                "Nested archive depth: max 3 levels",
                "Zip-slip protection: resolves all symlinks before extraction",
                "Emits { path, size, mtime } records for classifier",
            ],
            outputs: ["File path + metadata stream"],
        },
        {
            id: "layout",
            label: "Layout Classifier",
            sublabel: "Grammar Selection",
            what: "Survey the directory structure to decide which stealer family grammar to try first. Uses heuristics — no file content yet.",
            how: [
                "Checks for domain_detect.txt / domaindetect.txt — Lumma",
                "Looks for Network/UserName* pattern — RisePro",
                "Checks for System_* parallel to Cookies/ — WhiteSnake",
                "Looks for log.txt + Password/*.txt — RedLine",
                "Falls back to GenericGrammar if no signal matches",
                "Returns ranked grammar list (confidence-ordered)",
            ],
            outputs: ["Ranked grammar candidates"],
        },
        {
            id: "file-classifier",
            label: "File Classifier",
            sublabel: "File-type Routing",
            what: "Classify every file in the tree by role — credentials, cookies, system info, autofill, etc. — before any extraction runs.",
            how: [
                "Pattern matches on path + name (case-insensitive)",
                "Roles: passwords, cookies, system_info, autofill, cc, browser_history",
                "Uses regex map per grammar family (Lumma paths differ from RedLine)",
                "Skips executables, images, and files > 50 MB",
                "Produces role to file-path mapping consumed by extractors",
            ],
            outputs: ["{ role: [paths] } map"],
        },
        {
            id: "grammar-router",
            label: "Grammar Router",
            sublabel: "Confidence Competition",
            what: "Run grammar.matches() on the layout evidence. Highest confidence above 0.60 wins. Tie-break: most-specific family first, GenericGrammar last.",
            how: [
                "Each FamilyGrammar.matches(layout) returns float 0.0-1.0",
                "Threshold 0.60 — below that, fall through to Generic",
                "LummaGrammar: checks domain_detect.txt presence (score ~0.80)",
                "RiseProGrammar: UserName* directories (score ~0.88)",
                "WhiteSnakeGrammar: System_* + Cookies/ co-presence (score ~0.95)",
                "GenericGrammar: always returns 0.0 (unconditional fallback)",
            ],
            outputs: ["Selected FamilyGrammar instance"],
        },
        {
            id: "extractors",
            label: "Field Extractors",
            sublabel: "Structured Parsing",
            what: "Per-role parsers run in priority order on the classified files. Each produces typed records.",
            how: [
                "passwords: 4 cascading format parsers (key:value, TSV, pipe, colon)",
                "cookies: Netscape 7-column TSV, strict column count validation",
                "system_info: alias map (hostname, os, ip, hardware, ...)",
                "autofill: form field name/value pairs",
                "cc: regex for 13-19 digit PAN + CVV + expiry",
                "All extractor output typed as PasswordRecord | CookieRecord | SystemInfo",
            ],
            outputs: ["Typed structured records per role"],
        },
        {
            id: "nlp",
            label: "NLP Enrichment",
            sublabel: "IOC + NER",
            what: "Final enrichment pass: regex-extract IOCs from all text fields, then classify each session with ML models.",
            how: [
                "IOC regex: domain, IPv4, URL, crypto wallet, CVE-ID patterns",
                "Domain validation with TLD allowlist — rejects false positives",
                "NER with DistilBERT-NER or CyNER depending on config",
                "HDBSCAN clustering on multilingual embeddings for session dedup",
                "Threat classification: stealer family label, confidence, source",
                "Appends enrichment fields to each record before JSON serialization",
            ],
            outputs: ["out.json with enriched sessions, IOCs, threat labels"],
        },
    ]

    const sel = stages.find((s) => s.id === active) ?? stages[0]

    return (
        <div className="w-full max-w-4xl mx-auto my-8">
            <Card className="border-border/50 shadow-lg bg-background/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileSearch className="w-5 h-5 text-primary" />
                        parser_logs Processing Pipeline
                    </CardTitle>
                    <CardDescription>
                        Six-stage pipeline from raw archive to enriched structured intelligence. Click any stage.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-wrap items-center gap-1">
                        {stages.map((s, i) => (
                            <div key={s.id} className="flex items-center">
                                <button
                                    onClick={() => setActive(s.id)}
                                    className={`px-3 py-2 rounded-lg border text-sm font-mono transition-all duration-200 ${
                                        active === s.id
                                            ? "border-primary/60 bg-primary/10 text-foreground ring-1 ring-primary/40 shadow"
                                            : "border-border/50 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground"
                                    }`}
                                >
                                    {s.label}
                                </button>
                                {i < stages.length - 1 && (
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 mx-0.5 shrink-0" />
                                )}
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={sel.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.18 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            <div className="md:col-span-1 space-y-3">
                                <div className="p-3 rounded-lg border border-border/50 bg-muted/20">
                                    <div className="font-semibold text-sm">{sel.label}</div>
                                    <div className="text-xs text-muted-foreground mt-0.5">{sel.sublabel}</div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{sel.what}</p>
                                <div className="space-y-1 pt-1">
                                    <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Output</div>
                                    {sel.outputs.map((o) => (
                                        <Badge key={o} variant="secondary" className="text-xs block w-fit">
                                            {o}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2">Implementation</div>
                                <ul className="space-y-2">
                                    {sel.how.map((h) => (
                                        <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="text-primary mt-0.5 shrink-0 font-bold">-</span>
                                            <span>{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    )
}
