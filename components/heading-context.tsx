"use client"

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react"

interface HeadingContextType {
  registerHeading: (text: string, level: number) => string
  getHeadings: () => Array<{ id: string; text: string; level: number }>
  headingsVersion: number // Add version to trigger re-renders
}

const HeadingContext = createContext<HeadingContextType | null>(null)

export function HeadingProvider({ children }: { children: ReactNode }) {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([])
  const [headingsVersion, setHeadingsVersion] = useState(0)

  const generateId = useCallback((text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }, [])

  const registerHeading = useCallback((text: string, level: number): string => {
    const id = generateId(text)
    
    setHeadings(prev => {
      // Check if this heading already exists
      const exists = prev.find(h => h.id === id)
      if (!exists) {
        const newHeadings = [...prev, { id, text, level }]
        console.log('Registered new heading:', { id, text, level }, 'Total headings:', newHeadings.length)
        // Increment version to trigger re-renders
        setHeadingsVersion(v => v + 1)
        return newHeadings
      }
      return prev
    })
    
    return id
  }, [generateId])

  const getHeadings = useCallback(() => {
    return headings
  }, [headings])

  // Reset headings when component mounts (for page navigation)
  useEffect(() => {
    setHeadings([])
    setHeadingsVersion(0)
  }, [])

  return (
    <HeadingContext.Provider value={{ registerHeading, getHeadings, headingsVersion }}>
      {children}
    </HeadingContext.Provider>
  )
}

export function useHeading() {
  const context = useContext(HeadingContext)
  if (!context) {
    throw new Error('useHeading must be used within a HeadingProvider')
  }
  return context
}
