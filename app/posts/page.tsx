import { getPublicPosts, getDraftPosts } from "@/lib/posts"
import { PostsFilter } from "@/components/posts-filter"
import { PostCard } from "@/components/post-card"
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
  const publicPosts = await getPublicPosts()
  const draftPosts = await getDraftPosts()
  const allTags = Array.from(new Set(publicPosts.flatMap((post) => post.tags)))

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-mono mb-4">All Posts</h1>
        <p className="text-muted-foreground text-lg">
          {publicPosts.length} published posts documenting my journey in cybersecurity and development
        </p>
      </div>

      {/* Published Posts Section */}
      <div className="mb-16">
        <PostsFilter posts={publicPosts} allTags={allTags} />
      </div>

      {/* Coming Soon Section for Draft Posts */}
      {draftPosts.length > 0 && (
        <div className="border-t pt-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold font-mono mb-4 flex items-center gap-3">
              Coming Soon
              <span className="text-sm font-normal bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full">
                {draftPosts.length} draft{draftPosts.length !== 1 ? 's' : ''}
              </span>
            </h2>
            <p className="text-muted-foreground">
              These posts are currently in development and will be published soon.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {draftPosts.map((post) => (
              <div key={post.slug} className="relative">
                <div className="absolute inset-0 bg-muted/50 rounded-lg z-10 flex items-center justify-center">
                  <span className="bg-yellow-500/90 text-yellow-950 px-4 py-2 rounded-full font-medium text-sm">
                    Coming Soon
                  </span>
                </div>
                <div className="opacity-50 pointer-events-none">
                  <PostCard post={post} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
