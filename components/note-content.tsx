'use client'

import { useEffect, useState } from 'react'

interface NoteContentProps {
  noteId: string
}

export function NoteContent({ noteId }: NoteContentProps) {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadComponent() {
      try {
        setLoading(true)
        setError(null)
        
        // Dynamically import the component directly
        const componentModule = await import(`@/components/notes/${noteId}`)
        
        // Try default export first, then named export
        const component = componentModule.default || componentModule[
          noteId.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join('') + 'Notes'
        ]
        
        if (component) {
          setComponent(() => component)
        } else {
          setError('Component not found')
        }
      } catch (err) {
        setError('Error loading note component')
        console.error('Error loading component:', err)
      } finally {
        setLoading(false)
      }
    }

    loadComponent()
  }, [noteId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  if (!Component) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No content available for this note.</p>
      </div>
    )
  }

  return <Component />
}
