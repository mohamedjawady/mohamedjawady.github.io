import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Visualization } from "@/lib/visualizations"

interface VisualizationCardProps {
  visualization: Visualization
}

export function VisualizationCard({ visualization }: VisualizationCardProps) {
  return (
    <Link href={`/visualizations/${visualization.id}`} className="group">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/50">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2 flex-1">
              {visualization.title}
            </CardTitle>
            {visualization.relatedPost && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 whitespace-nowrap flex-shrink-0">
                Post Related
              </Badge>
            )}
          </div>
          <CardDescription className="line-clamp-3">
            {visualization.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Coming Soon Badge for Drafts */}
            {visualization.visibility === 'draft' && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                  Coming Soon
                </Badge>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">By:</span>
              <span>{visualization.author}</span>
            </div>
            
            {visualization.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {visualization.tags.slice(0, visualization.visibility === 'draft' ? 2 : 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {visualization.tags.length > (visualization.visibility === 'draft' ? 2 : 3) && (
                  <Badge variant="secondary" className="text-xs">
                    +{visualization.tags.length - (visualization.visibility === 'draft' ? 2 : 3)} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
