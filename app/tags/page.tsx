import { getAllPosts } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function TagsPage() {
  const posts = await getAllPosts()

  // Count posts per tag
  const tagCounts = posts.reduce(
    (acc, post) => {
      post.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a)

  const tagColors = [
    "text-green-500 border-green-500/30",
    "text-blue-500 border-blue-500/30",
    "text-red-500 border-red-500/30",
    "text-yellow-500 border-yellow-500/30",
    "text-purple-500 border-purple-500/30",
    "text-pink-500 border-pink-500/30",
    "text-orange-500 border-orange-500/30",
    "text-cyan-500 border-cyan-500/30",
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-mono mb-4">Tags</h1>
        <p className="text-muted-foreground text-lg">Explore posts by topic and technology</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTags.map(([tag, count], index) => (
          <Card key={tag} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <Badge variant="outline" className={`text-lg px-3 py-1 ${tagColors[index % tagColors.length]}`}>
                  #{tag}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {count} post{count !== 1 ? "s" : ""}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {posts
                  .filter((post) => post.tags.includes(tag))
                  .slice(0, 3)
                  .map((post) => (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className="block text-sm hover:text-green-500 transition-colors truncate"
                    >
                      {post.title}
                    </Link>
                  ))}
                {count > 3 && <p className="text-xs text-muted-foreground">+{count - 3} more posts</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
