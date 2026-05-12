import { getPostBySlug, getAllPosts, getSeriesNavigation } from "@/lib/posts"
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
import { IntelligenceLifecycle } from "@/components/visualizations/intelligence-lifecycle"
import { PyramidOfPain } from "@/components/visualizations/pyramid-of-pain"
import { SaltArchitecture } from "@/components/visualizations/salt-architecture"
import { SaltExerciseDiagram } from "@/components/visualizations/salt-exercise-diagram"
import { LinuxSystemCallsCheatsheet } from "@/components/cheatsheets/linux-system-calls"
import GdbDebuggingCheatsheet from "@/components/cheatsheets/gdb-debugging"
import { SeriesNavigation } from "@/components/series-navigation"
import { CollapsibleCode } from "@/components/ui/collapsible-code"
import { Term } from "@/components/ui/term"
import Image from "next/image"
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
  IntelligenceLifecycle: () => <IntelligenceLifecycle />,
  PyramidOfPain: () => <PyramidOfPain />,
  SaltArchitecture: () => <SaltArchitecture />,
  SaltExerciseDiagram: () => <SaltExerciseDiagram />,
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

  const ogImageUrl = `${getCanonicalUrl('')}/api/og/post?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description || '')}&author=${encodeURIComponent(post.author || '0xHabib')}&tags=${encodeURIComponent(post.tags.join(','))}`
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

  const ogImageUrl = `${getCanonicalUrl('')}/api/og/post?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description || '')}&author=${encodeURIComponent(post.author || '0xHabib')}&tags=${encodeURIComponent(post.tags.join(','))}`
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

      {/* Post Header with Banner Background */}
      <header className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden">
        {/* Banner Background */}
        {post.banner && (
          <div className="absolute inset-0 z-0">
            <Image
              src={post.banner}
              alt={post.bannerAlt || post.title}
              fill
              className="object-cover object-center parallax-banner"
              priority
              sizes="100vw"
              quality={95}
            />
            {/* Enhanced dark overlay for text readability */}
            <div className="absolute inset-0 gradient-overlay-dark" />
          </div>
        )}

        {/* Fallback gradient background when no banner */}
        {!post.banner && (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-green-600/20 via-blue-600/20 to-purple-600/20 dark:from-green-600/10 dark:via-blue-600/10 dark:to-purple-600/10" />
        )}

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">

          {/* Post Title */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 leading-tight text-white banner-text-shadow">
            {post.title}
          </h1>

          {/* Post Description */}
          {post.description && (
            <p className="text-xl md:text-2xl lg:text-3xl text-white/95 leading-relaxed mb-10 max-w-4xl mx-auto banner-text-shadow font-light">
              {post.description}
            </p>
          )}

          {/* Post Meta Information */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            {post.visibility !== 'draft' && (
              <div className="flex items-center gap-2 glass-effect-dark rounded-full px-5 py-3 text-white/90 hover:text-white transition-all duration-300 hover:scale-105">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">{formatDate(post.date)}</span>
              </div>
            )}
            {post.visibility !== 'draft' && (
              <div className="flex items-center gap-2 glass-effect-dark rounded-full px-5 py-3 text-white/90 hover:text-white transition-all duration-300 hover:scale-105">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{post.readingTime}</span>
              </div>
            )}
            {post.author && (
              <div className="flex items-center gap-2 glass-effect-dark rounded-full px-5 py-3 text-white/90 hover:text-white transition-all duration-300 hover:scale-105">
                <span className="text-sm">by</span>
                <span className="font-semibold text-green-400">{post.author}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-3">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="glass-effect text-white border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 px-4 py-2 text-sm font-medium hover:scale-105 banner-text-shadow"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      {/* Series Navigation */}
      {seriesNavigation && seriesNavigation.series && (
        <div className="bg-background/95 backdrop-blur-sm border-b border-border/40">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <SeriesNavigation
              series={seriesNavigation.series}
              posts={seriesNavigation.posts}
              currentIndex={seriesNavigation.currentIndex}
              previousPost={seriesNavigation.previousPost}
              nextPost={seriesNavigation.nextPost}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-background/95 backdrop-blur-sm relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-20">
          {post.visibility === 'draft' ? (
            /* Draft Content Placeholder */
            <div className="text-center py-20">
            </div>
          ) : (
            /* Full Content for Published Posts */
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Table of Contents */}
              <aside className="lg:col-span-1">
                <div className="sticky top-24 max-h-[calc(100vh-6rem)]">
                  <TableOfContents content={post.content} />
                </div>
              </aside>

              {/* Post Content */}
              <article className="lg:col-span-3 prose prose-slate dark:prose-invert max-w-none prose-lg">
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
              </article>
            </div>
          )}
        </div>
      </div>
      <LatestPostsSlider excludeSlug={post.slug} />
    </div>
  )
}
