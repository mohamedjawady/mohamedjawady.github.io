import { getPostBySlug, getAllPosts } from "@/lib/posts"
import { MDXRemote } from "next-mdx-remote/rsc"
import { mdxComponents } from "@/components/mdx-components"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { notFound } from "next/navigation"
import { TableOfContents } from "@/components/table-of-contents"
import { Metadata } from "next"
import { BlogPostStructuredData } from "@/components/structured-data"

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

  const ogImageUrl = `/api/og/post?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description || '')}&author=${encodeURIComponent(post.author || '0xHabib')}&tags=${encodeURIComponent(post.tags.join(','))}`

  return {
    title: `${post.title} | 0xHabib`,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: post.author || '0xHabib' }],
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `https://0xhabib.dev/posts/${slug}`,
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
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      creator: '@0xhabib',
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `https://0xhabib.dev/posts/${slug}`,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const ogImageUrl = `/api/og/post?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description || '')}&author=${encodeURIComponent(post.author || '0xHabib')}&tags=${encodeURIComponent(post.tags.join(','))}`
  const postUrl = `https://0xhabib.dev/posts/${slug}`

  return (
    <>
      <BlogPostStructuredData
        title={post.title}
        description={post.description || ''}
        author={post.author || '0xHabib'}
        datePublished={post.date}
        url={postUrl}
        tags={post.tags}
        imageUrl={`https://0xhabib.dev${ogImageUrl}`}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          href="/posts"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to posts
        </Link>

      {/* Post Header */}
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>

        <div className="flex items-center gap-4 text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(post.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{post.readingTime}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="hover:bg-green-500/20 transition-colors">
              #{tag}
            </Badge>
          ))}
        </div>

        {post.description && <p className="text-xl text-muted-foreground leading-relaxed">{post.description}</p>}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Table of Contents */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <TableOfContents content={post.content} />
          </div>
        </aside>

        {/* Post Content */}
        <article className="lg:col-span-3 prose prose-slate dark:prose-invert max-w-none">
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>
      </div>
    </div>
    </>
  )
}
