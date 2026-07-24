import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Wrench } from "lucide-react"
import { ToolEntry } from "@/lib/tools"

interface ToolCardProps {
  tool: ToolEntry
}

export function ToolCard({ tool }: ToolCardProps) {
  const isAvailable = tool.status === "available"

  const content = (
    <Card
      className={`h-full transition-all duration-300 border-2 ${
        isAvailable ? "hover:shadow-lg hover:scale-[1.02] hover:border-primary/50" : "opacity-70"
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Wrench className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <CardTitle className="text-xl group-hover:text-primary transition-colors">{tool.title}</CardTitle>
          </div>
          {!isAvailable && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 whitespace-nowrap">
              Coming Soon
            </Badge>
          )}
        </div>
        <CardDescription>{tool.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {tool.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          {isAvailable && <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />}
        </div>
      </CardContent>
    </Card>
  )

  if (!isAvailable) {
    return <div className="group">{content}</div>
  }

  return (
    <Link href={tool.href} className="group">
      {content}
    </Link>
  )
}
