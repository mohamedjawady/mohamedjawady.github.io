"use client"

import React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, BookOpen, List, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"
import { formatDate } from "@/lib/utils"

interface Post {
  slug: string
  title: string
  description: string
  date: string
  readingTime: string
  tags: string[]
  visibility: 'public' | 'private' | 'draft'
}

interface SeriesNavigationProps {
  series: string
  posts: Post[]
  currentIndex: number
  previousPost: Post | null
  nextPost: Post | null
}

export function SeriesNavigation({ 
  series, 
  posts, 
  currentIndex, 
  previousPost, 
  nextPost 
}: SeriesNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const currentPost = posts[currentIndex]

  return (
    <div className="space-y-4">
      {/* Series Overview Card */}
      <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader className="pb-3">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-blue-900 dark:text-blue-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base">{series}</span>
            </div>
            <Badge variant="secondary" className="self-start sm:ml-auto">
              Part {currentIndex + 1} of {posts.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Series Progress</span>
              <span>{Math.round(((currentIndex + 1) / posts.length) * 100)}%</span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / posts.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {previousPost ? (
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href={`/posts/${previousPost.slug}`} className="flex items-center justify-center gap-2">
                  <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    <span className="hidden sm:inline">Previous: </span>
                    {previousPost.title}
                  </span>
                </Link>
              </Button>
            ) : (
              <Button disabled size="sm" className="flex-1">
                <ChevronLeft className="w-4 h-4" />
                First Part
              </Button>
            )}

            {nextPost ? (
              <Button asChild size="sm" className="flex-1">
                <Link href={`/posts/${nextPost.slug}`} className="flex items-center justify-center gap-2">
                  <span className="truncate">
                    <span className="hidden sm:inline">Next: </span>
                    {nextPost.title}
                  </span>
                  <ChevronRight className="w-4 h-4 flex-shrink-0" />
                </Link>
              </Button>
            ) : (
              <Button disabled size="sm" className="flex-1">
                Last Part
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Expandable Series Index */}
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full flex items-center gap-2">
                <List className="w-4 h-4" />
                <span>{isExpanded ? 'Hide' : 'Show'} All Parts</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-3">
              <div className="grid gap-2">
                {posts.map((post, index) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    className={`
                      block p-2 sm:p-3 rounded-md border transition-all duration-200
                      ${index === currentIndex 
                        ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 ring-2 ring-blue-500 ring-opacity-30' 
                        : 'bg-background border-border hover:bg-muted hover:border-muted-foreground/30'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                          <Badge variant={index === currentIndex ? "default" : "secondary"} className="text-xs">
                            Part {index + 1}
                          </Badge>
                          {index === currentIndex && (
                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-600">
                              Current
                            </Badge>
                          )}
                          {post.visibility === 'draft' && (
                            <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-600">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                        <h4 className={`font-medium text-sm leading-tight ${
                          index === currentIndex ? 'text-blue-900 dark:text-blue-100' : ''
                        }`}>
                          {post.title}
                        </h4>
                        {post.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 hidden sm:block">
                            {post.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 sm:mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span className="hidden sm:inline">{formatDate(post.date)}</span>
                            <span className="sm:hidden">{formatDate(post.date).split(',')[0]}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readingTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  )
}
