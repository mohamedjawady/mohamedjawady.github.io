"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitMerge } from "lucide-react"

interface Grammar {
    id: string
    name: string
    trigger: string
    confidence: number
    evidence: string[]
    fields: string[]
    example: string
}

const GRAMMARS: Grammar[] = [
    {
        id: "lumma",
        name: "LummaGrammar",
        trigger: "domain_detect.txt",
        confidence: 0.82,
        evidence: [
            "domain_detect.txt or domaindetect.txt in root",
            "Passwords/ directory present",
            "Autofill/ directory present",
        ],
        fields: ["passwords (key:value blocks)", "cookies (Netscape TSV)", "autofill", "system_info"],
        example: "Lumma C2 / LummaC2-as-a-Service archives",
    },
    {
        id: "risepro",
        name: "RiseProGrammar",
        trigger: "Network/UserName* dirs",
        confidence: 0.88,
        evidence: [
            "Network/ directory contains UserName_HASH subdirs",
            "Each subdir: Passwords.txt + Cookies.txt",
            "No domain_detect.txt present",
        ],
        fields: ["passwords (TSV format)", "cookies (Netscape 7-col)", "system_info"],
        example: "RisePro Stealer v0.x/1.x archives",
    },
    {
        id: "whitesnake",
        name: "WhiteSnakeGrammar",
        trigger: "System_* + Cookies/",
        confidence: 0.95,
        evidence: [
            "System_<HOSTNAME>/ directories in root",
            "Cookies/ directory at root level",
        ],
        fields: ["passwords (colon-separated)", "cookies", "autofill", "credit cards"],
        example: "WhiteSnake Stealer aggregator repacks",
    },
    {
        id: "redline",
        name: "RedLineGrammar",
        trigger: "log.txt + Passwords/",
        confidence: 0.78,
        evidence: [
            "log.txt at session root with metadata header",
            "Passwords/ directory with browser-named .txt files",
            "Autofill/ or CreditCards/ optionally present",
        ],
        fields: ["passwords (pipe-separated)", "cookies", "autofill", "cc"],
        example: "RedLine Stealer v22-v24 archives",
    },
    {
        id: "generic",
        name: "GenericGrammar",
        trigger: "Fallback (always 0.0)",
        confidence: 0.0,
        evidence: [
            "No family-specific signature found",
            "Invoked only when all others score < 0.60",
            "Uses all 4 password format parsers in cascade",
        ],
        fields: ["passwords (all 4 formats tried)", "cookies (best-effort)", "system_info (alias map)"],
        example: "Unknown aggregator repacks, custom builds, mixed archives",
    },
]

interface SimInput {
    hasDomainDetect: boolean
    hasNetworkUserDirs: boolean
    hasSystemDirs: boolean
    hasLogTxt: boolean
}

function computeScores(input: SimInput): Record<string, number> {
    return {
        lumma: input.hasDomainDetect ? 0.82 : 0.05,
        risepro: input.hasNetworkUserDirs ? 0.88 : 0.04,
        whitesnake: input.hasSystemDirs ? 0.95 : 0.03,
        redline: input.hasLogTxt ? 0.78 : 0.04,
        generic: 0.0,
    }
}

