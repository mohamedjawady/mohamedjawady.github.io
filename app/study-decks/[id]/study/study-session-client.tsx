'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StudyCardComponent } from '@/components/study-card'
import { StudyDeck } from '@/lib/study-decks.types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { shuffleCards } from '@/lib/study-decks.client'

interface StudySessionClientProps {
  deck: StudyDeck
  deckId: string
}

export function StudySessionClient({ deck, deckId }: StudySessionClientProps) {
  const router = useRouter()
  const [shuffledCards] = useState(() => shuffleCards(deck.cards))
  const [sessionStartTime] = useState(Date.now())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/study-decks/${deckId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Deck
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{deck.title}</h1>
            <p className="text-muted-foreground">Study Session</p>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <StudyCardComponent
              cards={shuffledCards}
              showProgress={true}
              onComplete={() => {
                const sessionTime = Math.round((Date.now() - sessionStartTime) / 1000)
                router.push(`/study-decks/${deckId}?completed=true&time=${sessionTime}`)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
