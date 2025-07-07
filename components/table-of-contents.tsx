"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { remark } from 'remark'
import { visit } from 'unist-util-visit'

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
  const [activeText, setActiveText] = useState<string>("")

  useEffect(() => {
    const extractHeadingsFromMarkdown = async () => {
      try {
        const processor = remark()
        const tree = processor.parse(content)
        const extractedHeadings: Heading[] = []

        // Visit all heading nodes in the AST
        visit(tree, 'heading', (node: any) => {
          if (node.depth >= 1 && node.depth <= 6) {
            // Extract text from heading children
            let text = ''
            if (node.children) {
              text = node.children
                .map((child: any) => {
                  if (child.type === 'text') {
                    return child.value
                  } else if (child.type === 'inlineCode') {
                    return child.value
                  } else if (child.type === 'emphasis' || child.type === 'strong') {
                    return child.children?.map((c: any) => c.value || '').join('') || ''
                  }
                  return ''
                })
                .join('')
                .trim()
            }

            if (text) {
              const id = text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")

              extractedHeadings.push({ 
                id, 
                text, 
                level: node.depth 
              })
            }
          }
        })

        console.log('TOC extracted headings from markdown AST:', extractedHeadings)
        setHeadings(extractedHeadings)
      } catch (error) {
        console.error('Error parsing markdown:', error)
        setHeadings([])
      }
    }

    extractHeadingsFromMarkdown()
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const text = entry.target.textContent?.trim() || ""
            setActiveText(text)
          }
        })
      },
      { rootMargin: "-100px 0px -80% 0px" },
    )

    // Observe all heading elements by finding them in the DOM
    const headingSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    headingSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(element => observer.observe(element))
    })

    return () => observer.disconnect()
  }, [headings])

  const handleClick = (text: string, level: number) => {
    console.log('TOC click handler called with text:', text, 'level:', level)
    
    // Find the heading element by its text content
    const headingSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    let targetElement = null
    
    for (const selector of headingSelectors) {
      const elements = document.querySelectorAll(selector)
      for (const element of elements) {
        if (element.textContent?.trim() === text.trim()) {
          targetElement = element
          break
        }
      }
      if (targetElement) break
    }
    
    console.log('Found element by text:', targetElement)
    
    if (targetElement) {
      console.log('Scrolling to element:', targetElement)
      targetElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
      
      // Update URL with a text-based hash
      const urlHash = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      window.history.pushState(null, '', `#${urlHash}`)
      console.log('Updated URL to:', window.location.href)
    } else {
      console.error('Element not found for text:', text)
      // Let's check what headings are actually available
      const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      console.log('All headings on page:', Array.from(allHeadings).map(h => ({ 
        tag: h.tagName, 
        text: h.textContent,
        trimmed: h.textContent?.trim()
      })))
    }
  }

  if (headings.length === 0) return null

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">Table of Contents</h4>
      <nav className="space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 hover:pr-1 transition-all duration-200 toc-scrollbar">
        {headings.map(({ id, text, level }) => (
          <button
            key={id}
            onClick={() => handleClick(text, level)}
            className={cn(
              "block text-sm transition-colors hover:text-green-500 text-left w-full bg-transparent border-0 p-0 py-1",
              level === 1 && "font-medium",
              level === 2 && "pl-4",
              level === 3 && "pl-8",
              level >= 4 && "pl-12",
              activeText === text ? "text-green-500 font-medium" : "text-muted-foreground",
            )}
          >
            {text}
          </button>
        ))}
      </nav>
    </div>
  )
}
