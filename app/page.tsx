import { getPublicPosts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Terminal, Network, ArrowRight, Mail } from "lucide-react"
import Link from "next/link"
import { HeroBackground } from "@/components/hero-background"
import { AnimatedTypewriter } from "@/components/animated-typewriter"

export default async function HomePage() {
  const posts = await getPublicPosts()
  const latestPosts = posts.slice(0, 6)

  // Get top tags by frequency
  const tagCounts = posts.reduce(
    (acc, post) => {
      post.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  // Sort tags by frequency and take top 5
  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag)

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <HeroBackground />

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">


          <h1 className="text-5xl md:text-7xl font-bold font-mono tracking-tighter mb-6">
            <span className="text-muted-foreground">Hello, I'm</span>
            <br />
            <AnimatedTypewriter />
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto font-medium">
            Cyber Threat Intelligence Analyst
          </p>

          <p className="text-lg text-muted-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Documenting my exploration of malware analysis, reverse engineering, cryptography, and system security through technical writeups and open-source tools.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {topTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 transition-colors cursor-pointer font-mono py-1 px-3"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Link href="/posts">
              <Button className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-lg">
                Boot Sequence <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="h-12 px-8 border-border hover:border-emerald-500/40 text-lg">
                <Terminal className="w-5 h-5 mr-2" />
                `whoami`
              </Button>
            </Link>
          </div>

          <div className="flex justify-center items-center gap-5">
            {[
              { icon: Github, href: "https://github.com/mohamedjawady/", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/mohamedjawady/", label: "LinkedIn" },
              { icon: Mail, href: "mailto:mohamedhabib.jaouadi@outlook.com", label: "Email" },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="group relative p-3 rounded-full bg-muted/20 border border-border/30 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all duration-300"
                target={link.href.startsWith("http") ? "_blank" : undefined}
                title={link.label}
              >
                <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-emerald-400 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-50">
          <div className="w-[1px] h-12 bg-gradient-to-b from-emerald-500 to-transparent"></div>
        </div>
      </section>

      {/* Latest Intelligence Briefs / Posts */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-mono tracking-tight">Incoming Transmissions</h2>
              <p className="text-muted-foreground mt-3 max-w-xl text-lg">
                Recent deep dives, reverse engineering writeups, and technical tutorials.
              </p>
            </div>
            <Link href="/posts" className="group flex items-center font-mono text-emerald-500 hover:text-emerald-400 transition-colors">
              Read all posts
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Connection Section */}
      <section className="py-32 px-4 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Network className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-bold font-mono tracking-tight mb-5">Establish Connection</h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Interested in collaboration, discussing security research, or just wanting to connect? My comms are open.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="mailto:mohamedhabib.jaouadi@outlook.com">
              <Button size="lg" className="h-14 px-8 min-w-[200px] bg-foreground text-background hover:bg-emerald-500 hover:text-black font-semibold text-lg">
                <Mail className="w-5 h-5 mr-3" />
                Initialize Contact
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function Globe(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  )
}
