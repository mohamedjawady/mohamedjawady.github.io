import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Post {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  readingTime: string
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(post.date)}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span>{post.readingTime}</span>
        </div>
        <Link href={`/posts/${post.slug}`}>
          <h3 className="text-xl font-semibold hover:text-green-500 transition-colors line-clamp-2">{post.title}</h3>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">{post.description}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs hover:bg-green-500/20 transition-colors">
              #{tag}
            </Badge>
          ))}
          {post.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{post.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
