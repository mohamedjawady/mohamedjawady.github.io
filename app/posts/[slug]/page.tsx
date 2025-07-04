import { getPostBySlug, getAllPosts } from "@/lib/posts"
import { MDXRemote } from "next-mdx-remote/rsc"
import { mdxComponents } from "@/components/mdx-components"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { notFound } from "next/navigation"
import { TableOfContents } from "@/components/table-of-contents"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
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
  )
}
