import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AttackMatrix } from "@/components/tools/attack-matrix"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "MITRE ATT&CK Matrix | 0xHabib",
  description:
    "Interactive MITRE ATT&CK Enterprise matrix. Color and annotate techniques to map adversary behavior, then export as SVG, PNG, or JPEG.",
  openGraph: {
    title: "MITRE ATT&CK Matrix | 0xHabib",
    description:
      "Interactive MITRE ATT&CK Enterprise matrix. Color and annotate techniques to map adversary behavior, then export as SVG, PNG, or JPEG.",
    url: getCanonicalUrl("/tools/attack-matrix"),
  },
  twitter: {
    card: "summary_large_image",
    title: "MITRE ATT&CK Matrix | 0xHabib",
    description:
      "Interactive MITRE ATT&CK Enterprise matrix. Color and annotate techniques to map adversary behavior, then export as SVG, PNG, or JPEG.",
  },
}

export default function AttackMatrixPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-emerald-500 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Tools
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold font-mono mb-4">MITRE ATT&CK Matrix</h1>
        <p className="text-muted-foreground text-lg">
          The full Enterprise ATT&CK matrix, sourced from MITRE&apos;s official STIX data. Click cells to color and
          annotate techniques for an actor, campaign, or detection gap analysis, then export to SVG, PNG, or JPEG.
          Everything runs locally in your browser, nothing is uploaded.
        </p>
      </div>

      <AttackMatrix />
    </div>
  )
}
