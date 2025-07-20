'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { StudyCardComponent } from '@/components/study-card'
import { StudyDeck } from '@/lib/study-decks.types'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface StudyPageProps {
  params: Promise<{
    id: string
  }>
}

export default function StudyPage({ params }: StudyPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [deck, setDeck] = useState<StudyDeck | null>(null)
  const [sessionStartTime] = useState(Date.now())

  useEffect(() => {
    const loadDeck = async () => {
      try {
        // Fetch deck data from API route
        const response = await fetch(`/api/study-decks/${id}`)
        if (response.ok) {
          const deckData = await response.json()
          // Shuffle cards for better learning
          const shuffledCards = [...deckData.cards].sort(() => Math.random() - 0.5)
          setDeck({ ...deckData, cards: shuffledCards })
        }
      } catch (error) {
        console.error('Error loading deck:', error)
      }
    }

    loadDeck()
  }, [id])

  if (!deck) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading study deck...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href={`/study-decks/${id}`}>
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

        {/* Study Card Component */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <StudyCardComponent
              cards={deck.cards}
              showProgress={true}
              onComplete={() => {
                const sessionTime = Math.round((Date.now() - sessionStartTime) / 1000)
                router.push(`/study-decks/${id}?completed=true&time=${sessionTime}`)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
