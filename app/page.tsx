import { getAllPosts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Terminal } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const posts = await getAllPosts()
  const latestPosts = posts.slice(0, 6)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Terminal className="w-8 h-8 mr-3 text-green-500" />
            <h1 className="text-4xl md:text-6xl font-bold font-mono">
              0x<span className="text-green-500">Habib</span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Hi, I'm <span className="text-foreground font-semibold">Mohamed Habib Jaouadi</span>. I document what I
            break, build, and learn in security, malware, and networking.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="outline" className="text-green-500 border-green-500/30">
              #malware-analysis
            </Badge>
            <Badge variant="outline" className="text-blue-500 border-blue-500/30">
              #networking
            </Badge>
            <Badge variant="outline" className="text-red-500 border-red-500/30">
              #reverse-engineering
            </Badge>
            <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
              #software-engineering
            </Badge>
            <Badge variant="outline" className="text-purple-500 border-purple-500/30">
              #threat-hunting
            </Badge>
          </div>
          <div className="flex justify-center gap-4">
            <Link
              href="https://github.com/mohamedjawady/"
              className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
              target="_blank"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/mohamedjawady/"
              className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
              target="_blank"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold font-mono">Latest Posts</h2>
            <Link href="/posts" className="text-green-500 hover:text-green-400 font-mono transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
