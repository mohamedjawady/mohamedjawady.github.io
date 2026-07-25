import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CtiDiagramBuilder } from "@/components/tools/cti-diagram-builder"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "Attack Tree Builder | 0xHabib",
  description:
    "Build Schneier-style attack trees with AND/OR gates from a root goal down to concrete leaf attacks, with automatic tree layout. Export as SVG, PNG, or JPEG.",
  openGraph: {
    title: "Attack Tree Builder | 0xHabib",
    description:
      "Build Schneier-style attack trees with AND/OR gates from a root goal down to concrete leaf attacks, with automatic tree layout. Export as SVG, PNG, or JPEG.",
    url: getCanonicalUrl("/tools/attack-tree"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Attack Tree Builder | 0xHabib",
    description:
      "Build Schneier-style attack trees with AND/OR gates from a root goal down to concrete leaf attacks, with automatic tree layout. Export as SVG, PNG, or JPEG.",
  },
}

export default function AttackTreePage() {
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
        <h1 className="text-4xl font-bold font-mono mb-4">Attack Tree Builder</h1>
        <p className="text-muted-foreground text-lg">
          Break an attacker&apos;s goal down into AND/OR sub-goals and concrete leaf attacks. Set gates per node, use
          Auto Layout to tidy the tree after editing, and export to SVG, PNG, or JPEG. Everything runs locally in
          your browser, nothing is uploaded.
        </p>
      </div>

      <CtiDiagramBuilder initialMode="attack-tree" />
    </div>
  )
}
