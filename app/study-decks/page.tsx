import { getAllStudyDecks, getAllCategories, getAllTags } from '@/lib/study-decks'
import { StudyDecksFilter } from '@/components/study-decks-filter'

export default function StudyDecksPage() {
  const decks = getAllStudyDecks()
  const categories = getAllCategories()
  const tags = getAllTags()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Study Decks</h1>
          <p className="text-muted-foreground text-lg">
            Interactive flashcards to help you master key concepts from your notes. 
            Practice with spaced repetition and track your progress.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{decks.length}</div>
            <div className="text-sm text-muted-foreground">Total Decks</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">
              {decks.reduce((sum, deck) => sum + deck.totalCards, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Cards</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{tags.length}</div>
            <div className="text-sm text-muted-foreground">Topics</div>
          </div>
        </div>

        {/* Filter and Display Decks */}
        <StudyDecksFilter 
          decks={decks}
          categories={categories}
          tags={tags}
        />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Study Decks - Interactive Learning',
  description: 'Master key concepts with interactive flashcards and spaced repetition learning.',
}