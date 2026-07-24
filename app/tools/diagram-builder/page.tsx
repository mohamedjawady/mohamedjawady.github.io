import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CtiDiagramBuilder } from "@/components/tools/cti-diagram-builder"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "CTI Diagram Builder | 0xHabib",
  description:
    "Build Cyber Kill Chain, Diamond Model, Unified Kill Chain, or hybrid intrusion analysis diagrams and export them as SVG, PNG, or JPEG.",
  openGraph: {
    title: "CTI Diagram Builder | 0xHabib",
    description:
      "Build Cyber Kill Chain, Diamond Model, Unified Kill Chain, or hybrid intrusion analysis diagrams and export them as SVG, PNG, or JPEG.",
    url: getCanonicalUrl("/tools/diagram-builder"),
  },
  twitter: {
    card: "summary_large_image",
    title: "CTI Diagram Builder | 0xHabib",
    description:
      "Build Cyber Kill Chain, Diamond Model, Unified Kill Chain, or hybrid intrusion analysis diagrams and export them as SVG, PNG, or JPEG.",
  },
}

export default function DiagramBuilderPage() {
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
        <h1 className="text-4xl font-bold font-mono mb-4">CTI Diagram Builder</h1>
        <p className="text-muted-foreground text-lg">
          Build Kill Chain, Diamond Model, Unified Kill Chain, or hybrid intrusion analysis diagrams. Drag nodes,
          connect them, edit labels, and export to SVG, PNG, or JPEG. Everything runs locally in your browser,
          nothing is uploaded.
        </p>
      </div>

      <CtiDiagramBuilder />
    </div>
  )
}
