import { getPublicPosts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Terminal, Shield, Network, Trophy, ArrowRight, Mail, ExternalLink, Star, Code, Cpu, Database, Eye } from "lucide-react"
import Link from "next/link"
import { HeroBackground } from "@/components/hero-background"
import { BentoGrid, BentoGridItem } from "@/components/bento-grid"
import { AnimatedTypewriter } from "@/components/animated-typewriter"

export default async function HomePage() {
  const posts = await getPublicPosts()
  const latestPosts = posts.slice(0, 6)

  // Extract all unique tags from posts
  const allTags = posts.reduce<string[]>((acc, post) => {
    post.tags.forEach((tag) => {
      if (!acc.includes(tag)) {
        acc.push(tag)
      }
    })
    return acc
  }, [])

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

  const projects = [
    {
      name: "LMSHELL",
      description: "Advanced CLI malware analysis toolkit with automated sample processing & threat intel integration.",
      tech: ["Python", "YARA", "VT API"],
      github: "https://github.com/mohamedjawady/LMSHELL",
      stars: 45,
      icon: <Terminal className="w-5 h-5 text-emerald-500" />
    },
    {
      name: "TW-Calculator",
      description: "Threat weighting calculator designed for risk assessment and enterprise vulnerability scoring.",
      tech: ["Node.js", "Security"],
      github: "https://github.com/mohamedjawady/TW-Calculator",
      stars: 23,
      icon: <Shield className="w-5 h-5 text-blue-500" />
    },
    {
      name: "Packet Analyzer Pro",
      description: "Real-time network packet analysis with anomaly detection & automated threat hunting.",
      tech: ["Go", "Networking"],
      github: "#",
      stars: 67,
      icon: <Network className="w-5 h-5 text-purple-500" />
    },
  ]

  const statsBento = [
    {
      title: "Blog Posts",
      description: `Written ${posts.length} technical articles.`,
      icon: <Code className="w-6 h-6 text-emerald-500/80 mb-2" />,
      className: "md:col-span-1 border-emerald-500/20",
    },
    {
      title: "Malware Analysis",
      description: "Deep-dives into reverse engineering & unpacking.",
      icon: <Cpu className="w-6 h-6 text-indigo-400 mb-2" />,
      className: "md:col-span-1 border-indigo-500/20",
    },
    {
      title: "Projects Built",
      description: "8+ open source security tools developed.",
      icon: <Trophy className="w-6 h-6 text-amber-500/80 mb-2" />,
      className: "md:col-span-1 border-amber-500/20",
    },
    {
      title: "Core Competencies",
      description: "Reverse Engineering, Threat Hunting, Digital Forensics, Network Security, Python & Go.",
      icon: <Database className="w-6 h-6 text-rose-400 mb-2" />,
      className: "md:col-span-2 border-rose-500/20",
    },
    {
      title: "Experience",
      description: "4+ years tracking threats & analyzing infrastructure.",
      icon: <Eye className="w-6 h-6 text-blue-400 mb-2" />,
      className: "md:col-span-1 border-blue-500/20",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <HeroBackground />

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">


          <h1 className="text-5xl md:text-7xl font-bold font-mono tracking-tighter mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-muted-foreground to-foreground">
              Hello, I'm
            </span>
            <br />
            <AnimatedTypewriter />
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto font-medium">
            Cybersecurity Researcher & Developer
          </p>

          <p className="text-lg text-muted-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Documenting my exploration of malware analysis, reverse engineering, cryptography, and system security through technical writeups and open-source tools.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {topTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-background/40 backdrop-blur border-border/50 text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/30 transition-all cursor-pointer font-mono py-1 px-3"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            <Link href="/posts">
              <Button className="h-12 px-8 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                Boot Sequence <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="h-12 px-8 border-border/50 hover:border-emerald-500/30 backdrop-blur-sm bg-background/50 text-lg">
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

      {/* Intelligence & Expertise - Bento Grid */}
      {/*
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-mono tracking-tight">System Specs & Expertise</h2>
            <div className="h-1 w-20 bg-emerald-500/50 mt-4 rounded-full"></div>
          </div>

          <BentoGrid className="max-w-5xl mx-auto">
            {statsBento.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.title}
                description={item.description}
                className={item.className}
                icon={item.icon}
              />
            ))}
          </BentoGrid>
        </div>
      </section>
      */}

      {/* Open Source Arsenal */}
      {/*
      <section className="py-24 px-4 bg-muted/10 border-y border-border/40 relative overflow-hidden">
        {/* Background glow in this section *\/}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-mono tracking-tight flex items-center">
                <Terminal className="w-8 h-8 mr-3 text-emerald-500" /> Open Source Arsenal
              </h2>
              <p className="text-muted-foreground mt-3 max-w-xl text-lg">
                Security tools and research projects I've built to assist the infosec community.
              </p>
            </div>
            <Link href="https://github.com/mohamedjawady" target="_blank">
              <Button variant="outline" className="border-border/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 group transition-all">
                Access Repository
                <ExternalLink className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="group relative flex flex-col justify-between p-6 rounded-2xl bg-card border border-border/50 hover:border-emerald-500/40 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] overflow-hidden">
                {/* Subtle top border highlight *\/}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/0 group-hover:via-emerald-500/50 to-transparent transition-all duration-500"></div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-muted/30 border border-border/40">
                      {project.icon}
                    </div>
                    <div className="flex items-center text-sm font-medium text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-full border border-border/20">
                      <Star className="w-3.5 h-3.5 mr-1.5 text-yellow-500/80" />
                      {project.stars}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold font-mono mb-3 group-hover:text-emerald-400 transition-colors">
                    {project.name}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex} className="text-[11px] font-mono tracking-wider uppercase px-2 py-1 rounded bg-muted/50 text-muted-foreground border border-border/40">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={project.github}
                    target="_blank"
                    className="inline-flex items-center text-sm font-medium text-foreground hover:text-emerald-500 transition-colors w-full p-2.5 justify-center rounded-lg border border-transparent hover:border-emerald-500/20 hover:bg-emerald-500/5"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Source Code
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

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
              <div key={post.slug} className="transform transition-all duration-300 hover:-translate-y-1">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connection Section */}
      <section className="py-32 px-4 relative overflow-hidden border-t border-border/20">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <Network className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-bold font-mono tracking-tight mb-5">Establish Connection</h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Interested in collaboration, discussing security research, or just wanting to connect? My comms are open.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="mailto:mohamedhabib.jaouadi@outlook.com">
              <Button size="lg" className="h-14 px-8 min-w-[200px] bg-foreground text-background hover:bg-emerald-500 hover:text-black font-semibold text-lg transition-all shadow-lg hover:shadow-emerald-500/25">
                <Mail className="w-5 h-5 mr-3" />
                Initialize Contact
              </Button>
            </Link>

          </div>
        </div>

        {/* Subtle background circles for CTA */}
        <div className="absolute top-1/2 left-[10%] w-[30vw] h-[30vw] rounded-full bg-blue-500/5 blur-[100px] -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 right-[10%] w-[30vw] h-[30vw] rounded-full bg-emerald-500/5 blur-[100px] -translate-y-1/2 pointer-events-none"></div>
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
