"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface LanguageInfo {
    id: string
    name: string
    examples: string[]
    machine: string
    color: string
    description: string
}

export function LanguageHierarchyVenn() {
    const [activeLanguage, setActiveLanguage] = useState<string | null>(null)

    const languages: LanguageInfo[] = [
        {
            id: "re",
            name: "Recursively Enumerable (Type 0)",
            examples: ["Arbitrary programs", "Halting problem instances", "Self-modifying code"],
            machine: "Turing Machine",
            color: "rgba(239, 68, 68, 0.15)",
            description: "The most general class. Includes all languages recognizable by any computational process. Membership is semi-decidable: we can confirm strings in the language but may loop forever on strings outside it."
        },
        {
            id: "csl",
            name: "Context-Sensitive (Type 1)",
            examples: ["a^n b^n c^n", "Type systems", "Natural language (approx.)"],
            machine: "Linear Bounded Automaton",
            color: "rgba(249, 115, 22, 0.2)",
            description: "Languages where production rules can depend on surrounding context. Memory usage is bounded by input length. Membership is decidable but computationally expensive (PSPACE-complete)."
        },
        {
            id: "cfl",
            name: "Context-Free (Type 2)",
            examples: ["JSON", "XML", "HTML", "SQL", "a^n b^n", "Balanced brackets"],
            machine: "Pushdown Automaton (Stack)",
            color: "rgba(234, 179, 8, 0.25)",
            description: "Languages defined by recursive nesting. Require a stack for recognition. Membership decidable in O(n³) via CYK algorithm or O(n) for deterministic subclass. Most data formats live here."
        },
        {
            id: "reg",
            name: "Regular (Type 3)",
            examples: ["Email patterns", "IP addresses", "Simple tokens", "a*b*", "(ab)*"],
            machine: "Finite Automaton (No memory)",
            color: "rgba(34, 197, 94, 0.3)",
            description: "The simplest class. No memory beyond current state. Membership decidable in O(n) time. Closed under all Boolean operations. Safe and predictable—ideal for simple validation."
        }
    ]

    const getLanguageById = (id: string) => languages.find(l => l.id === id)

    return (
        <Card className="w-full max-w-3xl mx-auto my-8 border-border/50">
            <CardHeader>
                <CardTitle className="text-lg">The Chomsky Hierarchy: Language Classes</CardTitle>
                <CardDescription>
                    Nested sets showing containment. Every regular language is context-free, every CFL is context-sensitive, etc.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Venn Diagram */}
                <div className="relative bg-muted/30 rounded-lg p-4 border border-border/50">
                    <svg viewBox="0 0 500 320" className="w-full h-auto">
                        {/* Recursively Enumerable - outermost */}
                        <motion.ellipse
                            cx="250"
                            cy="160"
                            rx="240"
                            ry="150"
                            fill={languages[0].color}
                            stroke={activeLanguage === "re" ? "rgb(239, 68, 68)" : "rgba(239, 68, 68, 0.5)"}
                            strokeWidth={activeLanguage === "re" ? 3 : 1.5}
                            className="cursor-pointer transition-all"
                            onClick={() => setActiveLanguage(activeLanguage === "re" ? null : "re")}
                            whileHover={{ strokeWidth: 2.5 }}
                        />

                        {/* Context-Sensitive */}
                        <motion.ellipse
                            cx="250"
                            cy="165"
                            rx="190"
                            ry="120"
                            fill={languages[1].color}
                            stroke={activeLanguage === "csl" ? "rgb(249, 115, 22)" : "rgba(249, 115, 22, 0.5)"}
                            strokeWidth={activeLanguage === "csl" ? 3 : 1.5}
                            className="cursor-pointer transition-all"
                            onClick={() => setActiveLanguage(activeLanguage === "csl" ? null : "csl")}
                            whileHover={{ strokeWidth: 2.5 }}
                        />

                        {/* Context-Free */}
                        <motion.ellipse
                            cx="250"
                            cy="170"
                            rx="140"
                            ry="90"
                            fill={languages[2].color}
                            stroke={activeLanguage === "cfl" ? "rgb(234, 179, 8)" : "rgba(234, 179, 8, 0.6)"}
                            strokeWidth={activeLanguage === "cfl" ? 3 : 1.5}
                            className="cursor-pointer transition-all"
                            onClick={() => setActiveLanguage(activeLanguage === "cfl" ? null : "cfl")}
                            whileHover={{ strokeWidth: 2.5 }}
                        />

                        {/* Regular - innermost */}
                        <motion.ellipse
                            cx="250"
                            cy="175"
                            rx="85"
                            ry="55"
                            fill={languages[3].color}
                            stroke={activeLanguage === "reg" ? "rgb(34, 197, 94)" : "rgba(34, 197, 94, 0.7)"}
                            strokeWidth={activeLanguage === "reg" ? 3 : 1.5}
                            className="cursor-pointer transition-all"
                            onClick={() => setActiveLanguage(activeLanguage === "reg" ? null : "reg")}
                            whileHover={{ strokeWidth: 2.5 }}
                        />

                        {/* Labels */}
                        <text x="250" y="175" textAnchor="middle" className="text-xs fill-green-700 dark:fill-green-400 font-medium pointer-events-none">
                            Regular
                        </text>
                        <text x="250" y="105" textAnchor="middle" className="text-xs fill-yellow-700 dark:fill-yellow-400 font-medium pointer-events-none">
                            Context-Free
                        </text>
                        <text x="250" y="60" textAnchor="middle" className="text-xs fill-orange-700 dark:fill-orange-400 font-medium pointer-events-none">
                            Context-Sensitive
                        </text>
                        <text x="250" y="25" textAnchor="middle" className="text-xs fill-red-700 dark:fill-red-400 font-medium pointer-events-none">
                            Recursively Enumerable
                        </text>

                        {/* Example annotations */}
                        <text x="250" y="190" textAnchor="middle" className="text-[10px] fill-muted-foreground pointer-events-none font-mono">
                            a*b*, IPs
                        </text>
                        <text x="395" y="175" textAnchor="middle" className="text-[10px] fill-muted-foreground pointer-events-none font-mono">
                            JSON, SQL
                        </text>
                        <text x="435" y="130" textAnchor="middle" className="text-[10px] fill-muted-foreground pointer-events-none font-mono">
                            aⁿbⁿcⁿ
                        </text>
                        <text x="460" y="70" textAnchor="middle" className="text-[10px] fill-muted-foreground pointer-events-none font-mono">
                            Programs
                        </text>
                    </svg>
                </div>

                {/* Details Panel */}
                {activeLanguage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg bg-muted/30 border border-border/50 p-4 space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{getLanguageById(activeLanguage)?.name}</h4>
                            <span className="text-xs font-mono bg-background px-2 py-1 rounded border border-border/50">
                                {getLanguageById(activeLanguage)?.machine}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {getLanguageById(activeLanguage)?.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {getLanguageById(activeLanguage)?.examples.map((ex, i) => (
                                <span key={i} className="text-xs font-mono bg-background px-2 py-1 rounded border border-border/50">
                                    {ex}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                {!activeLanguage && (
                    <div className="text-center text-sm text-muted-foreground">
                        Click on a region to learn about that language class.
                    </div>
                )}

                {/* Key insight */}
                <div className="text-xs text-muted-foreground border-t border-border/50 pt-3">
                    <strong>Key insight:</strong> Each inner class is a proper subset of the outer. A regex (Regular) cannot match balanced brackets (Context-Free). A PDA cannot verify aⁿbⁿcⁿ (Context-Sensitive).
                </div>
            </CardContent>
        </Card>
    )
}
