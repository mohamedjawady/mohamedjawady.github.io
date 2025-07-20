import { useState } from 'react'
import { marked } from 'marked'
import { StudyCard } from '@/lib/study-decks.types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RotateCcw, Eye, EyeOff, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react'

interface StudyCardComponentProps {
  cards: StudyCard[]
  onComplete?: () => void
  showProgress?: boolean
}

export function StudyCardComponent({ 
  cards, 
  onComplete, 
  showProgress = true 
}: StudyCardComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [studiedCards, setStudiedCards] = useState<Set<number>>(new Set())

  if (cards.length === 0) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No cards available for study.</p>
        </CardContent>
      </Card>
    )
  }

  const currentCard = cards[currentIndex]
  const progress = ((currentIndex + 1) / cards.length) * 100

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowBack(false)
    } else if (onComplete) {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowBack(false)
    }
  }

  const handleFlip = () => {
    setShowBack(!showBack)
    if (!showBack) {
      setStudiedCards(prev => new Set(prev).add(currentIndex))
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case ' ':
      case 'Enter':
        event.preventDefault()
        handleFlip()
        break
      case 'ArrowLeft':
        event.preventDefault()
        handlePrevious()
        break
      case 'ArrowRight':
        event.preventDefault()
        handleNext()
        break
      case 'r':
        event.preventDefault()
        setShowBack(false)
        break
    }
  }

  const typeColors = {
    definition: 'bg-blue-100 text-blue-800',
    concept: 'bg-green-100 text-green-800',
    list: 'bg-purple-100 text-purple-800',
    comparison: 'bg-orange-100 text-orange-800',
    scenario: 'bg-red-100 text-red-800',
    technical: 'bg-indigo-100 text-indigo-800',
    process: 'bg-teal-100 text-teal-800',
    architecture: 'bg-gray-100 text-gray-800',
    tools: 'bg-yellow-100 text-yellow-800',
    metrics: 'bg-pink-100 text-pink-800',
    checklist: 'bg-cyan-100 text-cyan-800',
    integration: 'bg-emerald-100 text-emerald-800',
    strategic: 'bg-violet-100 text-violet-800'
  }

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  }

  return (
    <div 
      className="max-w-4xl mx-auto space-y-4"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Progress Bar */}
      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* Study Card */}
      <Card className="min-h-[400px] relative">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge className={typeColors[currentCard.type]}>
                {currentCard.type}
              </Badge>
              <Badge variant="outline" className={difficultyColors[currentCard.difficulty]}>
                {currentCard.difficulty}
              </Badge>
              <Badge variant="outline">
                {currentCard.category}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowBack(false)}
                disabled={!showBack}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFlip}
              >
                {showBack ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showBack ? 'Hide Answer' : 'Show Answer'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Front of Card */}
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-medium text-lg mb-2">Question:</h3>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: marked(currentCard.front, { breaks: true }) 
                }}
              />
            </div>

            {/* Back of Card (Answer) */}
            {showBack && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="font-medium text-lg mb-2 text-primary">Answer:</h3>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: marked(currentCard.back, { breaks: true }) 
                  }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {currentCard.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFlip}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1 && !onComplete}
        >
          {currentIndex === cards.length - 1 ? 'Complete' : 'Next'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>Keyboard shortcuts: Space/Enter = Flip card, ← → = Navigate, R = Reset card</p>
        <p>Cards studied: {studiedCards.size} / {cards.length}</p>
      </div>
    </div>
  )
}
