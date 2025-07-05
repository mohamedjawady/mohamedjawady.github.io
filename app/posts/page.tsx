import { getAllPosts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { getCanonicalUrl } from "@/lib/url"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "All Posts | 0xHabib",
  description: "Browse all blog posts about cybersecurity, malware analysis, reverse engineering, and more.",
  openGraph: {
    title: "All Posts | 0xHabib",
    description: "Browse all blog posts about cybersecurity, malware analysis, reverse engineering, and more.",
    url: getCanonicalUrl("/posts"),
    images: [
      {
        url: "/api/og?title=All Posts&description=Browse all blog posts about cybersecurity, malware analysis, reverse engineering, and more.",
        width: 1200,
        height: 630,
        alt: "All Posts - 0xHabib",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Posts | 0xHabib",
    description: "Browse all blog posts about cybersecurity, malware analysis, reverse engineering, and more.",
    images: ["/api/og?title=All Posts&description=Browse all blog posts about cybersecurity, malware analysis, reverse engineering, and more."],
  },
}

export default async function PostsPage() {
  const posts = await getAllPosts()
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)))

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-mono mb-4">All Posts</h1>
        <p className="text-muted-foreground text-lg">
          {posts.length} posts documenting my journey in cybersecurity and development
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search posts..." className="pl-10" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer hover:bg-green-500/20">
            All
          </Badge>
          {allTags.map((tag) => (
            <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-green-500/20">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
