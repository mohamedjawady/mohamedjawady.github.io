import { getPublicPosts, getDraftPosts } from "@/lib/posts"
import { PostsFilter } from "@/components/posts-filter"
import { PostCard } from "@/components/post-card"
import { getCanonicalUrl } from "@/lib/url"
import { Metadata } from "next"
import { HeroBackground } from "@/components/hero-background"

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden border-b border-border/20">
        <HeroBackground />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">

          
          <h1 className="text-4xl md:text-6xl font-bold font-mono tracking-tighter mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-muted-foreground to-foreground">
              All
            </span>{" "}
            <span className="text-emerald-500">Posts</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {publicPosts.length} published posts documenting my journey in cybersecurity and development
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Published Posts Section */}
        <div className="mb-16">
          <PostsFilter posts={publicPosts} allTags={allTags} />
        </div>

        {/* Coming Soon Section for Draft Posts */}
        {draftPosts.length > 0 && (
          <div className="border-t border-border/40 pt-12">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold font-mono mb-4 inline-flex items-center justify-center gap-3">
                Coming Soon
                <span className="text-sm font-normal bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full">
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
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl z-10 flex flex-col items-center justify-center border border-border/50">
                    <span className="bg-emerald-500/20 text-emerald-500 px-4 py-2 rounded-full font-medium text-sm border border-emerald-500/30 animate-pulse">
                      Encrypting Data...
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
    </div>
  )
}
