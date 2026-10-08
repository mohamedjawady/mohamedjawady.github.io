import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, Clock, User } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Image from "next/image"

interface Post {
  slug: string
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  readingTime: string
  banner?: string
  bannerAlt?: string
  visibility?: 'public' | 'private' | 'draft'
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="h-full border-border hover:border-emerald-500/40 transition-colors group overflow-hidden">
      {/* Banner Image */}
      {post.banner && (
        <div className="relative w-full h-48 overflow-hidden bg-muted">
          <Link href={`/posts/${post.slug}`}>
            <div className="relative w-full h-full">
              <Image
                src={post.banner}
                alt={post.bannerAlt || post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={85}
              />
            </div>
          </Link>
        </div>
      )}

      <CardHeader className={`pb-3 ${post.banner ? 'pt-4' : ''}`}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(post.date)}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span>{post.readingTime}</span>
        </div>
        <Link href={`/posts/${post.slug}`}>
          <h3 className="text-xl font-semibold transition-colors line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            {post.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <User className="w-4 h-4" />
          <span>by {post.author}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {post.visibility === 'draft' 
            ? "This post is currently being written and will be available soon. Stay tuned for the full content!" 
            : post.description
          }
        </p>
        
        {/* Tags and Visibility Status */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Coming Soon Badge for Drafts */}
          {post.visibility === 'draft' && (
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white animate-pulse">
              Coming Soon
            </Badge>
          )}
          
          {/* Visibility Badge for Private */}
          {post.visibility === 'private' && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white">
              PRIVATE
            </Badge>
          )}
          
          {/* Tags */}
          {post.tags.slice(0, post.visibility === 'draft' ? 2 : 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              #{tag}
            </Badge>
          ))}
          {post.tags.length > (post.visibility === 'draft' ? 2 : 3) && (
            <Badge variant="outline" className="text-xs">
              +{post.tags.length - (post.visibility === 'draft' ? 2 : 3)}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
