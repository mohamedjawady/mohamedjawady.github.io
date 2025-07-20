import fs from 'fs'
import path from 'path'
import { StudyDeck, StudyCard, StudySession, StudyProgress, StudyStats } from './study-decks.types'

const studyDecksDirectory = path.join(process.cwd(), 'content/study-decks')

export function getAllStudyDecks(): StudyDeck[] {
  try {
    const fileNames = fs.readdirSync(studyDecksDirectory)
    const decks = fileNames
      .filter(name => name.endsWith('.json'))
      .map(name => {
        const id = name.replace(/\.json$/, '')
        return getStudyDeckById(id)
      })
      .filter((deck): deck is StudyDeck => deck !== null)

    return decks.sort((a, b) => {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    })
  } catch (error) {
    console.warn('Could not read study decks directory:', error)
    return []
  }
}

export function getStudyDeckById(id: string): StudyDeck | null {
  try {
    const fullPath = path.join(studyDecksDirectory, `${id}.json`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const deck: StudyDeck = JSON.parse(fileContents)
    
    return deck
  } catch (error) {
    console.warn(`Could not read study deck ${id}:`, error)
    return null
  }
}

export function getStudyDecksByCategory(category: string): StudyDeck[] {
  return getAllStudyDecks().filter(deck => deck.category === category)
}

export function getStudyDecksByDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced'): StudyDeck[] {
  return getAllStudyDecks().filter(deck => deck.difficulty === difficulty)
}

export function getStudyDecksByTag(tag: string): StudyDeck[] {
  return getAllStudyDecks().filter(deck => deck.tags.includes(tag))
}

export function searchStudyDecks(query: string): StudyDeck[] {
  const lowercaseQuery = query.toLowerCase()
  return getAllStudyDecks().filter(deck => 
    deck.title.toLowerCase().includes(lowercaseQuery) ||
    deck.description.toLowerCase().includes(lowercaseQuery) ||
    deck.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export function getCardsByType(deckId: string, type: StudyCard['type']): StudyCard[] {
  const deck = getStudyDeckById(deckId)
  if (!deck) return []
  
  return deck.cards.filter(card => card.type === type)
}

export function getCardsByCategory(deckId: string, category: string): StudyCard[] {
  const deck = getStudyDeckById(deckId)
  if (!deck) return []
  
  return deck.cards.filter(card => card.category === category)
}

export function getCardsByDifficulty(deckId: string, difficulty: StudyCard['difficulty']): StudyCard[] {
  const deck = getStudyDeckById(deckId)
  if (!deck) return []
  
  return deck.cards.filter(card => card.difficulty === difficulty)
}

export function shuffleCards(cards: StudyCard[]): StudyCard[] {
  const shuffled = [...cards]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getRandomCards(deckId: string, count: number): StudyCard[] {
  const deck = getStudyDeckById(deckId)
  if (!deck) return []
  
  const shuffled = shuffleCards(deck.cards)
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export function getAllCategories(): string[] {
  const decks = getAllStudyDecks()
  const categories = new Set<string>()
  
  decks.forEach(deck => {
    categories.add(deck.category)
    deck.cards.forEach(card => categories.add(card.category))
  })
  
  return Array.from(categories).sort()
}

export function getAllTags(): string[] {
  const decks = getAllStudyDecks()
  const tags = new Set<string>()
  
  decks.forEach(deck => {
    deck.tags.forEach(tag => tags.add(tag))
    deck.cards.forEach(card => card.tags.forEach(tag => tags.add(tag)))
  })
  
  return Array.from(tags).sort()
}

export function getStudyStats(): StudyStats {
  const decks = getAllStudyDecks()
  const totalCards = decks.reduce((sum, deck) => sum + deck.totalCards, 0)
  
  // This would typically come from a database or local storage
  // For now, returning mock data
  return {
    totalDecks: decks.length,
    totalCards,
    cardsStudied: 0,
    cardsMastered: 0,
    averageAccuracy: 0,
    studyStreak: 0,
    totalStudyTime: 0,
    favoriteCategories: getAllCategories().slice(0, 3)
  }
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

export function createStudySession(
  deckId: string,
  sessionType: StudySession['sessionType'] = 'full',
  filters?: {
    category?: string
    difficulty?: StudyCard['difficulty']
    tags?: string[]
    count?: number
  }
): StudyCard[] {
  const deck = getStudyDeckById(deckId)
  if (!deck) return []
  
  let cards = deck.cards
  
  // Apply filters
  if (filters?.category) {
    cards = cards.filter(card => card.category === filters.category)
  }
  
  if (filters?.difficulty) {
    cards = cards.filter(card => card.difficulty === filters.difficulty)
  }
  
  if (filters?.tags && filters.tags.length > 0) {
    cards = cards.filter(card => 
      filters.tags!.some(tag => card.tags.includes(tag))
    )
  }
  
  // Apply session type logic
  switch (sessionType) {
    case 'random':
      cards = shuffleCards(cards)
      break
    case 'difficulty':
      // Sort by difficulty: beginner -> intermediate -> advanced
      const difficultyOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 }
      cards = cards.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
      break
    case 'category':
      // Group by category
      cards = cards.sort((a, b) => a.category.localeCompare(b.category))
      break
    case 'full':
    default:
      // Keep original order
      break
  }
  
  // Limit count if specified
  if (filters?.count && filters.count > 0) {
    cards = cards.slice(0, filters.count)
  }
  
  return cards
}
