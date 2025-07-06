import { getVisualizationById } from "@/lib/visualizations"
import { notFound } from "next/navigation"
import { HillCipher } from "@/components/visualizations/hill-cipher"
import { getCanonicalUrl } from "@/lib/url"
import { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"

interface VisualizationPageProps {
  params: {
    id: string
  }
}

// Component mapping - maps the component field from frontmatter to actual components
const visualizationComponents = {
  'hill-cipher': HillCipher,
  // Add more components here as they are created
}

export async function generateMetadata({ params }: VisualizationPageProps): Promise<Metadata> {
  const visualization = await getVisualizationById(params.id)
  
  if (!visualization) {
    return {
      title: "Visualization Not Found | 0xHabib",
    }
  }

  return {
    title: `${visualization.title} | 0xHabib`,
    description: visualization.description,
    openGraph: {
      title: `${visualization.title} | 0xHabib`,
      description: visualization.description,
      url: getCanonicalUrl(`/visualizations/${params.id}`),
      images: [
        {
          url: `${getCanonicalUrl('/api/og/visualization')}?title=${encodeURIComponent(visualization.title)}&description=${encodeURIComponent(visualization.description)}&author=${encodeURIComponent(visualization.author)}&category=${encodeURIComponent(visualization.category)}&relatedPost=${encodeURIComponent(visualization.relatedPost || '')}&tags=${encodeURIComponent(visualization.tags.join(','))}`,
          width: 1200,
          height: 630,
          alt: `${visualization.title} - 0xHabib`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${visualization.title} | 0xHabib`,
      description: visualization.description,
      images: [`${getCanonicalUrl('')}/api/og/visualization?title=${encodeURIComponent(visualization.title)}&description=${encodeURIComponent(visualization.description)}&author=${encodeURIComponent(visualization.author)}&category=${encodeURIComponent(visualization.category)}&relatedPost=${encodeURIComponent(visualization.relatedPost || '')}&tags=${encodeURIComponent(visualization.tags.join(','))}`],
    },
  }
}

export default async function VisualizationPage({ params }: VisualizationPageProps) {
  const visualization = await getVisualizationById(params.id)

  if (!visualization) {
    notFound()
  }

  const VisualizationComponent = visualizationComponents[visualization.component as keyof typeof visualizationComponents]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Visualization Content from Markdown */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        <MDXRemote source={visualization.content} />
      </div>

      {/* Interactive Component */}
      {VisualizationComponent ? (
        <div className="mt-12">
          <VisualizationComponent />
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Interactive Component Coming Soon</h2>
          <p className="text-muted-foreground">
            The interactive visualization for "{visualization.title}" is currently under development.
          </p>
        </div>
      )}
    </div>
  )
}