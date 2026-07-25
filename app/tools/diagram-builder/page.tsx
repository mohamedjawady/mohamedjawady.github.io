import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { CtiDiagramBuilder } from "@/components/tools/cti-diagram-builder"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "Free-Form Diagram Canvas | 0xHabib",
  description:
    "A blank, general-purpose canvas that switches between every model, kill chain, diamond model, attack tree, and more, so you can mix and match on one diagram. Export as SVG, PNG, or JPEG.",
  openGraph: {
    title: "Free-Form Diagram Canvas | 0xHabib",
    description:
      "A blank, general-purpose canvas that switches between every model, kill chain, diamond model, attack tree, and more, so you can mix and match on one diagram. Export as SVG, PNG, or JPEG.",
    url: getCanonicalUrl("/tools/diagram-builder"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Free-Form Diagram Canvas | 0xHabib",
    description:
      "A blank, general-purpose canvas that switches between every model, kill chain, diamond model, attack tree, and more, so you can mix and match on one diagram. Export as SVG, PNG, or JPEG.",
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
        <h1 className="text-4xl font-bold font-mono mb-4">Free-Form Diagram Canvas</h1>
        <p className="text-muted-foreground text-lg">
          Looking for a specific model? Kill Chain, Diamond Model, Unified Kill Chain, Attack Tree, OODA Loop,
          F3EAD, and Bow-Tie each have their own dedicated tool. This canvas is for mixing them, switch templates
          mid-session, insert blocks from any model, and combine them on one diagram. Export to SVG, PNG, or JPEG.
          Everything runs locally in your browser, nothing is uploaded.
        </p>
      </div>

      <CtiDiagramBuilder initialMode="blank" allowModeSwitch />
    </div>
  )
}
