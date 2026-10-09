import { getPostBySlug, getAllPosts, getSeriesNavigation, getAllSeries, getPublicAndDraftPosts } from "@/lib/posts"
import { PostSidebar } from "@/components/post-sidebar"
import Image from "next/image"
import { MDXRemote } from "next-mdx-remote/rsc"
import { mdxComponents } from "@/components/mdx-components"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { notFound } from "next/navigation"
import { TableOfContents } from "@/components/table-of-contents"
import { Metadata } from "next"
import { BlogPostStructuredData } from "@/components/structured-data"
import { getCanonicalUrl } from "@/lib/url"
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import "@/styles/highlight-js/github-dark.css"
import { HillCipher } from "@/components/visualizations/hill-cipher"
import { WindowsProtectionHierarchy } from "@/components/visualizations/windows-protection-hierarchy"
import { WindowsAPIFlow } from "@/components/visualizations/windows-api-flow"
import { LawOfLargeNumbers } from "@/components/visualizations/law-of-large-numbers"
import { MemoryManagement } from "@/components/visualizations/memory-management"
import { MalwareDetectionMechanisms } from "@/components/visualizations/malware-detection-mechanisms"
import { DNSResolution } from "@/components/visualizations/dns-resolution"
import { DnsTunnelingFlow } from "@/components/visualizations/dns-tunneling-flow"
import { IdnHomographDetection } from "@/components/visualizations/idn-homograph-detection"
import { EncryptedDnsFlow } from "@/components/visualizations/encrypted-dns-flow"
import { C2JitterAndSleep } from "@/components/visualizations/c2-jitter-and-sleep"
import { ProcessMemoryMap } from "@/components/visualizations/process-memory-map"
import { C2InfrastructureMap } from "@/components/visualizations/c2-infrastructure-map"
import { MalwareC2Lifecycle } from "@/components/visualizations/malware-c2-lifecycle"
import { Win32MessageLoop } from "@/components/visualizations/win32-message-loop"
import { ThreadSynchronization } from "@/components/visualizations/thread-synchronization"
import { PEHeaderViewer } from "@/components/visualizations/pe-header-viewer"
import { ExportTableWalker } from "@/components/visualizations/export-table-walker"
import { ProtectedProcessBypass } from "@/components/visualizations/protected-process-bypass"
import { ChomskySecurityHierarchy } from "@/components/visualizations/chomsky-security-hierarchy"
import { FiniteAutomatonVisualizer } from "@/components/visualizations/finite-automaton-visualizer"
import { PushdownAutomatonVisualizer } from "@/components/visualizations/pushdown-automaton-visualizer"
import { LanguageHierarchyVenn } from "@/components/visualizations/language-hierarchy-venn"
import { StealerParserDemo } from "@/components/visualizations/stealer-parser-demo"
import { PowerShellPlayground } from "@/components/visualizations/powershell-playground"
import { WMIRemoteFlow } from "@/components/visualizations/wmi-remote-flow"
import LOLBASCategories from "@/components/visualizations/lolbas-categories"
import BITSAdminAttackFlow from "@/components/visualizations/bitsadmin-attack-flow"
import { GoDataStructures } from "@/components/visualizations/go-data-structures"
import { GoroutineDebugWalkthrough } from "@/components/visualizations/goroutine-debug-walkthrough"
import { ConcurrencyPatternsCompare } from "@/components/visualizations/concurrency-patterns-compare"
import { GoConcurrencyPrimer } from "@/components/visualizations/go-concurrency-primer"
import { GoEntryPointFlow } from "@/components/visualizations/go-entry-point-flow"
import { PclntabStructureDiagram } from "@/components/visualizations/pclntab-structure-diagram"
import { IntelligenceLifecycle } from "@/components/visualizations/intelligence-lifecycle"
import { PyramidOfPain } from "@/components/visualizations/pyramid-of-pain"
import { TTPCampaignTimeline } from "@/components/visualizations/ttp-campaign-timeline"
import { ACHMatrix } from "@/components/visualizations/ach-matrix"
import { DetectionTypesQuadrant } from "@/components/visualizations/detection-types-quadrant"
import { CollectionCoverageMatrix } from "@/components/visualizations/collection-coverage-matrix"
import { CoAMatrix } from "@/components/visualizations/coa-matrix"
import { ThreatModelExplorer } from "@/components/visualizations/threat-model-explorer"
import { SaltArchitecture } from "@/components/visualizations/salt-architecture"
import { SaltExerciseDiagram } from "@/components/visualizations/salt-exercise-diagram"
import { GolliathArchitecture } from "@/components/visualizations/golliath-architecture"
import { GolliathParserPipeline } from "@/components/visualizations/golliath-parser-pipeline"
import { GolliathGrammarRouter } from "@/components/visualizations/golliath-grammar-router"
import { GolliathBenchmark } from "@/components/visualizations/golliath-benchmark"
import { GolliathCountryMap } from "@/components/visualizations/golliath-country-map"
import { LinuxSystemCallsCheatsheet } from "@/components/cheatsheets/linux-system-calls"
import GdbDebuggingCheatsheet from "@/components/cheatsheets/gdb-debugging"
import { SeriesNavigation } from "@/components/series-navigation"
import { CollapsibleCode } from "@/components/ui/collapsible-code"
import { Term } from "@/components/ui/term"
import { LatestPostsSlider } from "@/components/latest-posts-slider"
import { ReadingProgressBar } from "@/components/visualizations/reading-progress-bar"
import { ScrollReveal } from "@/components/scroll-reveal"

