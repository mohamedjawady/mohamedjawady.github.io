"use client"

import { useState } from 'react'
import { NoteCard } from '@/components/note-card'
import { NotesFilter } from '@/components/notes-filter'
import { Note } from '@/lib/notes'

interface NotesClientProps {
  notes: Note[]
  categories: string[]
  types: string[]
  tags: string[]
  statuses: string[]
}

export function NotesClient({ notes, categories, types, tags, statuses }: NotesClientProps) {
  const [filteredNotes, setFilteredNotes] = useState<Note[]>(notes)

  return (
    <div className="space-y-8">
      {/* Filters */}
      <NotesFilter
        notes={notes}
        onFilter={setFilteredNotes}
        categories={categories}
        types={types}
        tags={tags}
        statuses={statuses}
      />

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredNotes.length} of {notes.length} notes
      </div>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No notes found matching your criteria.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}
    </div>
  )
}
