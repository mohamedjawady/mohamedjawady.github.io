import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CtiDiagramBuilder } from "@/components/tools/cti-diagram-builder"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "OODA Loop Builder | 0xHabib",
  description:
    "Build Boyd's OODA decision cycle: Observe, Orient, Decide, Act. Edit each phase and export as SVG, PNG, or JPEG.",
  openGraph: {
    title: "OODA Loop Builder | 0xHabib",
    description:
      "Build Boyd's OODA decision cycle: Observe, Orient, Decide, Act. Edit each phase and export as SVG, PNG, or JPEG.",
    url: getCanonicalUrl("/tools/ooda-loop"),
  },
  twitter: {
    card: "summary_large_image",
    title: "OODA Loop Builder | 0xHabib",
    description:
      "Build Boyd's OODA decision cycle: Observe, Orient, Decide, Act. Edit each phase and export as SVG, PNG, or JPEG.",
  },
}

export default function OodaLoopPage() {
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
        <h1 className="text-4xl font-bold font-mono mb-4">OODA Loop Builder</h1>
        <p className="text-muted-foreground text-lg">
          John Boyd&apos;s decision cycle: Observe, Orient, Decide, Act, looping continuously. Edit each phase and
          export to SVG, PNG, or JPEG. Everything runs locally in your browser, nothing is uploaded.
        </p>
      </div>

      <CtiDiagramBuilder initialMode="ooda" />
    </div>
  )
}
