// Client-side utility functions for study decks
// These don't use fs/path and can be used in client components

import { StudyDeck, StudyCard } from './study-decks.types'

export function shuffleCards(cards: StudyCard[]): StudyCard[] {
  const shuffled = [...cards]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomCards(cards: StudyCard[], count: number): StudyCard[] {
  const shuffled = shuffleCards(cards)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function getCardsByType(cards: StudyCard[], type: StudyCard['type']): StudyCard[] {
  return cards.filter(card => card.type === type)
}

export function getCardsByCategory(cards: StudyCard[], category: string): StudyCard[] {
  return cards.filter(card => card.category === category)
}

export function getCardsByDifficulty(cards: StudyCard[], difficulty: StudyCard['difficulty']): StudyCard[] {
  return cards.filter(card => card.difficulty === difficulty)
}

export function searchDecks(decks: StudyDeck[], query: string): StudyDeck[] {
  const lowercaseQuery = query.toLowerCase()
  return decks.filter(deck => 
    deck.title.toLowerCase().includes(lowercaseQuery) ||
    deck.description.toLowerCase().includes(lowercaseQuery) ||
    deck.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export function filterDecksByCategory(decks: StudyDeck[], category: string): StudyDeck[] {
  return decks.filter(deck => deck.category === category)
}

export function filterDecksByDifficulty(decks: StudyDeck[], difficulty: 'beginner' | 'intermediate' | 'advanced'): StudyDeck[] {
  return decks.filter(deck => deck.difficulty === difficulty)
}

export function filterDecksByTag(decks: StudyDeck[], tag: string): StudyDeck[] {
  return decks.filter(deck => deck.tags.includes(tag))
}

export function sortDecks(decks: StudyDeck[], sortBy: string): StudyDeck[] {
  return [...decks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title)
      case 'difficulty':
        const diffOrder = { beginner: 0, intermediate: 1, advanced: 2 }
        return diffOrder[a.difficulty] - diffOrder[b.difficulty]
      case 'totalCards':
        return b.totalCards - a.totalCards
      case 'lastUpdated':
      default:
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    }
  })
}

// Spaced repetition algorithm (simplified version of SM-2)
export function calculateNextReviewDate(
  performance: number, // 0-5 scale (0=worst, 5=best)
  previousInterval: number = 1, // days
  easeFactor: number = 2.5
): { nextInterval: number; newEaseFactor: number; nextReviewDate: Date } {
  let newEaseFactor = easeFactor + (0.1 - (5 - performance) * (0.08 + (5 - performance) * 0.02))
  
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3
  }
  
  let nextInterval: number
  
  if (performance < 3) {
    nextInterval = 1 // Start over if performance is poor
  } else if (previousInterval === 1) {
    nextInterval = 6
  } else if (previousInterval === 6) {
    nextInterval = 6
  } else {
    nextInterval = Math.round(previousInterval * newEaseFactor)
  }
  
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval)
  
  return {
    nextInterval,
    newEaseFactor,
    nextReviewDate
  }
}
