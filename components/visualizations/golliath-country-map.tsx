"use client"

import { useState } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe } from "lucide-react"

const GEO_URL = "/world-110m.json"

// ISO 3166-1 numeric to 2-letter TLD
const NUMERIC_TO_TLD: Record<number, string> = {
    76: "br", 356: "in", 360: "id", 643: "ru", 250: "fr", 380: "it",
    484: "mx", 32: "ar", 724: "es", 276: "de", 826: "uk", 704: "vn",
    792: "tr", 604: "pe", 616: "pl", 152: "cl", 818: "eg", 682: "sa",
    764: "th", 586: "pk", 840: "us",
}

// Live credential counts from TLD analytics (315M+ total across 60 TLDs)
const TLD_COUNTS: Record<string, number> = {
    br: 7115008,
    in: 4768976,
    id: 3597354,
    ru: 2832625,
    fr: 2235594,
    it: 2170512,
    mx: 1371087,
    ar: 1359940,
    es: 1239997,
    de: 1237940,
    uk: 1232251,
    vn: 1229684,
    tr: 1228976,
    pe: 856994,
    pl: 826164,
    cl: 814947,
    eg: 791284,
    sa: 737818,
    th: 736507,
    pk: 720381,
    us: 607195,
}

// Population in millions for per-capita
const POPULATION_M: Record<string, number> = {
    br: 216, in: 1441, id: 277, ru: 144, fr: 68, it: 59,
    mx: 129, ar: 46, es: 47, de: 84, uk: 68, vn: 98,
    tr: 85, pe: 34, pl: 38, cl: 19, eg: 105, sa: 36,
    th: 72, pk: 231, us: 335,
}

const COUNTRY_NAME: Record<string, string> = {
    br: "Brazil", in: "India", id: "Indonesia", ru: "Russia",
    fr: "France", it: "Italy", mx: "Mexico", ar: "Argentina",
    es: "Spain", de: "Germany", uk: "United Kingdom", vn: "Vietnam",
    tr: "Turkey", pe: "Peru", pl: "Poland", cl: "Chile",
    eg: "Egypt", sa: "Saudi Arabia", th: "Thailand", pk: "Pakistan",
    us: "United States",
}

function fmt(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
    return n.toLocaleString()
}

function tldColor(tld: string | undefined, maxCount: number): string {
    if (!tld) return "#27272a"
    const count = TLD_COUNTS[tld] ?? 0
    if (!count) return "#27272a"
    const t = maxCount > 1 ? Math.log(count) / Math.log(maxCount) : 1
    const stops: [number, number, number, number][] = [
        [0, 0x1e, 0x40, 0xaf],
        [0.5, 0xd9, 0x77, 0x06],
        [1, 0xef, 0x44, 0x44],
    ]
    let i = 0
    while (i < stops.length - 2 && t > stops[i + 1][0]) i++
    const [t0, r0, g0, b0] = stops[i]
    const [t1, r1, g1, b1] = stops[i + 1]
    const s = (t - t0) / (t1 - t0)
    const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
    return `#${clamp(r0 + s * (r1 - r0)).toString(16).padStart(2, "0")}${clamp(g0 + s * (g1 - g0)).toString(16).padStart(2, "0")}${clamp(b0 + s * (b1 - b0)).toString(16).padStart(2, "0")}`
}

type Tab = "map" | "count" | "percapita"

