import { Metadata } from "next"
import { getTools, getToolsByCategory } from "@/lib/tools"
import { ToolCard } from "@/components/tool-card"
import { getCanonicalUrl } from "@/lib/url"
import { SectionHero } from "@/components/section-hero"

export const metadata: Metadata = {
  title: "Tools | Mohamed Habib Jaouadi",
  description: "Interactive tools for SOC and CTI analysts: kill chains, structured models, decision cycles, risk diagrams, and scoring matrices.",
  openGraph: {
    title: "Tools | Mohamed Habib Jaouadi",
    description: "Interactive tools for SOC and CTI analysts: kill chains, structured models, decision cycles, risk diagrams, and scoring matrices.",
    url: getCanonicalUrl("/tools"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Tools | Mohamed Habib Jaouadi",
    description: "Interactive tools for SOC and CTI analysts: kill chains, structured models, decision cycles, risk diagrams, and scoring matrices.",
  },
}

export default function ToolsPage() {
  const tools = getTools()
  const groups = getToolsByCategory()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SectionHero
        eyebrow="Build & export"
        title="Tools"
        description="Browser-based tools for SOC and CTI analysts to build and export intrusion, risk, and intelligence-grading diagrams."
        stats={[{ label: `${tools.length} tool${tools.length === 1 ? "" : "s"}` }]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
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
    </div>
  )
}
