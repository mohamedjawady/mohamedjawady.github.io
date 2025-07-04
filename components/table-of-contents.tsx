"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const extractedHeadings: Heading[] = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      extractedHeadings.push({ id, text, level })
    }

    setHeadings(extractedHeadings)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-100px 0px -80% 0px" },
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">Table of Contents</h4>
      <nav className="space-y-1">
        {headings.map(({ id, text, level }) => (
          <a
            key={id}
            href={`#${id}`}
            className={cn(
              "block text-sm transition-colors hover:text-green-500",
              level === 1 && "font-medium",
              level === 2 && "pl-4",
              level === 3 && "pl-8",
              level >= 4 && "pl-12",
              activeId === id ? "text-green-500 font-medium" : "text-muted-foreground",
            )}
          >
            {text}
          </a>
        ))}
      </nav>
    </div>
  )
}
