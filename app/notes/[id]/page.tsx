import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, CalendarDays, User, ExternalLink, BookOpen, Video, Headphones, FileText, Monitor, GraduationCap } from 'lucide-react'
import { getNoteById, getAllNotes } from '@/lib/notes'

interface NotePageProps {
  params: Promise<{ id: string }>
}

// Generate static params for all notes
export async function generateStaticParams() {
  const notes = getAllNotes()
  return notes.map((note) => ({
    id: note.id,
  }))
}

// Generate metadata for the note
export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { id } = await params
  const note = getNoteById(id)

  if (!note) {
    return {
      title: 'Note Not Found | 0xhabib',
      description: 'The requested note could not be found.',
    }
  }

  return {
    title: `${note.title} | Learning Notes | 0xhabib`,
    description: note.description,
    keywords: `${note.tags.join(', ')}, ${note.category}, ${note.type}, learning notes`,
    openGraph: {
      title: `${note.title} | Learning Notes`,
      description: note.description,
      type: 'article',
      url: `/notes/${note.id}`,
      images: [
        {
          url: `/api/og/note?title=${encodeURIComponent(note.title)}&source=${encodeURIComponent(note.source)}&type=${note.type}&difficulty=${note.difficulty}`,
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${note.title} | Learning Notes`,
      description: note.description,
      images: [`/api/og/note?title=${encodeURIComponent(note.title)}&source=${encodeURIComponent(note.source)}&type=${note.type}&difficulty=${note.difficulty}`],
    },
    alternates: {
      canonical: `/notes/${note.id}`,
    },
  }
}

const TypeIcon = ({ type }: { type: string }) => {
  const iconProps = { className: "w-5 h-5" }
  
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

const getDifficultyColor = (difficulty: string) => {
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

const getStatusColor = (status: string) => {
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

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params
  const note = getNoteById(id)

  if (!note) {
    notFound()
  }

  const NoteComponent = note.component

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/notes">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Link>
          </Button>
        </div>

        {/* Header */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <TypeIcon type={note.type} />
              <span className="text-muted-foreground capitalize">{note.type}</span>
              <span className="text-muted-foreground">•</span>
              <Badge className={getDifficultyColor(note.difficulty)}>
                {note.difficulty}
              </Badge>
              <Badge className={getStatusColor(note.status)}>
                {note.status}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight">{note.title}</h1>
            
            <div className="space-y-2">
              <div className="text-xl text-muted-foreground">
                <span className="font-semibold">{note.source}</span>
                {note.author && (
                  <span className="flex items-center gap-2 mt-2">
                    <User className="w-4 h-4" />
                    <span>by {note.author}</span>
                  </span>
                )}
              </div>
              
              {note.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {note.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Note Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <NoteComponent />
        </div>
      </div>
    </div>
  )
}
