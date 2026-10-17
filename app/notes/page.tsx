import { Metadata } from 'next'
import { NotesClient } from './notes-client'
import { getVisibleNotes, getUniqueCategories, getUniqueTypes, getUniqueTags, getUniqueStatuses } from '@/lib/notes'
import { SectionHero } from "@/components/section-hero"

export const metadata: Metadata = {
  title: 'Learning Notes | Mohamed Habib Jaouadi',
  description: 'My personal collection of notes from books, courses, videos, and other learning materials. Organized by category, type, and difficulty level.',
  keywords: 'learning notes, book notes, course notes, study materials, programming notes, cybersecurity notes',
  openGraph: {
    title: 'Learning Notes | Mohamed Habib Jaouadi',
    description: 'My personal collection of notes from books, courses, videos, and other learning materials.',
    type: 'website',
    url: '/notes',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'Learning Notes Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learning Notes | Mohamed Habib Jaouadi',
    description: 'My personal collection of notes from books, courses, videos, and other learning materials.',
    images: ['/android-chrome-512x512.png'],
  },
  alternates: {
    canonical: '/notes',
  },
}

export default function NotesPage() {
  const notes = getVisibleNotes()
  const categories = getUniqueCategories()
  const types = getUniqueTypes()
  const tags = getUniqueTags()
  const statuses = getUniqueStatuses()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SectionHero
        eyebrow="Study Log"
        title={
          <>
            Learning <span className="text-emerald-600 dark:text-emerald-400">Notes</span>
          </>
        }
        description="My personal collection of notes from books, courses, videos, and other learning materials."
        stats={[
          { label: `${notes.length} notes` },
          { label: `${categories.length} categories` },
          { label: `${types.length} formats` },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Client Component */}
        <NotesClient 
          notes={notes}
          categories={categories}
          types={types}
          tags={tags}
          statuses={statuses}
        />
      </div>
    </div>
  )
}
