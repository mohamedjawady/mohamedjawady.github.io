import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Code, Target, Wrench } from "lucide-react"

export default function NowPage() {
  const currentProjects = [
    {
      icon: Target,
      title: "Advanced Persistent Threat Analysis",
      description: "Deep diving into APT29 techniques and building detection rules",
      status: "In Progress",
      color: "text-red-500",
    },
    {
      icon: Code,
      title: "Go Malware Analysis Framework",
      description: "Building a modular framework for automated malware analysis",
      status: "Active Development",
      color: "text-blue-500",
    },
    {
      icon: Wrench,
      title: "Network Traffic Analyzer",
      description: "Custom tool for detecting anomalous network patterns",
      status: "Testing Phase",
      color: "text-green-500",
    },
  ]

  const learning = [
    "Advanced Windows Internals",
    "Kernel Exploitation Techniques",
    "Cloud Security Architecture",
    "Machine Learning for Threat Detection",
    "Rust for Systems Programming",
  ]

  const reading = [
    "The Art of Memory Forensics",
    "Practical Malware Analysis (Re-reading)",
    "Windows Internals 7th Edition",
    "Red Team Development and Operations",
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-mono mb-6">What I'm Doing Now</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A snapshot of what I'm currently focused on, learning, and building. Updated regularly to reflect my current
          interests and projects.
        </p>
        <p className="text-sm text-muted-foreground mt-4">Last updated: January 2025</p>
      </div>

      {/* Current Projects */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Code className="w-6 h-6 text-green-500" />
          Current Projects
        </h2>
        <div className="space-y-4">
          {currentProjects.map((project) => (
            <Card key={project.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <project.icon className={`w-5 h-5 ${project.color}`} />
                    <span>{project.title}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {project.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Learning */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-500" />
          Currently Learning
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learning.map((topic) => (
                <div key={topic} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Reading */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-purple-500" />
          Currently Reading
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {reading.map((book) => (
                <div key={book} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>{book}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Goals */}
      <section>
        <h2 className="text-2xl font-bold mb-6">2025 Goals</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Technical Goals</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Publish 24 technical blog posts (2 per month)</li>
                  <li>• Complete OSCP certification</li>
                  <li>• Contribute to 3 open-source security projects</li>
                  <li>• Speak at 2 security conferences</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Learning Goals</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Master kernel-level exploitation techniques</li>
                  <li>• Build proficiency in Rust for systems programming</li>
                  <li>• Deepen understanding of cloud security</li>
                  <li>• Explore AI/ML applications in cybersecurity</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
