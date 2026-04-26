import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Code, Network, Bug, Target, Wrench, Download, Eye, Github, Linkedin, Mail } from "lucide-react"
import { HeroBackground } from "@/components/hero-background"
import { BentoGrid, BentoGridItem } from "@/components/bento-grid"

export default function AboutPage() {
  const skills = [
    { icon: <Shield className="w-5 h-5 text-red-500" />, name: "Malware Analysis", className: "md:col-span-1 border-red-500/20" },
    { icon: <Network className="w-5 h-5 text-blue-500" />, name: "Networking", className: "md:col-span-1 border-blue-500/20" },
    { icon: <Bug className="w-5 h-5 text-emerald-500" />, name: "Reverse Engineering", className: "md:col-span-1 border-emerald-500/20" },
    { icon: <Code className="w-5 h-5 text-purple-500" />, name: "Software Development", className: "md:col-span-1 border-purple-500/20" },
    { icon: <Target className="w-5 h-5 text-orange-500" />, name: "Threat Hunting", className: "md:col-span-1 border-orange-500/20" },
    { icon: <Wrench className="w-5 h-5 text-cyan-500" />, name: "Tool Development", className: "md:col-span-1 border-cyan-500/20" },
  ]

  const technologies = [
    "Go", "Python", "C/C++", "Assembly", "JavaScript", 
    "Linux", "Windows", "Docker", "Wireshark", "IDA Pro", 
    "Ghidra", "Burp Suite", "Metasploit", "YARA", "Volatility"
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden border-b border-border/20">
        <HeroBackground />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">

          
          <h1 className="text-4xl md:text-6xl font-bold font-mono tracking-tighter mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-muted-foreground to-foreground">
              About
            </span>{" "}
            <span className="text-emerald-500">Me</span>
          </h1>
          
          <div className="prose prose-slate dark:prose-invert max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed text-left">
            <p className="mb-6">
              My name is Mohamed Habib Jaouadi and I have always been a cybersecurity enthusiast who has a passion for understanding how systems work, how systems fail, and how to build better systems.
            </p>
            <p className="mb-6">
              I began my journey in cybersecurity focused on malware analysis. This curiosity has since evolved into offensive security, threat hunting, and secure software development. I have learned by doing, usually doing something destructive to aid in understanding complex systems, and by sharing that knowledge with my security community along the way.
            </p>
            <p>
              This blog will function as my notebook, and will serve as a place to document my findings, techniques, tools, and learning experiences. Whether that experience is finding a way to reverse engineer a new malware sample, learning about different network protocols, or building a new security tool, I want to share both the process and the outcome.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Skills - Bento Grid */}
        <section className="mb-24">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-3xl font-bold font-mono tracking-tight">Areas of Focus</h2>
            <div className="h-1 w-16 bg-emerald-500/50 mt-4 rounded-full"></div>
          </div>
          
          <BentoGrid className="md:auto-rows-[12rem]">
            {skills.map((skill) => (
              <BentoGridItem
                key={skill.name}
                title={skill.name}
                icon={skill.icon}
                className={skill.className}
              />
            ))}
          </BentoGrid>
        </section>

        {/* Technologies */}
        <section className="mb-24">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-3xl font-bold font-mono tracking-tight">Technologies & Tools</h2>
            <div className="h-1 w-16 bg-emerald-500/50 mt-4 rounded-full"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {technologies.map((tech) => (
              <Badge 
                key={tech} 
                variant="outline" 
                className="bg-background/40 font-mono py-2 px-4 text-sm border-border/50 text-muted-foreground hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all cursor-default shadow-sm"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        {/* Resume & Contact Row */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Resume */}
          <Card className="bg-card border-border/50 hover:border-emerald-500/30 transition-all shadow-sm">
            <CardHeader>
              <CardTitle className="font-mono text-2xl">Resume</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-8">
                Download or view my resume to learn more about my experience, education, and skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
                  <a href="/resume.pdf" download="Mohamed_Habib_Jaouadi_Resume.pdf">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
                <Button variant="outline" asChild className="border-border/50 hover:bg-muted/50">
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                    <Eye className="w-4 h-4 mr-2" />
                    View Online
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-card border-border/50 hover:border-emerald-500/30 transition-all shadow-sm">
            <CardHeader>
              <CardTitle className="font-mono text-2xl">Get in Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-8">
                I'm always interested in connecting with fellow security researchers, developers, and anyone passionate about cybersecurity.
              </p>
              <div className="flex gap-4">
                <a href="https://github.com/mohamedjawady" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-muted/20 border border-border/30 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400 transition-all">
                  <Github className="w-5 h-5" />
                </a>
                <a href="https://www.linkedin.com/in/mohamedjawady/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-muted/20 border border-border/30 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400 transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="mailto:mohamedhabib.jaouadi@outlook.com" className="p-3 rounded-full bg-muted/20 border border-border/30 hover:border-emerald-500/40 hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400 transition-all">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
