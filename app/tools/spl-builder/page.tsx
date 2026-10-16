import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SplPipelineBuilder } from "@/components/tools/spl-pipeline-builder"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "Splunk SPL Builder | 0xHabib",
  description:
    "Build a real, combinable SPL pipeline against sample security log data, in a Splunk-style search console. Chain field selection, stats, transforming commands, eval, and geospatial commands, and see the actual output at every stage.",
  openGraph: {
    title: "Splunk SPL Builder | 0xHabib",
    description:
      "Build a real, combinable SPL pipeline against sample security log data, in a Splunk-style search console. Chain field selection, stats, transforming commands, eval, and geospatial commands, and see the actual output at every stage.",
    url: getCanonicalUrl("/tools/spl-builder"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Splunk SPL Builder | 0xHabib",
    description:
      "Build a real, combinable SPL pipeline against sample security log data, in a Splunk-style search console. Chain field selection, stats, transforming commands, eval, and geospatial commands, and see the actual output at every stage.",
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
          Pick a dataset, add search filters, and chain as many commands together as you want, fields, stats,
          chart, eval, iplocation, and more. Every stage is a real transform over the previous one's output, so the
          generated SPL and the results table are always consistent with each other. Everything runs locally in
          your browser; nothing is uploaded, and no Splunk instance is required.
        </p>
      </div>

      <SplPipelineBuilder />
    </div>
  )
}
