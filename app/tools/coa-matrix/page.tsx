import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CoaMatrixTool } from "@/components/tools/coa-matrix-tool"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "Courses of Action Matrix | 0xHabib",
  description:
    "Build a Courses of Action Matrix: the seven Ds (Discover, Detect, Deny, Disrupt, Degrade, Deceive, Destroy) against the kill chain, with per-cell notes and coverage coloring. Export as SVG, PNG, or JPEG.",
  openGraph: {
    title: "Courses of Action Matrix | 0xHabib",
    description:
      "Build a Courses of Action Matrix: the seven Ds against the kill chain, with per-cell notes and coverage coloring. Export as SVG, PNG, or JPEG.",
    url: getCanonicalUrl("/tools/coa-matrix"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Courses of Action Matrix | 0xHabib",
    description:
      "Build a Courses of Action Matrix: the seven Ds against the kill chain, with per-cell notes and coverage coloring. Export as SVG, PNG, or JPEG.",
  },
}

export default function CoaMatrixPage() {
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
        <h1 className="text-4xl font-bold font-mono mb-4">Courses of Action Matrix</h1>
        <p className="text-muted-foreground text-lg">
          The seven Ds (Discover, Detect, Deny, Disrupt, Degrade, Deceive, Destroy) against the seven kill chain
          phases. Seeded with a worked C2-domain example: click a cell to describe your own control and paint it for
          coverage status, then export to SVG, PNG, or JPEG. Everything runs locally in your browser, nothing is
          uploaded.
        </p>
      </div>

      <CoaMatrixTool />
    </div>
  )
}
