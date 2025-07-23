import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Note {
  id: string
  title: string
  description: string
  source: string
  type: 'book' | 'course' | 'video' | 'article' | 'podcast' | 'lecture' | 'other'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  category: string
  author?: string
  publishedDate?: string
  url?: string
  status: 'reading' | 'completed' | 'abandoned' | 'wishlist'
  visible: boolean
  component: React.ComponentType<any>
}

export interface NoteMetadata {
  title: string
  description: string
  source: string
  type: 'book' | 'course' | 'video' | 'article' | 'podcast' | 'lecture' | 'other'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  category: string
  author?: string
  publishedDate?: string
  url?: string
  status: 'reading' | 'completed' | 'abandoned' | 'wishlist'
  visible: boolean
}

const notesDirectory = path.join(process.cwd(), 'content/notes')

export function getAllNotes(): Note[] {
  try {
    const fileNames = fs.readdirSync(notesDirectory)
    const notes = fileNames
      .filter(name => name.endsWith('.md'))
      .map(name => {
        const id = name.replace(/\.md$/, '')
        return getNoteById(id)
      })
      .filter((note): note is Note => note !== null)

    return notes.sort((a, b) => {
      if (a.publishedDate && b.publishedDate) {
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      }
      return a.title.localeCompare(b.title)
    })
  } catch (error) {
    console.error('Error reading notes directory:', error)
    return []
  }
}

export function getNoteById(id: string): Note | null {
  try {
    const fullPath = path.join(notesDirectory, `${id}.md`)
    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)
    const metadata = data as NoteMetadata

    // Dynamically import the component
    let component
    try {
      const componentModule = require(`@/components/notes/${id}`)
      // Try default export first, then named export
      component = componentModule.default || componentModule[
        id.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join('') + 'Notes'
      ]
    } catch (error) {
      console.error(`Error importing component for note ${id}:`, error)
      return null
    }

    return {
      id,
      ...metadata,
      component,
    }
  } catch (error) {
    console.error(`Error reading note ${id}:`, error)
    return null
  }
}

export function getVisibleNotes(): Note[] {
  return getAllNotes().filter(note => note.visible)
}

export function getNotesByCategory(category: string): Note[] {
  return getVisibleNotes().filter(note => 
    note.category.toLowerCase() === category.toLowerCase()
  )
}

export function getNotesByType(type: string): Note[] {
  return getVisibleNotes().filter(note => 
    note.type.toLowerCase() === type.toLowerCase()
  )
}

export function getNotesByStatus(status: string): Note[] {
  return getVisibleNotes().filter(note => 
    note.status.toLowerCase() === status.toLowerCase()
  )
}

export function getNotesByTag(tag: string): Note[] {
  return getVisibleNotes().filter(note => 
    note.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  )
}

export function searchNotes(query: string): Note[] {
  const lowercaseQuery = query.toLowerCase()
  return getVisibleNotes().filter(note => 
    note.title.toLowerCase().includes(lowercaseQuery) ||
    note.description.toLowerCase().includes(lowercaseQuery) ||
    note.source.toLowerCase().includes(lowercaseQuery) ||
    note.author?.toLowerCase().includes(lowercaseQuery) ||
    note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    note.category.toLowerCase().includes(lowercaseQuery)
  )
}

export function getUniqueCategories(): string[] {
  const categories = getVisibleNotes().map(note => note.category)
  return Array.from(new Set(categories)).sort()
}

export function getUniqueTypes(): string[] {
  const types = getVisibleNotes().map(note => note.type)
  return Array.from(new Set(types)).sort()
}

export function getUniqueTags(): string[] {
  const allTags = getVisibleNotes().flatMap(note => note.tags)
  return Array.from(new Set(allTags)).sort()
}

export function getUniqueStatuses(): string[] {
  const statuses = getVisibleNotes().map(note => note.status)
  return Array.from(new Set(statuses)).sort()
}
