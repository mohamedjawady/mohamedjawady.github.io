import { Metadata } from 'next'
import { NotesClient } from './notes-client'
import { getVisibleNotes, getUniqueCategories, getUniqueTypes, getUniqueTags, getUniqueStatuses } from '@/lib/notes'

export const metadata: Metadata = {
  title: 'Learning Notes | 0xhabib',
  description: 'My personal collection of notes from books, courses, videos, and other learning materials. Organized by category, type, and difficulty level.',
  keywords: 'learning notes, book notes, course notes, study materials, programming notes, cybersecurity notes',
  openGraph: {
    title: 'Learning Notes | 0xhabib',
    description: 'My personal collection of notes from books, courses, videos, and other learning materials.',
    type: 'website',
    url: '/notes',
    images: [
      {
        url: '/api/og/notes',
        width: 1200,
        height: 630,
        alt: 'Learning Notes Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learning Notes | 0xhabib',
    description: 'My personal collection of notes from books, courses, videos, and other learning materials.',
    images: ['/api/og/notes'],
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
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Learning Notes</h1>
            <p className="text-xl text-muted-foreground mt-2">
              My personal collection of notes from books, courses, videos, and other learning materials
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{notes.length} notes</span>
            <span>•</span>
            <span>{categories.length} categories</span>
            <span>•</span>
            <span>{types.length} content types</span>
          </div>
        </div>

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
