import { getPostBySlug, getAllPosts } from "@/lib/posts"
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
import rehypeKatex from 'rehype-katex'
import { HillCipher } from "@/components/visualizations/hill-cipher"
import Image from "next/image"

// Component mapping for interactive elements in posts
const postComponents = {
  ...mdxComponents,
  HillCipher: () => <HillCipher />,
}

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const ogImageUrl = `${getCanonicalUrl('')}/api/og/post?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description || '')}&author=${encodeURIComponent(post.author || '0xHabib')}&tags=${encodeURIComponent(post.tags.join(','))}`
  const postUrl = getCanonicalUrl(`/posts/${slug}`)

  return {
    title: `${post.title} | 0xHabib`,
    description: post.description,
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

  if (!post) {
    notFound()
  }

  const ogImageUrl = `${getCanonicalUrl('')}/api/og/post?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description || '')}&author=${encodeURIComponent(post.author || '0xHabib')}&tags=${encodeURIComponent(post.tags.join(','))}`
  const postUrl = getCanonicalUrl(`/posts/${slug}`)

  return (
    <>
      <BlogPostStructuredData
        title={post.title}
        description={post.description || ''}
        author={post.author || '0xHabib'}
        datePublished={post.date}
        url={postUrl}
        tags={post.tags}
        imageUrl={ogImageUrl}
      />
      
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
            <div className="flex items-center gap-2 glass-effect-dark rounded-full px-5 py-3 text-white/90 hover:text-white transition-all duration-300 hover:scale-105">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{formatDate(post.date)}</span>
            </div>
            <div className="flex items-center gap-2 glass-effect-dark rounded-full px-5 py-3 text-white/90 hover:text-white transition-all duration-300 hover:scale-105">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{post.readingTime}</span>
            </div>
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

      {/* Main Content */}
      <div className="bg-background/95 backdrop-blur-sm relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Table of Contents */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
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
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeKatex],
                  },
                }}
              />
            </article>
          </div>
        </div>
      </div>
    </>
  )
}
