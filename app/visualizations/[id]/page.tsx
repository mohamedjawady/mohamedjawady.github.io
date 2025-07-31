import { getVisualizationById, getVisibleVisualizations } from "@/lib/visualizations"
import { notFound } from "next/navigation"
import { HillCipher } from "@/components/visualizations/hill-cipher"
import { WindowsAPIFlow } from "@/components/visualizations/windows-api-flow"
import { LagrangeInterpolation } from "@/components/visualizations/lagrange-interpolation"
import { LawOfLargeNumbers } from "@/components/visualizations/law-of-large-numbers"
import { MemoryManagement } from "@/components/visualizations/memory-management"
import { MalwareDetectionMechanisms } from "@/components/visualizations/malware-detection-mechanisms"
import { DNSResolution } from "@/components/visualizations/dns-resolution"
import { getCanonicalUrl } from "@/lib/url"
import { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import { Badge } from "@/components/ui/badge"
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'

interface VisualizationPageProps {
  params: Promise<{
    id: string
  }>
}

// Component mapping - maps the component field from frontmatter to actual components
const visualizationComponents = {
  'hill-cipher': HillCipher,
  'WindowsAPIFlow': WindowsAPIFlow,
  'LagrangeInterpolation': LagrangeInterpolation,
  'LawOfLargeNumbers': LawOfLargeNumbers,
  'MemoryManagement': MemoryManagement,
  'MalwareDetectionMechanisms': MalwareDetectionMechanisms,
  'DNSResolution': DNSResolution,
  // Add more components here as they are created
}

export async function generateStaticParams() {
  const visualizations = await getVisibleVisualizations()
  return visualizations.map((viz) => ({
    id: viz.id,
  }))
}

export async function generateMetadata({ params }: VisualizationPageProps): Promise<Metadata> {
  const { id } = await params
  const visualization = await getVisualizationById(id)
  
  if (!visualization || visualization.visibility === 'private') {
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
      url: getCanonicalUrl(`/visualizations/${id}`),
      images: [
        {
          url: `${getCanonicalUrl('/api/og/visualization')}?title=${encodeURIComponent(visualization.title)}&description=${encodeURIComponent(visualization.description)}&author=${encodeURIComponent(visualization.author)}&relatedPost=${encodeURIComponent(visualization.relatedPost || '')}&tags=${encodeURIComponent(visualization.tags.join(','))}`,
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
      images: [`${getCanonicalUrl('/api/og/visualization')}?title=${encodeURIComponent(visualization.title)}&description=${encodeURIComponent(visualization.description)}&author=${encodeURIComponent(visualization.author)}&relatedPost=${encodeURIComponent(visualization.relatedPost || '')}&tags=${encodeURIComponent(visualization.tags.join(','))}`],
    },
  }
}

export default async function VisualizationPage({ params }: VisualizationPageProps) {
  const { id } = await params
  const visualization = await getVisualizationById(id)

  if (!visualization || visualization.visibility === 'private') {
    notFound()
  }

  const VisualizationComponent = visualizationComponents[visualization.component as keyof typeof visualizationComponents]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Visualization Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{visualization.title}</h1>
        <p className="text-lg text-muted-foreground mb-6">{visualization.description}</p>
      </div>

      {/* Visualization Header with Metadata */}
      <div className="mb-8 pb-6 border-b border-border/50">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
          <span>By {visualization.author}</span>
          <span>•</span>
          <span>{new Date(visualization.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
          {visualization.relatedPost && (
            <>
              <span>•</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                Post Related
              </Badge>
            </>
          )}
        </div>
        
        {/* Tags */}
        {visualization.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visualization.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Visualization Content from Markdown */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        <MDXRemote 
          source={visualization.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkMath, remarkGfm],
              rehypePlugins: [rehypeKatex],
            },
          }}
        />
      </div>

      {/* Interactive Component */}
      {visualization.visibility === 'draft' ? (
        /* Draft Visualization Placeholder */
        <div className="text-center py-20 border-2 border-dashed border-amber-300 dark:border-amber-600 rounded-lg bg-amber-50 dark:bg-amber-950/20">
          <h2 className="text-2xl font-semibold mb-4 text-amber-800 dark:text-amber-300">Coming Soon</h2>
          <p className="text-amber-700 dark:text-amber-400 max-w-md mx-auto">
            The interactive visualization for "{visualization.title}" is currently under development. 
            Check back soon for the full interactive experience!
          </p>
        </div>
      ) : VisualizationComponent ? (
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