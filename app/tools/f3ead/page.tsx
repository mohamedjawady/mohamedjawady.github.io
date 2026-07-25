import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CtiDiagramBuilder } from "@/components/tools/cti-diagram-builder"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "F3EAD Cycle Builder | 0xHabib",
  description:
    "Build the F3EAD intelligence-operations fusion cycle: Find, Fix, Finish, Exploit, Analyze, Disseminate. Export as SVG, PNG, or JPEG.",
  openGraph: {
    title: "F3EAD Cycle Builder | 0xHabib",
    description:
      "Build the F3EAD intelligence-operations fusion cycle: Find, Fix, Finish, Exploit, Analyze, Disseminate. Export as SVG, PNG, or JPEG.",
    url: getCanonicalUrl("/tools/f3ead"),
  },
  twitter: {
    card: "summary_large_image",
    title: "F3EAD Cycle Builder | 0xHabib",
    description:
      "Build the F3EAD intelligence-operations fusion cycle: Find, Fix, Finish, Exploit, Analyze, Disseminate. Export as SVG, PNG, or JPEG.",
  },
}

export default function F3eadPage() {
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
        <h1 className="text-4xl font-bold font-mono mb-4">F3EAD Cycle Builder</h1>
        <p className="text-muted-foreground text-lg">
          The Find, Fix, Finish, Exploit, Analyze, Disseminate cycle used to fuse operations and intelligence. Edit
          each phase and export to SVG, PNG, or JPEG. Everything runs locally in your browser, nothing is uploaded.
        </p>
      </div>

      <CtiDiagramBuilder initialMode="f3ead" />
    </div>
  )
}
