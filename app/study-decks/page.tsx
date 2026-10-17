import { Metadata } from "next"
import { getAllStudyDecks, getAllCategories, getAllTags } from '@/lib/study-decks'
import { StudyDecksFilter } from '@/components/study-decks-filter'
import { SectionHero } from "@/components/section-hero"
import { getCanonicalUrl } from "@/lib/url"

export const metadata: Metadata = {
  title: "Study Decks | Mohamed Habib Jaouadi",
  description: "Interactive flashcards to help you master key concepts from your notes, with spaced repetition and progress tracking.",
  openGraph: {
    title: "Study Decks | Mohamed Habib Jaouadi",
    description: "Interactive flashcards to help you master key concepts from your notes, with spaced repetition and progress tracking.",
    url: getCanonicalUrl("/study-decks"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Study Decks | Mohamed Habib Jaouadi",
    description: "Interactive flashcards to help you master key concepts from your notes, with spaced repetition and progress tracking.",
  },
}

export default function StudyDecksPage() {
  const decks = getAllStudyDecks()
  const categories = getAllCategories()
  const tags = getAllTags()
  const totalCards = decks.reduce((sum, deck) => sum + deck.totalCards, 0)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SectionHero
        eyebrow="Spaced repetition"
        title="Study Decks"
        description="Interactive flashcards to help you master key concepts from your notes. Practice with spaced repetition and track your progress."
      />

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold font-mono">{decks.length}</div>
            <div className="text-sm text-muted-foreground">Total Decks</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold font-mono">{totalCards}</div>
            <div className="text-sm text-muted-foreground">Total Cards</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold font-mono">{categories.length}</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold font-mono">{tags.length}</div>
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
