import { Metadata } from "next"
import { Wrench } from "lucide-react"
import { getTools, getToolsByCategory } from "@/lib/tools"
import { ToolCard } from "@/components/tool-card"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "Tools | 0xHabib",
  description: "Interactive tools for cyber threat intelligence analysts: kill chains, structured models, decision cycles, risk diagrams, and scoring matrices.",
  openGraph: {
    title: "Tools | 0xHabib",
    description: "Interactive tools for cyber threat intelligence analysts: kill chains, structured models, decision cycles, risk diagrams, and scoring matrices.",
    url: getCanonicalUrl("/tools"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Tools | 0xHabib",
    description: "Interactive tools for cyber threat intelligence analysts: kill chains, structured models, decision cycles, risk diagrams, and scoring matrices.",
  },
}

export default function ToolsPage() {
  const tools = getTools()
  const groups = getToolsByCategory()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-mono mb-4">Tools</h1>
        <p className="text-muted-foreground text-lg">
          Browser-based tools for CTI analysts to build and export intrusion, risk, and intelligence-grading diagrams.
        </p>
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Wrench className="w-4 h-4" />
          <span>{tools.length} tool{tools.length === 1 ? "" : "s"}</span>
        </div>
      </div>

      <div className="space-y-12">
        {groups.map((group) => (
          <div key={group.category}>
            <h2 className="text-xl font-bold font-mono mb-4">{group.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
