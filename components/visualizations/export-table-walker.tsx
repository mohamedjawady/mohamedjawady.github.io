"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Search, FileCode } from "lucide-react"

export function ExportTableWalker() {
    const [step, setStep] = useState(0)

    // Simulating LdrGetProcedureAddress ("CreateFileW")
    const steps = [
        {
            title: "1. Locate Export Directory",
            description: "From Optional Header -> DataDirectory[0] -> IMAGE_EXPORT_DIRECTORY",
            code: "ExportTable = (DWORD64)hModule + Optional->DataDirectory[0].VirtualAddress",
            highlight: "header"
        },
        {
            title: "2. Get Array Pointers",
            description: "Calculate pointers to Names, Functions, and Ordinals arrays using RVA + Base.",
            code: "Names = Base + Export->AddressOfNames\nFuncs = Base + Export->AddressOfFunctions\nOrds  = Base + Export->AddressOfNameOrdinals",
            highlight: "arrays"
        },
        {
            title: "3. Iterate Names Array",
            description: "Loop through AddressOfNames to match the function string.",
            code: "for (i = 0; i < NumberOfNames; i++) {\n  Name = Base + Names[i];\n  if (strcmp(Name, \"CreateFileW\") == 0) found = true;\n}",
            highlight: "search"
        },
        {
            title: "4. Get Ordinal",
            description: "Use the index 'i' from the Names array to find the Ordinal.",
            code: "Ordinal = Ords[i]; // Index matches Names array",
            highlight: "ordinal"
        },
        {
            title: "5. Get Function Address",
            description: "Use the Ordinal as an index into AddressOfFunctions.",
            code: "FunctionRVA = Funcs[Ordinal];\nAddress = Base + FunctionRVA;",
            highlight: "final"
        }
    ]

    const nextStep = () => setStep(s => Math.min(s + 1, steps.length - 1))
    const prevStep = () => setStep(s => Math.max(s - 1, 0))

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4 my-8">
            <Card className="border-border/50 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-green-500" />
                        Manual Export Resolution
                    </CardTitle>
                    <CardDescription>
                        Visualizing how <code>LdrLoadGetProcedureAddress</code> finds a function address manually.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Controls */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={prevStep}
                            disabled={step === 0}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-muted hover:bg-muted/80 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <div className="text-sm font-mono text-muted-foreground">
                            Step {step + 1} of {steps.length}
                        </div>
                        <button
                            onClick={nextStep}
                            disabled={step === steps.length - 1}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                    {/* Explanation */}
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                        <h4 className="font-bold text-primary mb-1">{steps[step].title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{steps[step].description}</p>
                        <pre className="bg-background p-3 rounded text-xs font-mono overflow-x-auto border border-border/50">
                            {steps[step].code}
                        </pre>
                    </div>

                    {/* Visualization Diagram */}
                    <div className="relative p-6 bg-background rounded-lg border border-border overflow-hidden min-h-[300px] flex items-center justify-center">
                        <div className="flex gap-8 items-start">

                            {/* Export Directory */}
                            <div className={`p-4 rounded border-2 transition-all duration-300 w-48 space-y-2 ${step >= 0 ? 'opacity-100 border-blue-500 bg-blue-500/5' : 'opacity-30 border-border'}`}>
                                <div className="text-xs font-bold text-center border-b pb-2 mb-2">IMAGE_EXPORT_DIRECTORY</div>
                                <div className={`text-xs font-mono flex justify-between ${step === 1 ? 'text-yellow-500 font-bold' : ''}`}>
                                    <span>AddressOfNames</span>
                                    <span>➔</span>
                                </div>
                                <div className={`text-xs font-mono flex justify-between ${step === 1 ? 'text-purple-500 font-bold' : ''}`}>
                                    <span>AddressOfFunctions</span>
                                    <span>➔</span>
                                </div>
                                <div className={`text-xs font-mono flex justify-between ${step === 1 ? 'text-orange-500 font-bold' : ''}`}>
                                    <span>AddressOfOrdinals</span>
                                    <span>➔</span>
                                </div>
                            </div>

                            {/* Arrays */}
                            <div className="space-y-4">
                                {/* Names Array */}
                                <div className={`flex items-center gap-2 transition-all duration-500 ${step >= 1 ? 'translate-x-0 opacity-100' : 'translate-x-[10px] opacity-0'}`}>
                                    <div className={`w-32 p-2 rounded border border-yellow-500/50 bg-yellow-500/10 text-xs font-mono text-center relative`}>
                                        Names[]
                                        {step === 2 && (
                                            <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-green-500 animate-ping" />
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Index [i]</div>
                                </div>

                                {/* Ordinals Array */}
                                <div className={`flex items-center gap-2 transition-all duration-500 delay-100 ${step >= 1 ? 'translate-x-0 opacity-100' : 'translate-x-[10px] opacity-0'}`}>
                                    <div className={`w-32 p-2 rounded border border-orange-500/50 bg-orange-500/10 text-xs font-mono text-center relative`}>
                                        Ordinals[]
                                        {step === 3 && (
                                            <>
                                                <Badge className="absolute -right-24 top-0 bg-orange-500 text-[10px]">
                                                    Value = 7
                                                </Badge>
                                                <div className="absolute inset-0 border-2 border-orange-500 rounded animate-pulse" />
                                            </>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Index [i]</div>
                                </div>

                                {/* Functions Array */}
                                <div className={`flex items-center gap-2 transition-all duration-500 delay-200 ${step >= 1 ? 'translate-x-0 opacity-100' : 'translate-x-[10px] opacity-0'}`}>
                                    <div className={`w-32 p-2 rounded border border-purple-500/50 bg-purple-500/10 text-xs font-mono text-center relative`}>
                                        Functions[]
                                        {step === 4 && (
                                            <>
                                                <Badge className="absolute -right-24 top-0 bg-green-500 text-[10px]">
                                                    Addr: 0x7FF...
                                                </Badge>
                                                <div className="absolute inset-0 border-2 border-green-500 rounded animate-pulse" />
                                            </>
                                        )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Index [Ordinal]</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
