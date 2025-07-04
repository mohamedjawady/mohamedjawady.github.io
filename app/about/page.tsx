import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Code, Network, Bug, Target, Wrench } from "lucide-react"

export default function AboutPage() {
  const skills = [
    { icon: Shield, name: "Malware Analysis", color: "text-red-500" },
    { icon: Network, name: "Networking", color: "text-blue-500" },
    { icon: Bug, name: "Reverse Engineering", color: "text-green-500" },
    { icon: Code, name: "Software Development", color: "text-purple-500" },
    { icon: Target, name: "Threat Hunting", color: "text-orange-500" },
    { icon: Wrench, name: "Tool Development", color: "text-cyan-500" },
  ]

  const technologies = [
    "Go",
    "Python",
    "C/C++",
    "Assembly",
    "JavaScript",
    "Linux",
    "Windows",
    "Docker",
    "Wireshark",
    "IDA Pro",
    "Ghidra",
    "Burp Suite",
    "Metasploit",
    "YARA",
    "Volatility",
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-mono mb-6">About Me</h1>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p className="text-xl leading-relaxed mb-6">
            I'm Mohamed Habib Jaouadi, a cybersecurity enthusiast passionate about understanding how systems work, how
            they break, and how to build them better.
          </p>

          <p className="leading-relaxed mb-6">
            My journey in cybersecurity started with curiosity about how malware operates and has evolved into a
            comprehensive exploration of offensive security, threat hunting, and secure software development. I believe
            in learning by doing, breaking things to understand them, and sharing knowledge with the community.
          </p>

          <p className="leading-relaxed mb-8">
            This blog serves as my digital notebook where I document discoveries, techniques, tools, and insights from
            my continuous learning journey. Whether it's reverse engineering a new malware sample, exploring network
            protocols, or building security tools, I aim to share both the process and the outcomes.
          </p>
        </div>
      </div>

      {/* Skills */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Areas of Focus</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map(({ icon: Icon, name, color }) => (
            <Card key={name} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-sm">{name}</span>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Technologies */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Technologies & Tools</h2>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge key={tech} variant="outline" className="hover:bg-green-500/20 transition-colors">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="mb-4">
              I'm always interested in connecting with fellow security researchers, developers, and anyone passionate
              about cybersecurity.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com"
                className="text-green-500 hover:text-green-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com"
                className="text-green-500 hover:text-green-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a href="mailto:contact@example.com" className="text-green-500 hover:text-green-400 transition-colors">
                Email
              </a>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
