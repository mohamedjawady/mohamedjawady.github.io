"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, BookOpen, Signal } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Cheatsheet } from "@/lib/cheatsheets"

interface CheatsheetCardProps {
  cheatsheet: Cheatsheet
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

export function CheatsheetCard({ cheatsheet }: CheatsheetCardProps) {
  const difficultyLevel = difficultyIcons[cheatsheet.difficulty]
  
  return (
    <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-border/50 hover:border-border">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/cheatsheets/${cheatsheet.id}`} className="hover:underline">
              {cheatsheet.title}
            </Link>
          </CardTitle>
          <div className="flex items-center gap-1 text-muted-foreground">
            {Array.from({ length: 3 }, (_, i) => (
              <Signal
                key={i}
                className={`h-3 w-3 ${
                  i < difficultyLevel ? "text-primary fill-current" : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {cheatsheet.description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant="secondary" className={difficultyColors[cheatsheet.difficulty]}>
            {cheatsheet.difficulty}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {cheatsheet.category}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {cheatsheet.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {cheatsheet.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{cheatsheet.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{cheatsheet.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(cheatsheet.date))} ago</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="h-3 w-3" />
          <span>Cheatsheet</span>
        </div>
      </CardFooter>
    </Card>
  )
}
