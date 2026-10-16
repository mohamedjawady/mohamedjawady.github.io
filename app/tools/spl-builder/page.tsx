import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SplBuilder } from "@/components/tools/spl-builder"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "Splunk SPL Builder | 0xHabib",
  description:
    "Pick an SPL command and a variant to see a generated search example, the shape of the index data it expects, and the output table it produces.",
  openGraph: {
    title: "Splunk SPL Builder | 0xHabib",
    description:
      "Pick an SPL command and a variant to see a generated search example, the shape of the index data it expects, and the output table it produces.",
    url: getCanonicalUrl("/tools/spl-builder"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Splunk SPL Builder | 0xHabib",
    description:
      "Pick an SPL command and a variant to see a generated search example, the shape of the index data it expects, and the output table it produces.",
  },
}

export default function SplBuilderPage() {
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
        <h1 className="text-4xl font-bold font-mono mb-4">Splunk SPL Builder</h1>
        <p className="text-muted-foreground text-lg">
          Pick a search command on the left, then a variant. Each combination generates a real SPL example, the
          shape of the index data it's built to run against, and the output table that command produces. Everything
          runs locally in your browser; nothing is uploaded, and no Splunk instance is required.
        </p>
      </div>

      <SplBuilder />
    </div>
  )
}