// Component mapping for interactive elements in posts
const postComponents = {
  ...mdxComponents,
  HillCipher: () => <HillCipher />,
  WindowsProtectionHierarchy: () => <WindowsProtectionHierarchy />,
  WindowsAPIFlow: () => <WindowsAPIFlow />,
  LawOfLargeNumbers: () => <LawOfLargeNumbers />,
  MemoryManagement: () => <MemoryManagement />,
  PowerShellPlayground: () => <PowerShellPlayground />,
  WMIRemoteFlow: () => <WMIRemoteFlow />,
  MalwareDetectionMechanisms: () => <MalwareDetectionMechanisms />,
  DNSResolution: () => <DNSResolution />,
  DnsTunnelingFlow: () => <DnsTunnelingFlow />,
  IdnHomographDetection: () => <IdnHomographDetection />,
  EncryptedDnsFlow: () => <EncryptedDnsFlow />,
  C2JitterAndSleep: () => <C2JitterAndSleep />,
  ProcessMemoryMap: () => <ProcessMemoryMap />,
  C2InfrastructureMap: () => <C2InfrastructureMap />,
  MalwareC2Lifecycle: () => <MalwareC2Lifecycle />,
  Win32MessageLoop: () => <Win32MessageLoop />,
  ThreadSynchronization: () => <ThreadSynchronization />,
  PEHeaderViewer: () => <PEHeaderViewer />,
  ExportTableWalker: () => <ExportTableWalker />,
  ProtectedProcessBypass: () => <ProtectedProcessBypass />,
  ChomskySecurityHierarchy: () => <ChomskySecurityHierarchy />,
  FiniteAutomatonVisualizer: () => <FiniteAutomatonVisualizer />,
  PushdownAutomatonVisualizer: () => <PushdownAutomatonVisualizer />,
  LanguageHierarchyVenn: () => <LanguageHierarchyVenn />,
  StealerParserDemo: () => <StealerParserDemo />,
  LOLBASCategories: () => <LOLBASCategories />,
  BITSAdminAttackFlow: () => <BITSAdminAttackFlow />,
  GoDataStructures: () => <GoDataStructures />,
  GoroutineDebugWalkthrough: () => <GoroutineDebugWalkthrough />,
  ConcurrencyPatternsCompare: () => <ConcurrencyPatternsCompare />,
  GoConcurrencyPrimer: () => <GoConcurrencyPrimer />,
  GoEntryPointFlow: () => <GoEntryPointFlow />,
  PclntabStructureDiagram: () => <PclntabStructureDiagram />,
  IntelligenceLifecycle: () => <IntelligenceLifecycle />,
  PyramidOfPain: () => <PyramidOfPain />,
  TTPCampaignTimeline: () => <TTPCampaignTimeline />,
  ACHMatrix: () => <ACHMatrix />,
  DetectionTypesQuadrant: () => <DetectionTypesQuadrant />,
  CollectionCoverageMatrix: () => <CollectionCoverageMatrix />,
  CoAMatrix: () => <CoAMatrix />,
  ThreatModelExplorer: () => <ThreatModelExplorer />,
  SaltArchitecture: () => <SaltArchitecture />,
  SaltExerciseDiagram: () => <SaltExerciseDiagram />,
  GolliathArchitecture: () => <GolliathArchitecture />,
  GolliathParserPipeline: () => <GolliathParserPipeline />,
  GolliathGrammarRouter: () => <GolliathGrammarRouter />,
  GolliathBenchmark: () => <GolliathBenchmark />,
  GolliathCountryMap: () => <GolliathCountryMap />,
  LinuxSystemCallsCheatsheet: () => <LinuxSystemCallsCheatsheet />,
  GdbDebuggingCheatsheet: () => <GdbDebuggingCheatsheet />,
  CollapsibleCode: CollapsibleCode,
  Term: Term,
}

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts
    .filter(post => post.visibility === 'public' || post.visibility === 'draft')
    .map((post) => ({
      slug: post.slug,
    }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post || post.visibility === 'private') {
    return {
      title: 'Post Not Found',
    }
  }

  const ogImageUrl = getCanonicalUrl(post.banner || '/android-chrome-512x512.png')
  const postUrl = getCanonicalUrl(`/posts/${slug}`)

  return {
    title: `${post.title}${post.visibility === 'draft' ? ' [DRAFT]' : ''} | 0xHabib`,
    description: post.visibility === 'draft'
      ? `[DRAFT] ${post.description || 'Work-in-progress post content'}`
      : (post.description || ''),
    keywords: post.tags,
    authors: [{ name: post.author || '0xHabib' }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: postUrl,
      siteName: '0xHabib',
      publishedTime: post.date,
      authors: [post.author || '0xHabib'],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
          type: 'image/png',
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      creator: '@0xhabib',
      images: [ogImageUrl],
    },
    alternates: {
      canonical: postUrl,
    },
    // Additional meta tags for better social sharing
    other: {
      'article:author': post.author || '0xHabib',
      'article:published_time': post.date,
      'article:section': 'Technology',
      'article:tag': post.tags.join(', '),
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post || post.visibility === 'private') {
    notFound()
  }

  // Get series navigation data if post is part of a series
  const seriesNavigation = post.series ? await getSeriesNavigation(post.slug) : null

  // Sidebar data: all series, plus standalone posts that don't belong to one
  const allSeries = await getAllSeries()
  const allPublicPosts = await getPublicAndDraftPosts()
  const otherPosts = allPublicPosts.filter((p) => !p.series)

  const ogImageUrl = getCanonicalUrl(post.banner || '/android-chrome-512x512.png')
  const postUrl = getCanonicalUrl(`/posts/${slug}`)

  return (
    <div className="relative">
      <ReadingProgressBar />
      <ScrollReveal />
      <BlogPostStructuredData
        title={post.title}
        description={post.description || ''}
        author={post.author || '0xHabib'}
        datePublished={post.date}
        url={postUrl}
        tags={post.tags}
        imageUrl={ogImageUrl}
      />

      {/* Draft Warning Banner */}
      {post.visibility === 'draft' && (
        <div className="bg-blue-500 text-white text-center py-4 px-4 font-medium">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
            
            <span className="text-lg">COMING SOON: This post is currently being written and will be available soon!</span>
          </div>
        </div>
      )}

      {/* Post Header */}
      <header className="relative border-b border-border overflow-hidden">
        {post.banner && (
          <>
            <Image
              src={post.banner}
              alt={post.bannerAlt || post.title}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-background/95" />
          </>
        )}

        <div className="relative max-w-[90rem] mx-auto px-6 pt-14 pb-10">
          {post.series && (
            <p className="font-mono text-sm text-emerald-600 dark:text-emerald-400 mb-3">
              {post.series}
              {typeof post.seriesOrder === "number" && ` · Part ${post.seriesOrder}`}
            </p>
          )}

          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 max-w-3xl">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl">
              {post.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-5">
            {post.visibility !== 'draft' && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(post.date)}
              </span>
            )}
            {post.visibility !== 'draft' && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readingTime}
              </span>
            )}
            {post.author && <span>by {post.author}</span>}
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-mono text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="max-w-[90rem] mx-auto px-6 py-14">
          {post.visibility === 'draft' ? (
            /* Draft Content Placeholder */
            <div className="text-center py-20">
            </div>
          ) : (
            /* Full Content for Published Posts */
            <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_240px] gap-12">
              {/* Series / category sidebar */}
              <aside className="hidden lg:block min-w-0">
                <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto toc-scrollbar pr-2">
                  <PostSidebar
                    series={allSeries}
                    otherPosts={otherPosts}
                    currentSlug={post.slug}
                    currentSeries={post.series ?? null}
                  />
                </div>
              </aside>

              {/* Post Content */}
              <article className="prose prose-slate dark:prose-invert prose-lg max-w-[70ch] mx-auto min-w-0">
                <MDXRemote
                  source={post.content}
                  components={postComponents}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkMath, remarkGfm],
                      rehypePlugins: [rehypeKatex, rehypeHighlight],
                    },
                  }}
                />

                {seriesNavigation && seriesNavigation.series && (
                  <SeriesNavigation
                    series={seriesNavigation.series}
                    posts={seriesNavigation.posts}
                    currentIndex={seriesNavigation.currentIndex}
                    previousPost={seriesNavigation.previousPost}
                    nextPost={seriesNavigation.nextPost}
                  />
                )}
              </article>

              {/* Table of Contents */}
              <aside className="hidden xl:block min-w-0">
                <div className="sticky top-24 max-h-[calc(100vh-6rem)]">
                  <TableOfContents content={post.content} />
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
      <LatestPostsSlider excludeSlug={post.slug} />
    </div>
  )
}
