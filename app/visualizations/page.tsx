import { getVisibleVisualizations, getAllTags } from "@/lib/visualizations"
import { VisualizationsFilter } from "@/components/visualizations-filter"
import { getCanonicalUrl } from "@/lib/url"
import { Metadata } from "next"
import { SectionHero } from "@/components/section-hero"

export const metadata: Metadata = {
  title: "Visualizations | Mohamed Habib Jaouadi",
  description: "Interactive visualizations and animations for cryptography, algorithms, and cybersecurity concepts.",
  openGraph: {
    title: "Visualizations | Mohamed Habib Jaouadi",
    description: "Interactive visualizations and animations for cryptography, algorithms, and cybersecurity concepts.",
    url: getCanonicalUrl("/visualizations"),
    images: [
      {
        url: getCanonicalUrl('/android-chrome-512x512.png'),
        width: 512,
        height: 512,
        alt: "Visualizations - Mohamed Habib Jaouadi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visualizations | Mohamed Habib Jaouadi",
    description: "Interactive visualizations and animations for cryptography, algorithms, and cybersecurity concepts.",
    images: [getCanonicalUrl('/android-chrome-512x512.png')],
  },
}

export default async function VisualizationsPage() {
  const visualizations = await getVisibleVisualizations()
  const allTags = getAllTags(visualizations)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SectionHero
        eyebrow="See the mechanism"
        title="Visualizations"
        description="Interactive visualizations and animations to explore cryptography, algorithms, and cybersecurity concepts."
        stats={[{ label: `${visualizations.length} interactive visualizations` }]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <VisualizationsFilter visualizations={visualizations} allTags={allTags} />
      </div>
    </div>
  )
}