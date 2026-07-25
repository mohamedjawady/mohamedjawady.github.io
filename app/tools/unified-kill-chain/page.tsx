import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CtiDiagramBuilder } from "@/components/tools/cti-diagram-builder"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "Unified Kill Chain Builder | 0xHabib",
  description:
    "Build Paul Pols' 18-phase Unified Kill Chain, grouped into In (Initial Foothold), Through (Network Propagation), and Out (Action on Objectives). Export as SVG, PNG, or JPEG.",
  openGraph: {
    title: "Unified Kill Chain Builder | 0xHabib",
    description:
      "Build Paul Pols' 18-phase Unified Kill Chain, grouped into In (Initial Foothold), Through (Network Propagation), and Out (Action on Objectives). Export as SVG, PNG, or JPEG.",
    url: getCanonicalUrl("/tools/unified-kill-chain"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Unified Kill Chain Builder | 0xHabib",
    description:
      "Build Paul Pols' 18-phase Unified Kill Chain, grouped into In (Initial Foothold), Through (Network Propagation), and Out (Action on Objectives). Export as SVG, PNG, or JPEG.",
  },
}

export default function UnifiedKillChainPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-emerald-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tools
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold font-mono mb-4">Unified Kill Chain Builder</h1>
        <p className="text-muted-foreground text-lg">
          Paul Pols&apos; 18-phase merge of the Cyber Kill Chain, MITRE ATT&amp;CK, and the Diamond Model, grouped
          into In, Through, and Out. Edit phases, connect them, and export to SVG, PNG, or JPEG. Everything runs
          locally in your browser, nothing is uploaded.
        </p>
      </div>

      <CtiDiagramBuilder initialMode="unified-kill-chain" />
    </div>
  )
}
