import { Metadata } from 'next'
import { NotesClient } from './notes-client'
import { getVisibleNotes, getUniqueCategories, getUniqueTypes, getUniqueTags, getUniqueStatuses } from '@/lib/notes'
import { HeroBackground } from "@/components/hero-background"

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden border-b border-border/20">
        <HeroBackground />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">

          
          <h1 className="text-4xl md:text-6xl font-bold font-mono tracking-tighter mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-muted-foreground to-foreground">
              Learning
            </span>{" "}
            <span className="text-emerald-500">Notes</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
            My personal collection of notes from books, courses, videos, and other learning materials
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-mono text-emerald-500/80">
            <span className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{notes.length} notes</span>
            <span className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{categories.length} categories</span>
            <span className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{types.length} formats</span>
          </div>
        </div>
      </section>

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
