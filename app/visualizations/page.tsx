import { getVisibleVisualizations, getAllTags } from "@/lib/visualizations"
import { VisualizationsFilter } from "@/components/visualizations-filter"
import { Code } from "lucide-react"
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
        url: `${getCanonicalUrl('/api/og/visualization')}?title=Interactive Visualizations&description=Explore cryptography, algorithms, and cybersecurity through interactive animations&relatedPost=&author=0xHabib&tags=interactive,education,cryptography`,
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
    images: [`${getCanonicalUrl('/api/og/visualization')}?title=Interactive Visualizations&description=Explore cryptography, algorithms, and cybersecurity through interactive animations&relatedPost=&author=0xHabib&tags=interactive,education,cryptography`],
  },
}

export default async function VisualizationsPage() {
  const visualizations = await getVisibleVisualizations()
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

      <VisualizationsFilter visualizations={visualizations} allTags={allTags} />
    </div>
  )
}