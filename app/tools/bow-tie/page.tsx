import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CtiDiagramBuilder } from "@/components/tools/cti-diagram-builder"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "Bow-Tie Risk Diagram Builder | 0xHabib",
  description:
    "Build bow-tie risk diagrams: threat causes and their preventive barriers on the left, a central top event, consequences and their mitigative barriers on the right. Export as SVG, PNG, or JPEG.",
  openGraph: {
    title: "Bow-Tie Risk Diagram Builder | 0xHabib",
    description:
      "Build bow-tie risk diagrams: threat causes and their preventive barriers on the left, a central top event, consequences and their mitigative barriers on the right. Export as SVG, PNG, or JPEG.",
    url: getCanonicalUrl("/tools/bow-tie"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Bow-Tie Risk Diagram Builder | 0xHabib",
    description:
      "Build bow-tie risk diagrams: threat causes and their preventive barriers on the left, a central top event, consequences and their mitigative barriers on the right. Export as SVG, PNG, or JPEG.",
  },
}

export default function BowTiePage() {
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
        <h1 className="text-4xl font-bold font-mono mb-4">Bow-Tie Risk Diagram Builder</h1>
        <p className="text-muted-foreground text-lg">
          Threat causes and their preventive barriers on the left, a central top event, consequences and their
          mitigative barriers on the right. Seeded with a ransomware example. Edit labels and barriers, and export
          to SVG, PNG, or JPEG. Everything runs locally in your browser, nothing is uploaded.
        </p>
      </div>

      <CtiDiagramBuilder initialMode="bow-tie" />
    </div>
  )
}
