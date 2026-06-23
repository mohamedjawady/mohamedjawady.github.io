"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart2 } from "lucide-react"

interface MetricCard {
    label: string
    value: string
    sub: string
}

export function GolliathBenchmark() {
    const metrics: MetricCard[] = [
        { label: "Credentials", value: "314,717", sub: "URL + username + password" },
        { label: "Cookies", value: "14.9 M", sub: "Netscape-format records" },
        { label: "Throughput", value: "10.5 MB/s", sub: "end-to-end archive parsing" },
        { label: "Autofill records", value: "28,409", sub: "form field name/value pairs" },
        { label: "Credit cards", value: "1,204", sub: "PAN + expiry + CVV" },
        { label: "Msg indexing", value: "1,958.7 msg/s", sub: "OpenSearch indexing rate" },
    ]

    const corpusRows: [string, string][] = [
        ["Credentials", "314,717"],
        ["Cookies", "14,900,000"],
        ["Autofill records", "28,409"],
        ["Credit cards", "1,204"],
        ["Throughput", "10.5 MB/s"],
        ["Msg indexing", "1,958.7 msg/s"],
        ["Family match rate", "85%"],
        ["Generic fallback", "15%"],
        ["Known aggregator brands", "8+"],
    ]

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

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {corpusRows.map(([label, val]) => (
                            <div key={label} className="flex justify-between border-b border-border/20 pb-2">
                                <span className="text-muted-foreground">{label}</span>
                                <span className="font-mono font-semibold">{val}</span>
                            </div>
                        ))}
                    </div>
                    <div className="text-xs text-muted-foreground italic pt-1">
                        Families covered: Lumma C2, RisePro, WhiteSnake, RedLine, plus aggregator brands handled by GenericGrammar.
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
