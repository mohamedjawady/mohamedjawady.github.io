import { getPublicPosts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Github,
  Linkedin,
  Terminal,
  ArrowRight,
  Mail,
  FileText,
  Wrench,
  BookOpen,
  StickyNote,
  BarChart3,
  Layers,
} from "lucide-react"
import Link from "next/link"
import { HeroBackground } from "@/components/hero-background"
import { AnimatedTypewriter } from "@/components/animated-typewriter"
import { formatDate } from "@/lib/utils"

const PILLARS = [
  {
    icon: FileText,
    title: "Posts",
    copy: "Long-form writeups with captured tool output, not paraphrased docs.",
    href: "/posts",
  },
  {
    icon: Wrench,
    title: "Tools",
    copy: "Interactive builders that run entirely in your browser.",
    href: "/tools",
  },
  {
    icon: BookOpen,
    title: "Cheatsheets",
    copy: "Copy-paste references, checked against primary sources.",
    href: "/cheatsheets",
  },
  {
    icon: StickyNote,
    title: "Notes",
    copy: "Study notes from courses and books, restructured and corrected.",
    href: "/notes",
  },
  {
    icon: BarChart3,
    title: "Visualizations",
    copy: "The mechanism, animated, not just described.",
    href: "/visualizations",
  },
  {
    icon: Layers,
    title: "Study Decks",
    copy: "Spaced-repetition decks for the things worth memorizing.",
    href: "/study-decks",
  },
]

export default async function HomePage() {
  const posts = await getPublicPosts()
  const latestPosts = posts.slice(0, 6)
  const [mostRecent, secondRecent] = latestPosts

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

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([tag]) => tag)

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <HeroBackground />
        {/* Soft diagonal accent streaks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute -left-24 -top-10 w-56 h-[160%] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent rotate-12 blur-3xl" />
          <div className="absolute left-1/3 -top-10 w-40 h-[160%] bg-gradient-to-b from-emerald-500/5 to-transparent rotate-12 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-5">
              Mohamed Habib Jaouadi &middot; Cyber Threat Intelligence Analyst
            </p>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6">
              Verify everything.
              <br />
              <span className="text-emerald-600 dark:text-emerald-400">Trust nothing by default.</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 max-w-xl leading-relaxed">
              Documenting malware analysis, reverse engineering, and detection engineering the way I'd want to read
              it: real captured output, primary sources, and nothing copied from a training deck.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
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

            <div className="flex items-center gap-5">
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

          {/* Floating "latest activity" mockup card stack */}
          {mostRecent && (
            <div className="relative hidden lg:block h-[320px]">
              {secondRecent && (
                <div className="absolute top-6 left-8 right-0 rounded-xl border border-border bg-card/80 backdrop-blur p-4 shadow-lg opacity-70 rotate-[-2deg]">
                  <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
                    <span>Published</span>
                    <span>{formatDate(secondRecent.date)}</span>
                  </div>
                  <p className="text-sm font-semibold line-clamp-2">{secondRecent.title}</p>
                </div>
              )}
              <div className="absolute top-20 left-0 right-8 rounded-xl border border-emerald-500/30 bg-card shadow-xl p-5 rotate-[1.5deg]">
                <div className="flex items-center justify-between mb-3">
                  <Badge className="bg-emerald-500 text-black font-mono text-[10px] tracking-wide hover:bg-emerald-500">
                    NEW
                  </Badge>
                  <span className="text-xs font-mono text-muted-foreground">{formatDate(mostRecent.date)}</span>
                </div>
                <p className="text-base font-bold leading-snug mb-2">{mostRecent.title}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{mostRecent.description}</p>
                <Link
                  href={`/posts/${mostRecent.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Read it <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Topics strip */}
      {topTags.length > 0 && (
        <section className="py-10 px-4 border-b border-border">
          <div className="max-w-6xl mx-auto">
            <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
              Topics covered
            </p>
            <div className="flex flex-wrap justify-center gap-3">
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
          </div>
        </section>
      )}

      {/* Pillar grid */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-4">
            Six ways in
          </p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-14 max-w-2xl">
            Pick a format, not a feed.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PILLARS.map((pillar) => (
              <Link
                key={pillar.title}
                href={pillar.href}
                className="group rounded-2xl border border-border bg-muted/20 hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-colors p-6 flex flex-col"
              >
                <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
                  <pillar.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold mb-2">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{pillar.copy}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-mono text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Open <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="py-4 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-10 md:p-14 text-center">
          <p className="font-serif text-2xl md:text-3xl leading-snug mb-6">
            &ldquo;ATT&amp;CK is a vocabulary precise enough to support that loop, not a checklist that completes it
            for you.&rdquo;
          </p>
          <Link
            href="/posts/mitre-attck-series-part7"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Threat-Informed Defense Series &middot; Part 7
          </Link>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-4">
                Recently published
              </p>
              <h2 className="font-serif text-3xl md:text-5xl leading-tight">Incoming Transmissions</h2>
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

      {/* Final CTA banner */}
      <section className="py-20 px-4 border-t border-border bg-emerald-500/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-5xl leading-tight mb-5">Got something to compare notes on?</h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl mx-auto">
            Interested in collaboration, discussing security research, or just wanting to connect? My comms are
            open.
          </p>
          <Link href="mailto:mohamedhabib.jaouadi@outlook.com">
            <Button size="lg" className="h-14 px-8 min-w-[200px] bg-foreground text-background hover:bg-emerald-500 hover:text-black font-semibold text-lg">
              <Mail className="w-5 h-5 mr-3" />
              Initialize Contact
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
