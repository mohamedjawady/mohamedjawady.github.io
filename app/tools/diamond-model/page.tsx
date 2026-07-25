import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CtiDiagramBuilder } from "@/components/tools/cti-diagram-builder"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "Diamond Model Builder | 0xHabib",
  description:
    "Build the Diamond Model of Intrusion Analysis: Adversary, Capability, Infrastructure, and Victim, connected by the socio-political and technical axes. Export as SVG, PNG, or JPEG.",
  openGraph: {
    title: "Diamond Model Builder | 0xHabib",
    description:
      "Build the Diamond Model of Intrusion Analysis: Adversary, Capability, Infrastructure, and Victim, connected by the socio-political and technical axes. Export as SVG, PNG, or JPEG.",
    url: getCanonicalUrl("/tools/diamond-model"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Diamond Model Builder | 0xHabib",
    description:
      "Build the Diamond Model of Intrusion Analysis: Adversary, Capability, Infrastructure, and Victim, connected by the socio-political and technical axes. Export as SVG, PNG, or JPEG.",
  },
}

export default function DiamondModelPage() {
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
        <h1 className="text-4xl font-bold font-mono mb-4">Diamond Model Builder</h1>
        <p className="text-muted-foreground text-lg">
          The four core features of an intrusion event: Adversary, Capability, Infrastructure, and Victim, linked by
          the socio-political and technical axes. Edit each feature, add meta-data, and export to SVG, PNG, or JPEG.
          Everything runs locally in your browser, nothing is uploaded.
        </p>
      </div>

      <CtiDiagramBuilder initialMode="diamond-model" />
    </div>
  )
}
