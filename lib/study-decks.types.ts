export interface StudyCard {
  id: string
  type: 'definition' | 'concept' | 'list' | 'comparison' | 'scenario' | 'technical' | 'process' | 'architecture' | 'tools' | 'metrics' | 'checklist' | 'integration' | 'strategic'
  category: string
  front: string
  back: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface StudyDeck {
  id: string
  title: string
  description: string
  sourceNote: string
  category: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  totalCards: number
  createdDate: string
  lastUpdated: string
  cards: StudyCard[]
}

export interface StudySession {
  deckId: string
  startTime: Date
  endTime?: Date
  cardsStudied: string[]
  correctAnswers: string[]
  incorrectAnswers: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  sessionType: 'full' | 'category' | 'difficulty' | 'random'
}

export interface StudyProgress {
  deckId: string
  cardId: string
  attempts: number
  correctAttempts: number
  lastStudied: Date
  masteryLevel: 'new' | 'learning' | 'reviewing' | 'mastered'
  nextReviewDate: Date
}

export interface StudyStats {
  totalDecks: number
  totalCards: number
  cardsStudied: number
  cardsMastered: number
  averageAccuracy: number
  studyStreak: number
  totalStudyTime: number
  favoriteCategories: string[]
}
