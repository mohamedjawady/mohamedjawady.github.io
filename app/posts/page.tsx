import { getPublicPosts } from "@/lib/posts"
import { PostsFilter } from "@/components/posts-filter"
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
        url: `${getCanonicalUrl('/api/og')}?title=All Posts&description=Browse all blog posts...`,
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
    images: [`${getCanonicalUrl('')}/api/og?title=All Posts&description=Browse all blog posts about cybersecurity, malware analysis, reverse engineering, and more.`],
  },
}

export default async function PostsPage() {
  const posts = await getPublicPosts()
  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags)))

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-mono mb-4">All Posts</h1>
        <p className="text-muted-foreground text-lg">
          {posts.length} posts documenting my journey in cybersecurity and development
        </p>
      </div>

      <PostsFilter posts={posts} allTags={allTags} />
    </div>
  )
}
