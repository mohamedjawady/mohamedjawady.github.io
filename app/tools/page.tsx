import { Metadata } from "next"
import { Wrench } from "lucide-react"
import { getTools } from "@/lib/tools"
import { ToolCard } from "@/components/tool-card"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "Tools | 0xHabib",
  description: "Interactive tools for cyber threat intelligence analysts, including a Kill Chain and Diamond Model diagram builder.",
  openGraph: {
    title: "Tools | 0xHabib",
    description: "Interactive tools for cyber threat intelligence analysts, including a Kill Chain and Diamond Model diagram builder.",
    url: getCanonicalUrl("/tools"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Tools | 0xHabib",
    description: "Interactive tools for cyber threat intelligence analysts, including a Kill Chain and Diamond Model diagram builder.",
  },
}

export default function ToolsPage() {
  const tools = getTools()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-mono mb-4">Tools</h1>
        <p className="text-muted-foreground text-lg">
          Browser-based tools for CTI analysts to build and export intrusion analysis diagrams.
        </p>
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Wrench className="w-4 h-4" />
          <span>{tools.length} tool{tools.length === 1 ? "" : "s"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  )
}
