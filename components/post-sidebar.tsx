"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarPost {
  slug: string
  title: string
  seriesOrder?: number
  visibility: "public" | "private" | "draft"
}

interface PostSidebarProps {
  series: Record<string, SidebarPost[]>
  otherPosts: SidebarPost[]
  currentSlug: string
  currentSeries: string | null
}

export function PostSidebar({ series, otherPosts, currentSlug, currentSeries }: PostSidebarProps) {
  const seriesNames = Object.keys(series)
  const [openSeries, setOpenSeries] = useState<string | null>(currentSeries)
  const [otherOpen, setOtherOpen] = useState(!currentSeries)

  return (
    <nav className="text-sm">
      <ul className="space-y-1">
        {seriesNames.map((name) => {
          const isOpen = openSeries === name
          return (
            <li key={name}>
              <button
                type="button"
                onClick={() => setOpenSeries(isOpen ? null : name)}
                className="flex w-full items-center gap-1.5 py-1.5 text-left font-medium text-foreground/90 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                <ChevronRight className={cn("h-3.5 w-3.5 shrink-0 transition-transform", isOpen && "rotate-90")} />
                {name}
              </button>
              {isOpen && (
                <ul className="ml-[18px] space-y-1 border-l border-border pl-3 py-1">
                  {series[name].map((post, i) => (
                    <li key={post.slug}>
                      <Link
                        href={`/posts/${post.slug}`}
                        className={cn(
                          "block py-1 leading-snug hover:text-emerald-600 dark:hover:text-emerald-400",
                          post.slug === currentSlug
                            ? "font-medium text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground",
                        )}
                      >
                        {i + 1}. {post.title}
                        {post.visibility === "draft" && (
                          <span className="ml-1.5 text-xs text-muted-foreground/70">(soon)</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}

        {otherPosts.length > 0 && (
          <li>
            <button
              type="button"
              onClick={() => setOtherOpen(!otherOpen)}
              className="flex w-full items-center gap-1.5 py-1.5 text-left font-medium text-foreground/90 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              <ChevronRight className={cn("h-3.5 w-3.5 shrink-0 transition-transform", otherOpen && "rotate-90")} />
              Other Writeups
            </button>
            {otherOpen && (
              <ul className="ml-[18px] space-y-1 border-l border-border pl-3 py-1">
                {otherPosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className={cn(
                        "flex items-start gap-1.5 py-1 leading-snug hover:text-emerald-600 dark:hover:text-emerald-400",
                        post.slug === currentSlug
                          ? "font-medium text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground",
                      )}
                    >
                      <FileText className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-60" />
                      <span>{post.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        )}
      </ul>
    </nav>
  )
}
