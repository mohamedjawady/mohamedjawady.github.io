"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ShieldAlert, Code, Brain, Binary, ChevronRight, FileCode, CheckCircle2, XCircle } from "lucide-react"

export function ChomskySecurityHierarchy() {
    const [activeLevel, setActiveLevel] = useState<number | null>(null)

    const hierarchy = [
        {
            level: 0,
            name: "Recursively Enumerable (Type 0)",
            icon: <Brain className="w-6 h-6 text-red-500" />,
            machine: "Turing Machine",
            security_implication: "Total Unpredictability",
            desc: "The most powerful level. Can compute anything that is computable. From a security perspective, this is the 'danger zone'.",
            examples: [
                { text: "Arbitrary Code Execution", icon: <Binary className="w-3 h-3" /> },
                { text: "Complex Interpreters", icon: <FileCode className="w-3 h-3" /> },
                { text: "The Halting Problem (Undecidable)", icon: <ShieldAlert className="w-3 h-3 text-red-500" /> }
            ],
            defense: "Impossible to fully analyze statically. Requires dynamic analysis (sandboxing) or formal verification."
        },
        {
            level: 1,
            name: "Context-Sensitive (Type 1)",
            icon: <Code className="w-6 h-6 text-orange-500" />,
            machine: "Linear Bounded Automaton",
            security_implication: "Memory & State Complexity",
            desc: "Languages where the meaning depends on the surrounding context. Still extremely hard to secure.",
            examples: [
                { text: "C++ Template Metaprogramming", icon: <FileCode className="w-3 h-3" /> },
                { text: "Natural Language (mostly)", icon: <CheckCircle2 className="w-3 h-3" /> }
            ],
            defense: "Strict resource bounds needed. prone to 'weird machines' and unintended state transitions."
        },
        {
            level: 2,
            name: "Context-Free (Type 2)",
            icon: <FileCode className="w-6 h-6 text-yellow-500" />,
            machine: "Pushdown Automaton (Stack)",
            security_implication: "The Sweet Spot for Parsing",
            desc: "The standard for most data formats (JSON, XML). Requires memory (a stack) to handle nesting.",
            examples: [
                { text: "JSON / XML Parsing", icon: <CheckCircle2 className="w-3 h-3" /> },
                { text: "Programming Syntax (ASTs)", icon: <Code className="w-3 h-3" /> },
                { text: "SQL Queries", icon: <Binary className="w-3 h-3" /> }
            ],
            defense: "Safe if parsed with a formal grammar. DANGEROUS if parsed with Regex (leads to WAF bypasses)."
        },
        {
            level: 3,
            name: "Regular (Type 3)",
            icon: <Shield className="w-6 h-6 text-green-500" />,
            machine: "Finite Automaton (DFA/NFA)",
            security_implication: "Safe & Predictable",
            desc: "The simplest level. No memory, just states. If you can define your input here, do it.",
            examples: [
                { text: "Email Addresses", icon: <CheckCircle2 className="w-3 h-3 text-green-600" /> },
                { text: "IP Addresses", icon: <CheckCircle2 className="w-3 h-3 text-green-600" /> },
                { text: "Simple Tokens", icon: <Binary className="w-3 h-3" /> }
            ],
            defense: "Highly secure. Predictable runtime O(n). Immune to 'stack exhaustion' attacks."
        }
    ]

    return (
        <div className="w-full max-w-4xl mx-auto my-8 space-y-6">
            <Card className="border-border/50 shadow-lg bg-background/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        The Security Chomsky Hierarchy
                    </CardTitle>
                    <CardDescription>
                        Explore how Formal Language Theory dictates security boundaries. The higher you go, the harder it is to secure.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* The Hierarchy Visual */}
                    <div className="flex flex-col gap-2">
                        {hierarchy.map((item) => (
                            <motion.div
                                key={item.level}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <Button
                                    variant={activeLevel === item.level ? "secondary" : "ghost"}
                                    className={`w-full justify-between h-auto py-4 px-6 border ${activeLevel === item.level ? "border-primary bg-primary/5" : "border-border/50"} hover:border-primary/50 transition-all`}
                                    onClick={() => setActiveLevel(activeLevel === item.level ? null : item.level)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg bg-background border ${activeLevel === item.level ? "border-primary" : "border-muted"}`}>
                                            {item.icon}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold flex items-center gap-2">
                                                {item.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground font-mono mt-0.5">
                                                Machine: {item.machine}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${activeLevel === item.level ? "rotate-90" : ""}`} />
                                </Button>
                            </motion.div>
                        ))}
                    </div>

                    {/* Details Panel */}
                    <AnimatePresence mode="wait">
                        {activeLevel !== null && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                key={activeLevel}
                                className="rounded-xl bg-muted/30 border border-border/50 p-6 space-y-4"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                                            <ShieldAlert className="w-4 h-4" />
                                            Security Implication
                                        </div>
                                        <h4 className="text-lg font-medium">{hierarchy.find(h => h.level === activeLevel)?.security_implication}</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {hierarchy.find(h => h.level === activeLevel)?.desc}
                                        </p>
                                    </div>

                                    <div className="w-px bg-border hidden md:block" />

                                    <div className="flex-1 space-y-4">
                                        <div className="text-sm font-semibold flex items-center gap-2">
                                            <Binary className="w-4 h-4" />
                                            Examples
                                        </div>
                                        <div className="grid grid-cols-1 gap-2">
                                            {hierarchy.find(h => h.level === activeLevel)?.examples.map((ex, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm p-2 rounded bg-background border border-border/50">
                                                    {ex.icon}
                                                    <span>{ex.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-border/50">
                                    <div className="flex items-baseline gap-2 text-sm opacity-90">
                                        <span className="font-bold text-red-500">Defense Strategy:</span>
                                        <span className="text-muted-foreground">{hierarchy.find(h => h.level === activeLevel)?.defense}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {activeLevel === null && (
                        <div className="text-center p-8 text-muted-foreground text-sm">
                            Select a level in the hierarchy to reveal its cybersecurity implications.
                        </div>
                    )}

                </CardContent>
            </Card>
        </div>
    )
}
