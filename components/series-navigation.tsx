import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Post {
  slug: string
  title: string
  description: string
  date: string
  readingTime: string
  tags: string[]
  visibility: 'public' | 'private' | 'draft'
}

interface SeriesNavigationProps {
  series: string
  posts: Post[]
  currentIndex: number
  previousPost: Post | null
  nextPost: Post | null
}

export function SeriesNavigation({
  series,
  posts,
  currentIndex,
  previousPost,
  nextPost,
}: SeriesNavigationProps) {
  return (
    <div className="not-prose mt-16 pt-8 border-t border-border">
      <p className="text-sm font-mono text-muted-foreground mb-4">
        {series} · Part {currentIndex + 1} of {posts.length}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {previousPost ? (
          <Link
            href={`/posts/${previousPost.slug}`}
            className="flex items-center gap-3 p-4 rounded-md border border-border hover:border-emerald-500/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground mb-0.5">Previous</div>
              <div className="text-sm font-medium truncate">{previousPost.title}</div>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextPost && (
          <Link
            href={`/posts/${nextPost.slug}`}
            className="flex items-center justify-between gap-3 p-4 rounded-md border border-border hover:border-emerald-500/50 transition-colors sm:text-right"
          >
            <div className="min-w-0 sm:order-1">
              <div className="text-xs text-muted-foreground mb-0.5">Next</div>
              <div className="text-sm font-medium truncate">{nextPost.title}</div>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
          </Link>
        )}
      </div>
    </div>
  )
}
