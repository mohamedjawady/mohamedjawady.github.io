import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CtiDiagramBuilder } from "@/components/tools/cti-diagram-builder"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "Cyber Kill Chain Builder | 0xHabib",
  description:
    "Build and export Lockheed Martin's 7-phase Cyber Kill Chain, from Reconnaissance to Actions on Objectives, as SVG, PNG, or JPEG.",
  openGraph: {
    title: "Cyber Kill Chain Builder | 0xHabib",
    description:
      "Build and export Lockheed Martin's 7-phase Cyber Kill Chain, from Reconnaissance to Actions on Objectives, as SVG, PNG, or JPEG.",
    url: getCanonicalUrl("/tools/kill-chain"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber Kill Chain Builder | 0xHabib",
    description:
      "Build and export Lockheed Martin's 7-phase Cyber Kill Chain, from Reconnaissance to Actions on Objectives, as SVG, PNG, or JPEG.",
  },
}

export default function KillChainPage() {
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
        <h1 className="text-4xl font-bold font-mono mb-4">Cyber Kill Chain Builder</h1>
        <p className="text-muted-foreground text-lg">
          Lockheed Martin&apos;s 7-phase intrusion model: Reconnaissance, Weaponization, Delivery, Exploitation,
          Installation, Command &amp; Control, and Actions on Objectives. Edit phases, connect them, and export to
          SVG, PNG, or JPEG. Everything runs locally in your browser, nothing is uploaded.
        </p>
      </div>

      <CtiDiagramBuilder initialMode="kill-chain" />
    </div>
  )
}
