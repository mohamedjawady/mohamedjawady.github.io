"use client"

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays, User, ExternalLink, BookOpen, Video, Headphones, FileText, Monitor, GraduationCap } from 'lucide-react'
import { Note } from '@/lib/notes'
import { Button } from '@/components/ui/button'

interface NoteCardProps {
  note: Note
}

const TypeIcon = ({ type }: { type: Note['type'] }) => {
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
    case 'lecture':
      return <Monitor {...iconProps} />
    default:
      return <FileText {...iconProps} />
  }
}

const getDifficultyColor = (difficulty: Note['difficulty']) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'advanced':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}

const getStatusColor = (status: Note['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 'reading':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    case 'wishlist':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
    case 'abandoned':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Card className="group h-full transition-all duration-200 hover:shadow-lg border-l-4 border-l-blue-500">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TypeIcon type={note.type} />
            <span className="capitalize">{note.type}</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge 
              variant="outline" 
              className={getDifficultyColor(note.difficulty)}
            >
              {note.difficulty}
            </Badge>
            <Badge 
              variant="outline" 
              className={getStatusColor(note.status)}
            >
              {note.status}
            </Badge>
          </div>
        </div>
        
        <div>
          <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <Link href={`/notes/${note.id}`}>
              {note.title}
            </Link>
          </CardTitle>
          <div className="text-sm text-muted-foreground mt-1">
            <span className="font-medium">{note.source}</span>
            {note.author && (
              <span className="flex items-center gap-1 mt-1">
                <User className="w-3 h-3" />
                {note.author}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed">
          {note.description}
        </CardDescription>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {note.publishedDate && (
                <div className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  <span>{new Date(note.publishedDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            {note.url && (
              <Button size="sm" variant="outline" asChild>
                <a 
                  href={note.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Source
                </a>
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {note.category}
            </Badge>
            {note.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {note.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{note.tags.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
