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
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-border/50 group overflow-hidden">
      {/* Banner Image */}
      {post.banner && (
        <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
          <Link href={`/posts/${post.slug}`}>
            <div className="relative w-full h-full">
              <Image
                src={post.banner}
                alt={post.bannerAlt || post.title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={85}
              />
              {/* Subtle overlay for better text contrast if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Reading indicator overlay */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-xs font-medium text-foreground">{post.readingTime}</span>
                </div>
              </div>
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
          <h3 className="text-xl font-semibold hover:text-green-500 transition-colors line-clamp-2 group-hover:text-green-500">
            {post.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
          <User className="w-4 h-4" />
          <span>by {post.author}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">{post.description}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs hover:bg-green-500/20 transition-colors cursor-pointer"
            >
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
