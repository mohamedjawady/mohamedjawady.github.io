"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Calendar, User, BookOpen, Video, Headphones, FileText, Monitor, GraduationCap, Signal, Eye } from 'lucide-react'
import { parseInternalUrl } from '@/lib/url'

interface ContentPreview {
  title: string
  description: string
  type: string
  metadata?: {
    author?: string
    date?: string
    tags?: string[]
    difficulty?: string
    category?: string
    readingTime?: string
    [key: string]: any
  }
}

interface LinkPreviewProps {
  href: string
  children: React.ReactNode
  className?: string
}

const TypeIcon = ({ type }: { type: string }) => {
  const iconProps = { className: "w-4 h-4" }
  
  switch (type) {
    case 'book':
      return <BookOpen {...iconProps} />
    case 'course':
      return <GraduationCap {...iconProps} />
    case 'video':
      return <Video {...iconProps} />
    case 'podcast':
      return <Headphones {...iconProps} />
    case 'article':
      return <FileText {...iconProps} />
    case 'documentation':
      return <Monitor {...iconProps} />
    case 'reading':
      return <BookOpen {...iconProps} />
    default:
      return <FileText {...iconProps} />
  }
}

const getDifficultyLevel = (difficulty?: string) => {
  switch (difficulty) {
    case 'beginner': return 1
    case 'intermediate': return 2
    case 'advanced': return 3
    default: return 0
  }
}

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case 'beginner': return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case 'intermediate': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    case 'advanced': return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export function LinkPreview({ href, children, className }: LinkPreviewProps) {
  const [preview, setPreview] = useState<ContentPreview | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const parsedUrl = parseInternalUrl(href)
  const isInternal = parsedUrl !== null

  useEffect(() => {
    if (!isInternal || !parsedUrl || !showPreview) return

    const fetchPreview = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/preview?type=${parsedUrl.type}&id=${parsedUrl.id}`)
        if (response.ok) {
          const data = await response.json()
          setPreview(data)
        }
      } catch (error) {
        console.error('Failed to fetch preview:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPreview()
  }, [isInternal, parsedUrl, showPreview])

  // For external links or non-previewable content, return regular link
  if (!isInternal) {
    return (
      <a
        href={href}
        className={`font-medium text-green-500 underline underline-offset-4 hover:text-green-400 transition-colors inline-flex items-center gap-1 ${className || ''}`}
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
        {href?.startsWith("http") && <ExternalLink className="w-3 h-3" />}
      </a>
    )
  }

  return (
    <div className="relative inline-block">
      <Link
        href={href}
        className={`font-medium text-green-500 underline underline-offset-4 hover:text-green-400 transition-colors inline-flex items-center gap-1 ${className || ''}`}
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
      >
        {children}
        <Eye className="w-3 h-3" />
      </Link>

      {/* Preview Card */}
      {showPreview && (
        <div className="absolute z-50 top-full left-0 mt-2 w-80 max-w-sm">
          <Card className="shadow-lg border-border/50 bg-background/95 backdrop-blur">
            {loading ? (
              <CardContent className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            ) : preview ? (
              <>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm line-clamp-2 leading-tight">
                        {preview.title}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1 line-clamp-2">
                        {preview.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <TypeIcon type={preview.type} />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 pb-3">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {/* Content Type Badge */}
                    <Badge variant="secondary" className="text-xs capitalize">
                      {parsedUrl.type}
                    </Badge>

                    {/* Difficulty Badge for cheatsheets and notes */}
                    {preview.metadata?.difficulty && (parsedUrl.type === 'cheatsheet' || parsedUrl.type === 'note') && (
                      <Badge variant="outline" className={`text-xs ${getDifficultyColor(preview.metadata.difficulty)}`}>
                        {preview.metadata.difficulty}
                      </Badge>
                    )}

                    {/* Category Badge */}
                    {preview.metadata?.category && (
                      <Badge variant="outline" className="text-xs">
                        {preview.metadata.category}
                      </Badge>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    {preview.metadata?.author && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{preview.metadata.author}</span>
                      </div>
                    )}
                    
                    {preview.metadata?.date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(preview.metadata.date).toLocaleDateString()}</span>
                      </div>
                    )}

                    {preview.metadata?.readingTime && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{preview.metadata.readingTime}</span>
                      </div>
                    )}

                    {/* Difficulty level indicators for cheatsheets */}
                    {preview.metadata?.difficulty && parsedUrl.type === 'cheatsheet' && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs">Difficulty:</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 3 }, (_, i) => (
                            <Signal
                              key={i}
                              className={`h-2.5 w-2.5 ${
                                i < getDifficultyLevel(preview.metadata?.difficulty) ? "text-primary fill-current" : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tags Preview */}
                  {preview.metadata?.tags && preview.metadata.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {preview.metadata.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {preview.metadata.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{preview.metadata.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">
                  Preview not available
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
