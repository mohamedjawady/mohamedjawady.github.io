import { getAllVisualizations, getVisualizationsByCategory, getAllTags } from "@/lib/visualizations"
import { VisualizationCard } from "@/components/visualization-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Code } from "lucide-react"
import { getCanonicalUrl } from "@/lib/url"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Visualizations | 0xHabib",
  description: "Interactive visualizations and animations for cryptography, algorithms, and cybersecurity concepts.",
  openGraph: {
    title: "Visualizations | 0xHabib",
    description: "Interactive visualizations and animations for cryptography, algorithms, and cybersecurity concepts.",
    url: getCanonicalUrl("/visualizations"),
    images: [
      {
        url: `${getCanonicalUrl('/api/og/visualization')}?title=Interactive Visualizations&description=Explore cryptography, algorithms, and cybersecurity through interactive animations&category=Collection&relatedPost=&author=0xHabib&tags=interactive,education,cryptography`,
        width: 1200,
        height: 630,
        alt: "Visualizations - 0xHabib",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visualizations | 0xHabib",
    description: "Interactive visualizations and animations for cryptography, algorithms, and cybersecurity concepts.",
    images: [`${getCanonicalUrl('')}/api/og/visualization?title=Interactive Visualizations&description=Explore cryptography, algorithms, and cybersecurity through interactive animations&category=Collection&relatedPost=&author=0xHabib&tags=interactive,education,cryptography`],
  },
}

export default async function VisualizationsPage() {
  const visualizations = await getAllVisualizations()
  const categorizedVisualizations = getVisualizationsByCategory(visualizations)
  const allTags = getAllTags(visualizations)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-mono mb-4">Visualizations</h1>
        <p className="text-muted-foreground text-lg">
          Interactive visualizations and animations to explore cryptography, algorithms, and cybersecurity concepts
        </p>
        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
          <Code className="w-4 h-4" />
          <span>{visualizations.length} interactive visualizations</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search visualizations..." className="pl-10" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-green-500/20">
            All
          </Badge>
          {allTags.map((tag) => (
            <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-green-500/20">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Visualizations by Category */}
      {Object.entries(categorizedVisualizations).map(([category, vizs]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold font-mono mb-6 text-green-400">
            {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vizs.map((viz) => (
              <VisualizationCard key={viz.id} visualization={viz} />
            ))}
          </div>
        </div>
      ))}

      {visualizations.length === 0 && (
        <div className="text-center py-12">
          <Code className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No visualizations yet</h3>
          <p className="text-muted-foreground">
            Interactive visualizations will appear here as they are created.
          </p>
        </div>
      )}
    </div>
  )
}