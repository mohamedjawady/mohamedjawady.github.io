import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Tag, BookOpen, Signal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getCheatsheetById, getAllCheatsheets } from "@/lib/cheatsheets"
import { getCanonicalUrl } from "@/lib/url"
import { formatDistanceToNow } from "date-fns"

interface CheatsheetPageProps {
  params: Promise<{
    id: string
  }>
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const difficultyIcons = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
}

import { LinuxSystemCallsCheatsheet } from "@/components/cheatsheets/linux-system-calls"
import { GccDebuggingCheatsheet } from "@/components/cheatsheets/gcc-debugging"

// Import cheatsheet components dynamically
const cheatsheetComponents: Record<string, React.ComponentType> = {
  "linux-system-calls": LinuxSystemCallsCheatsheet,
  "gcc-debugging": GccDebuggingCheatsheet,
  // Add your cheatsheet components here as you create them
}

export async function generateStaticParams() {
  const cheatsheets = await getAllCheatsheets()
  return cheatsheets
    .filter(sheet => sheet.visibility === "public")
    .map((sheet) => ({
      id: sheet.id,
    }))
}

export async function generateMetadata({ params }: CheatsheetPageProps): Promise<Metadata> {
  const { id } = await params
  const cheatsheet = await getCheatsheetById(id)

  if (!cheatsheet) {
    return {
      title: "Cheatsheet Not Found",
    }
  }

  return {
    title: `${cheatsheet.title} | Cheatsheets | 0xHabib`,
    description: cheatsheet.description,
    openGraph: {
      title: cheatsheet.title,
      description: cheatsheet.description,
      type: "article",
      url: getCanonicalUrl(`/cheatsheets/${id}`),
      images: {
        url: `${getCanonicalUrl('/api/og/cheatsheet')}?title=${encodeURIComponent(cheatsheet.title)}&description=${encodeURIComponent(cheatsheet.description)}&category=${encodeURIComponent(cheatsheet.category)}&difficulty=${encodeURIComponent(cheatsheet.difficulty)}&author=${encodeURIComponent(cheatsheet.author)}&tags=${encodeURIComponent(cheatsheet.tags.join(','))}`,
      },
    },
    twitter: {
      card: "summary_large_image",
      title: cheatsheet.title,
      description: cheatsheet.description,
      images: [`${getCanonicalUrl('/api/og/cheatsheet')}?title=${encodeURIComponent(cheatsheet.title)}&description=${encodeURIComponent(cheatsheet.description)}&category=${encodeURIComponent(cheatsheet.category)}&difficulty=${encodeURIComponent(cheatsheet.difficulty)}&author=${encodeURIComponent(cheatsheet.author)}&tags=${encodeURIComponent(cheatsheet.tags.join(','))}`],
    },
  }
}

export default async function CheatsheetPage({ params }: CheatsheetPageProps) {
  const { id } = await params
  const cheatsheet = await getCheatsheetById(id)

  if (!cheatsheet || cheatsheet.visibility === "private") {
    notFound()
  }

  const CheatsheetComponent = cheatsheetComponents[cheatsheet.component]
  const difficultyLevel = difficultyIcons[cheatsheet.difficulty]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/cheatsheets" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Cheatsheets
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl font-bold leading-tight">
            {cheatsheet.title}
          </h1>
          <div className="flex items-center gap-1 text-muted-foreground">
            {Array.from({ length: 3 }, (_, i) => (
              <Signal
                key={i}
                className={`h-4 w-4 ${
                  i < difficultyLevel ? "text-primary fill-current" : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          {cheatsheet.description}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{cheatsheet.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Updated {formatDistanceToNow(new Date(cheatsheet.date))} ago</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{cheatsheet.category}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge className={difficultyColors[cheatsheet.difficulty]}>
            {cheatsheet.difficulty}
          </Badge>
          <Badge variant="outline">
            {cheatsheet.category}
          </Badge>
          {cheatsheet.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {CheatsheetComponent ? (
          <CheatsheetComponent />
        ) : (
          <div className="bg-muted/50 border border-border rounded-lg p-8 text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Cheatsheet Component Not Found</h3>
            <p className="text-muted-foreground">
              The component for this cheatsheet ({cheatsheet.component}) hasn't been created yet.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Create a component at <code>components/cheatsheets/{cheatsheet.component}.tsx</code>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
