import { getAllPosts } from "@/lib/posts"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin, Terminal, Code2, Shield, Network, Trophy, ArrowRight, Download, Mail, ExternalLink, Star } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const posts = await getAllPosts()
  const latestPosts = posts.slice(0, 6)

  const stats = [
    { label: "Blog Posts", value: posts.length, icon: Code2 },
    { label: "Years Experience", value: "4+", icon: Shield },
    { label: "Security Tools", value: "12+", icon: Network },
    { label: "Projects Built", value: "8", icon: Trophy },
  ]

  const skills = [
    { name: "Malware Analysis", level: 92, color: "bg-red-500" },
    { name: "Reverse Engineering", level: 88, color: "bg-purple-500" },
    { name: "Network Security", level: 85, color: "bg-blue-500" },
    { name: "Python/Go Development", level: 90, color: "bg-green-500" },
    { name: "Threat Hunting", level: 83, color: "bg-yellow-500" },
    { name: "Digital Forensics", level: 80, color: "bg-orange-500" },
  ]

  const projects = [
    {
      name: "LMSHELL",
      description: "Advanced command-line malware analysis toolkit with automated sample processing and threat intelligence integration.",
      tech: ["Python", "YARA", "VirusTotal API"],
      github: "https://github.com/mohamedjawady/LMSHELL",
      stars: 45,
    },
    {
      name: "TW-Calculator",
      description: "Threat weighting calculator for risk assessment and vulnerability scoring in enterprise environments.",
      tech: ["JavaScript", "Node.js", "Security"],
      github: "https://github.com/mohamedjawady/TW-Calculator", 
      stars: 23,
    },
    {
      name: "Packet Analyzer Pro",
      description: "Real-time network packet analysis tool with anomaly detection and automated threat hunting capabilities.",
      tech: ["Go", "Networking", "ML"],
      github: "#",
      stars: 67,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Terminal className="w-8 h-8 mr-3 text-green-500 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold font-mono">
              0x<span className="text-green-500">Habib</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Hi, I'm <span className="text-foreground font-semibold">Mohamed Habib Jaouadi</span>
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Cybersecurity enthusiast who has a passion for understand how systems work, how systems fail, and how to build systems better.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Badge variant="outline" className="text-green-500 border-green-500/30 hover:bg-green-500/10 transition-colors">
              #malware-analysis
            </Badge>
            <Badge variant="outline" className="text-blue-500 border-blue-500/30 hover:bg-blue-500/10 transition-colors">
              #networking
            </Badge>
            <Badge variant="outline" className="text-red-500 border-red-500/30 hover:bg-red-500/10 transition-colors">
              #reverse-engineering
            </Badge>
            <Badge variant="outline" className="text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/10 transition-colors">
              #software-engineering
            </Badge>
            <Badge variant="outline" className="text-purple-500 border-purple-500/30 hover:bg-purple-500/10 transition-colors">
              #threat-hunting
            </Badge>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link href="/posts">
              <Button className="bg-green-500 hover:bg-green-600 text-black font-medium">
                Read My Articles <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="border-green-500/30 hover:bg-green-500/10">
                <Mail className="w-4 h-4 mr-2" />
                Get In Touch
              </Button>
            </Link>
          </div>
          
          <div className="flex justify-center gap-4">
            <Link
              href="https://github.com/mohamedjawady/"
              className="p-3 rounded-lg border border-border hover:bg-accent hover:scale-110 transition-all duration-300"
              target="_blank"
              title="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/mohamedjawady/"
              className="p-3 rounded-lg border border-border hover:bg-accent hover:scale-110 transition-all duration-300"
              target="_blank"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link
              href="mailto:mohamedhabib.jaouadi@outlook.com"
              className="p-3 rounded-lg border border-border hover:bg-accent hover:scale-110 transition-all duration-300"
              title="Send Email"
            >
              <Mail className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <IconComponent className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <div className="text-2xl font-bold font-mono text-green-500 mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section> */}

     

      {/* Featured Projects
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-mono mb-4">Featured Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Open-source security tools and research projects I've built to help the cybersecurity community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <Card key={index} className="h-full hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">{project.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">{project.stars}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Link 
                    href={project.github} 
                    target="_blank"
                    className="inline-flex items-center text-green-500 hover:text-green-400 transition-colors text-sm font-medium"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    View on GitHub
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="https://github.com/mohamedjawady" target="_blank">
              <Button variant="outline" className="border-green-500/30 hover:bg-green-500/10">
                <Github className="w-4 h-4 mr-2" />
                View All Projects
              </Button>
            </Link>
          </div>
        </div>
      </section> */}

      {/* Latest Posts */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold font-mono">Latest Posts</h2>
              <p className="text-muted-foreground mt-2">Deep dives into cybersecurity research and tool building</p>
            </div>
            <Link href="/posts" className="text-green-500 hover:text-green-400 font-mono transition-colors flex items-center">
              View all posts <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-mono mb-4">Stay Updated</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Follow my journey as I explore the depths of cybersecurity, share my research findings, 
            and build tools to make the digital world safer.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/posts">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black">
                <Terminal className="w-4 h-4 mr-2" />
                Start Reading
              </Button>
            </Link>
            <Link href="https://github.com/mohamedjawady/" target="_blank">
              <Button size="lg" variant="outline" className="border-green-500/30 hover:bg-green-500/10">
                <Github className="w-4 h-4 mr-2" />
                Follow on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