export function GolliathGrammarRouter() {
    const [selected, setSelected] = useState<string>("whitesnake")
    const [simInput, setSimInput] = useState<SimInput>({
        hasDomainDetect: false,
        hasNetworkUserDirs: false,
        hasSystemDirs: true,
        hasLogTxt: false,
    })
    const [showSim, setShowSim] = useState(false)

    const scores = computeScores(simInput)
    const winner = Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a))
    const winnerGrammar = GRAMMARS.find((g) => g.id === winner[0]) ?? GRAMMARS[4]
    const sel = GRAMMARS.find((g) => g.id === selected) ?? GRAMMARS[0]

    const isActive = (id: string) => (showSim ? false : selected === id)

    return (
        <div className="w-full max-w-4xl mx-auto my-8 space-y-4">
            <Card className="border-border/50 shadow-lg bg-background/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitMerge className="w-5 h-5 text-primary" />
                        Grammar Router: Confidence Competition
                    </CardTitle>
                    <CardDescription>
                        Each FamilyGrammar scores the layout evidence. Highest above 0.60 wins. Explore family signatures or simulate your own archive layout.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                        {GRAMMARS.map((g) => (
                            <button
                                key={g.id}
                                onClick={() => { setSelected(g.id); setShowSim(false) }}
                                className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 ${
                                    isActive(g.id)
                                        ? "border-primary/60 bg-primary/10 text-foreground ring-1 ring-primary/40"
                                        : "border-border/50 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground"
                                }`}
                            >
                                {g.name}
                            </button>
                        ))}
                        <button
                            onClick={() => setShowSim(true)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 ${
                                showSim
                                    ? "border-primary/60 bg-primary/10 text-foreground ring-1 ring-primary/40"
                                    : "border-border/50 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground"
                            }`}
                        >
                            Simulate
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {!showSim ? (
                            <motion.div
                                key={sel.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
                                        <span className="font-mono font-semibold text-sm">{sel.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground">confidence</span>
                                            <Badge variant="outline" className="font-mono text-xs">
                                                {sel.confidence.toFixed(2)}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground font-mono">Score</div>
                                        <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${sel.confidence * 100}%` }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                                className="h-full rounded-full bg-primary/70"
                                            />
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {sel.confidence > 0
                                                ? "Above 0.60 threshold: wins routing"
                                                : "Always fallback: activates when all others fail"}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Primary Trigger</div>
                                        <code className="text-xs bg-muted/30 px-2 py-1 rounded font-mono text-primary block">{sel.trigger}</code>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Example</div>
                                        <div className="text-xs text-muted-foreground italic">{sel.example}</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Evidence scored by matches()</div>
                                        <ul className="space-y-1.5">
                                            {sel.evidence.map((e) => (
                                                <li key={e} className="text-sm text-muted-foreground flex items-start gap-2">
                                                    <span className="text-primary mt-0.5 shrink-0">-</span> {e}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-2 pt-2 border-t border-border/30">
                                        <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Fields extracted</div>
                                        <div className="flex flex-wrap gap-1">
                                            {sel.fields.map((f) => (
                                                <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="sim"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="space-y-4"
                            >
                                <div className="text-sm text-muted-foreground">Toggle archive layout signals. The router picks the highest-scoring grammar above 0.60.</div>
                                <div className="grid grid-cols-2 gap-3">
                                    {(
                                        [
                                            { key: "hasDomainDetect", label: "domain_detect.txt present" },
                                            { key: "hasNetworkUserDirs", label: "Network/UserName_* dirs" },
                                            { key: "hasSystemDirs", label: "System_<HOST>/ dirs" },
                                            { key: "hasLogTxt", label: "log.txt + Passwords/ dir" },
                                        ] as { key: keyof SimInput; label: string }[]
                                    ).map(({ key, label }) => (
                                        <label
                                            key={key}
                                            className="flex items-center gap-2 text-sm cursor-pointer group"
                                            onClick={() => setSimInput((p) => ({ ...p, [key]: !p[key] }))}
                                        >
                                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${simInput[key] ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
                                                {simInput[key] && <div className="w-2 h-2 bg-primary-foreground rounded-sm" />}
                                            </div>
                                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="space-y-2 pt-2">
                                    {GRAMMARS.map((g) => {
                                        const score = scores[g.id]
                                        const isWinner = g.id === winner[0] && score > 0
                                        return (
                                            <div key={g.id} className="space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-mono text-muted-foreground">{g.name}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono">{score.toFixed(2)}</span>
                                                        {isWinner && <Badge className="text-[10px] px-1.5 py-0">SELECTED</Badge>}
                                                    </div>
                                                </div>
                                                <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                                                    <motion.div
                                                        animate={{ width: `${score * 100}%` }}
                                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                                        className={`h-full rounded-full ${isWinner ? "bg-primary" : "bg-muted-foreground/30"}`}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="p-3 rounded-lg border border-border/50 bg-muted/20 text-sm">
                                    <span className="text-muted-foreground">Router selects: </span>
                                    <span className="font-mono font-semibold">{winnerGrammar.name}</span>
                                    <span className="text-muted-foreground"> (confidence {scores[winnerGrammar.id].toFixed(2)})</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    )
}