export function GolliathCountryMap() {
    const [activeTab, setActiveTab] = useState<Tab>("map")
    const [tooltip, setTooltip] = useState<{ x: number; y: number; tld: string; count: number } | null>(null)

    const maxCount = Math.max(...Object.values(TLD_COUNTS))

    const byCount = Object.entries(TLD_COUNTS)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)

    const byPerCapita = Object.entries(TLD_COUNTS)
        .filter(([tld]) => POPULATION_M[tld])
        .map(([tld, count]) => ({ tld, perMillion: count / POPULATION_M[tld] }))
        .sort((a, b) => b.perMillion - a.perMillion)
        .slice(0, 20)

    const maxPerCapita = byPerCapita[0]?.perMillion ?? 1

    return (
        <div className="w-full max-w-4xl mx-auto my-8">
            <Card className="border-border/50 shadow-lg bg-background/50 backdrop-blur">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Credential Density by Country
                    </CardTitle>
                    <CardDescription>
                        315M+ credentials across 60 TLDs. Country-level aggregation via ccTLD mapping.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2 border-b border-border/30 pb-0">
                        {(["map", "count", "percapita"] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 px-3 text-sm font-mono border-b-2 transition-colors ${activeTab === tab ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                            >
                                {tab === "map" ? "World Map" : tab === "count" ? "By Volume" : "Per Capita"}
                            </button>
                        ))}
                    </div>

                    {activeTab === "map" && (
                        <div className="relative">
                            <ComposableMap
                                projectionConfig={{ scale: 140, center: [10, 10] }}
                                style={{ width: "100%", height: "auto" }}
                            >
                                <Geographies geography={GEO_URL}>
                                    {({ geographies }: { geographies: any[] }) =>
                                        geographies.map((geo) => {
                                            const numericId = Number(geo.id)
                                            const tld = NUMERIC_TO_TLD[numericId]
                                            const fill = tldColor(tld, maxCount)
                                            const count = tld ? (TLD_COUNTS[tld] ?? 0) : 0
                                            return (
                                                <Geography
                                                    key={geo.rsmKey}
                                                    geography={geo}
                                                    fill={fill}
                                                    stroke="#18181b"
                                                    strokeWidth={0.4}
                                                    style={{
                                                        default: { outline: "none" },
                                                        hover: { outline: "none", opacity: count ? 0.8 : 1, cursor: count ? "pointer" : "default" },
                                                        pressed: { outline: "none" },
                                                    }}
                                                    onMouseEnter={(e: React.MouseEvent) => {
                                                        if (!count || !tld) return
                                                        setTooltip({ x: e.clientX, y: e.clientY, tld, count })
                                                    }}
                                                    onMouseMove={(e: React.MouseEvent) => {
                                                        if (tooltip) setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)
                                                    }}
                                                    onMouseLeave={() => setTooltip(null)}
                                                />
                                            )
                                        })
                                    }
                                </Geographies>
                            </ComposableMap>

                            {tooltip && (
                                <div
                                    className="fixed z-50 pointer-events-none px-3 py-2 bg-background border border-border shadow-xl rounded text-xs font-mono"
                                    style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
                                >
                                    <div className="font-semibold">{COUNTRY_NAME[tooltip.tld] ?? tooltip.tld.toUpperCase()}</div>
                                    <div className="text-muted-foreground mt-0.5">.{tooltip.tld} - {fmt(tooltip.count)} credentials</div>
                                </div>
                            )}

                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs font-mono text-muted-foreground">0</span>
                                <div className="flex-1 h-2 rounded" style={{ background: "linear-gradient(to right, #27272a 0%, #1e40af 8%, #d97706 55%, #ef4444 100%)" }} />
                                <span className="text-xs font-mono text-muted-foreground">{fmt(maxCount)}</span>
                                <span className="text-xs font-mono text-muted-foreground/50">(log scale, ccTLD only)</span>
                            </div>
                        </div>
                    )}

                    {activeTab === "count" && (
                        <div className="space-y-1.5">
                            {byCount.map(([tld, count], i) => (
                                <div key={tld} className="flex items-center gap-3">
                                    <span className="text-xs font-mono text-muted-foreground w-5 tabular-nums shrink-0">{i + 1}</span>
                                    <span className="text-xs font-mono w-6 shrink-0">.{tld}</span>
                                    <span className="text-xs text-muted-foreground w-28 shrink-0 truncate">{COUNTRY_NAME[tld] ?? tld.toUpperCase()}</span>
                                    <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary/60 rounded-full"
                                            style={{ width: `${(count / maxCount) * 100}%` }}
                                        />
                                    </div>
                                    <Badge variant="outline" className="text-xs font-mono w-16 text-right justify-end shrink-0">{fmt(count)}</Badge>
                                </div>
                            ))}
                            <div className="text-xs text-muted-foreground pt-2 italic">.com (148M) excluded as generic TLD.</div>
                        </div>
                    )}

                    {activeTab === "percapita" && (
                        <div className="space-y-1.5">
                            {byPerCapita.map(({ tld, perMillion }, i) => (
                                <div key={tld} className="flex items-center gap-3">
                                    <span className="text-xs font-mono text-muted-foreground w-5 tabular-nums shrink-0">{i + 1}</span>
                                    <span className="text-xs font-mono w-6 shrink-0">.{tld}</span>
                                    <span className="text-xs text-muted-foreground w-28 shrink-0 truncate">{COUNTRY_NAME[tld] ?? tld.toUpperCase()}</span>
                                    <div className="flex-1 h-1.5 bg-muted/40 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary/60 rounded-full"
                                            style={{ width: `${(perMillion / maxPerCapita) * 100}%` }}
                                        />
                                    </div>
                                    <Badge variant="outline" className="text-xs font-mono w-20 text-right justify-end shrink-0">{fmt(Math.round(perMillion))}/M</Badge>
                                </div>
                            ))}
                            <div className="text-xs text-muted-foreground pt-2 italic">Per million people, countries with pop. over 1M.</div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
