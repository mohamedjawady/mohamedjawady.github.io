import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdmiraltyCodeTool } from "@/components/tools/admiralty-code-tool"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "Admiralty Code Tool | 0xHabib",
  description:
    "Grade source reliability (A-F) and information credibility (1-6) with the NATO Admiralty System, with notes per rating. Export as SVG, PNG, or JPEG.",
  openGraph: {
    title: "Admiralty Code Tool | 0xHabib",
    description:
      "Grade source reliability (A-F) and information credibility (1-6) with the NATO Admiralty System, with notes per rating. Export as SVG, PNG, or JPEG.",
    url: getCanonicalUrl("/tools/admiralty-code"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Admiralty Code Tool | 0xHabib",
    description:
      "Grade source reliability (A-F) and information credibility (1-6) with the NATO Admiralty System, with notes per rating. Export as SVG, PNG, or JPEG.",
  },
}

export default function AdmiraltyCodePage() {
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
        <h1 className="text-4xl font-bold font-mono mb-4">Admiralty Code Tool</h1>
        <p className="text-muted-foreground text-lg">
          The NATO Admiralty System (STANAG 2511) for grading raw intelligence: source reliability (A-F) against
          information credibility (1-6). Click a cell to select a rating, record why, and export to SVG, PNG, or
          JPEG. Everything runs locally in your browser, nothing is uploaded.
        </p>
      </div>

      <AdmiraltyCodeTool />
    </div>
  )
}
