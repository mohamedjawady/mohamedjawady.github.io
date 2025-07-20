import Link from 'next/link'
import { StudyDeck } from '@/lib/study-decks.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, BookOpen, Target, Calendar } from 'lucide-react'

interface StudyDeckCardProps {
  deck: StudyDeck
}

export function StudyDeckCard({ deck }: StudyDeckCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 hover:bg-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    advanced: 'bg-red-100 text-red-800 hover:bg-red-200'
  }

  const categoryColors = {
    security: 'bg-blue-100 text-blue-800',
    networking: 'bg-purple-100 text-purple-800',
    programming: 'bg-indigo-100 text-indigo-800',
    systems: 'bg-gray-100 text-gray-800',
    default: 'bg-slate-100 text-slate-800'
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg">
            <Link 
              href={`/study-decks/${deck.id}`}
              className="hover:text-primary transition-colors"
            >
              {deck.title}
            </Link>
          </CardTitle>
          <Badge 
            variant="secondary" 
            className={difficultyColors[deck.difficulty]}
          >
            {deck.difficulty}
          </Badge>
        </div>
        <CardDescription className="line-clamp-3">
          {deck.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Category and Tags */}
          <div className="flex flex-wrap gap-1">
            <Badge 
              variant="outline" 
              className={categoryColors[deck.category as keyof typeof categoryColors] || categoryColors.default}
            >
              {deck.category}
            </Badge>
            {deck.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {deck.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{deck.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{deck.totalCards} cards</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{deck.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>Source: {deck.sourceNote}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(deck.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <Link
              href={`/study-decks/${deck.id}/study`}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center"
            >
              Start Studying
            </Link>
            <Link
              href={`/study-decks/${deck.id}`}
              className="flex-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center"
            >
              View Details
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
