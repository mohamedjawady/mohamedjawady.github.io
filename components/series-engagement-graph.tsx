"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import { ChevronRight, Crosshair, Search, ArrowUpCircle, Users, Anchor, Network, ShieldCheck } from "lucide-react"

interface Post {
  slug: string
  title: string
  description: string
  date: string
  readingTime: string
  tags: string[]
  visibility: 'public' | 'private' | 'draft'
}

interface SeriesEngagementGraphProps {
  posts: Post[]
  currentIndex: number
}

interface StageInfo {
  stage: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  /** 1-indexed part numbers of posts that help with reading this one first, beyond the immediate previous part */
  dependsOn?: number[]
}

// Red-team engagement stage each AD series post maps to. Keyed by slug so it's
// resilient to reordering; only meaningful for the Active Directory Series.
const ENGAGEMENT_STAGES: Record<string, StageInfo> = {
  "active-directory-security-part1": { stage: "Recon: Map the Target", icon: Search, color: "text-slate-500 border-slate-400" },
  "active-directory-security-part2": { stage: "Enumeration", icon: Crosshair, color: "text-sky-500 border-sky-400" },
  "active-directory-security-part3": { stage: "Privilege Escalation", icon: ArrowUpCircle, color: "text-amber-500 border-amber-400", dependsOn: [1] },
  "active-directory-security-part4": { stage: "Lateral Movement", icon: Users, color: "text-purple-500 border-purple-400", dependsOn: [3] },
  "active-directory-security-part5": { stage: "Persistence", icon: Anchor, color: "text-emerald-500 border-emerald-400", dependsOn: [3] },
  "active-directory-security-part6": { stage: "Forest Compromise", icon: Network, color: "text-red-500 border-red-400", dependsOn: [1] },
  "active-directory-security-part7": { stage: "Debrief: Detection", icon: ShieldCheck, color: "text-blue-500 border-blue-400", dependsOn: [1] },
}

export const AD_SERIES_NAME = "Active Directory Series"

export function hasEngagementGraph(series: string) {
  return series === AD_SERIES_NAME
}

interface Point { x: number; y: number }

export function SeriesEngagementGraph({ posts, currentIndex }: SeriesEngagementGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([])
  const [arcs, setArcs] = useState<Array<{ from: Point; to: Point; key: string }>>([])
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const containerRect = container.getBoundingClientRect()
    setContainerSize({ width: containerRect.width, height: containerRect.height })

    const nextArcs: Array<{ from: Point; to: Point; key: string }> = []
    posts.forEach((post, index) => {
      const info = ENGAGEMENT_STAGES[post.slug]
      if (!info?.dependsOn) return
      const fromEl = nodeRefs.current[index]
      if (!fromEl) return
      const fromRect = fromEl.getBoundingClientRect()

      info.dependsOn.forEach((depPartNumber) => {
        const targetIndex = depPartNumber - 1
        const toEl = nodeRefs.current[targetIndex]
        if (!toEl || targetIndex === index) return
        const toRect = toEl.getBoundingClientRect()

        nextArcs.push({
          key: `${post.slug}-${depPartNumber}`,
          from: {
            x: fromRect.left + fromRect.width / 2 - containerRect.left,
            y: fromRect.bottom - containerRect.top,
          },
          to: {
            x: toRect.left + toRect.width / 2 - containerRect.left,
            y: toRect.bottom - containerRect.top,
          },
        })
      })
    })
    setArcs(nextArcs)
  }, [posts])

  useEffect(() => {
    measure()
    const container = containerRef.current
    if (!container || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => measure())
    observer.observe(container)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [measure])

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Each node is one stage of the engagement this series walks through. Dotted arcs point back to the post that helps most with reading that node.
      </p>
      <div className="overflow-x-auto pb-2">
        <div ref={containerRef} className="relative flex items-center gap-1 min-w-fit px-2 py-6">
          {posts.map((post, index) => {
              const info = ENGAGEMENT_STAGES[post.slug]
              const isCurrent = index === currentIndex
              const isDraft = post.visibility === "draft"
              const Icon = info?.icon ?? Crosshair

              const nodeContent = (
                <div
                  ref={(el) => { nodeRefs.current[index] = el }}
                  className={`w-36 sm:w-40 rounded-lg border-2 bg-background p-3 transition-all duration-200 ${
                    isCurrent ? "ring-2 ring-blue-500 border-blue-400 shadow-sm" : info?.color?.split(" ")[1] ?? "border-border"
                  } ${isDraft ? "border-dashed opacity-60" : ""} ${!isDraft ? "hover:shadow-md hover:-translate-y-0.5" : ""}`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${info?.color?.split(" ")[0] ?? "text-muted-foreground"}`} />
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Part {index + 1}
                    </span>
                  </div>
                  <div className="text-xs font-bold leading-tight mb-1">{info?.stage ?? post.title}</div>
                  <div className="text-[10px] text-muted-foreground line-clamp-2 leading-snug">{post.title}</div>
                </div>
              )

              return (
                <div key={post.slug} className="flex items-center flex-shrink-0">
                  {isDraft ? (
                    <div className="cursor-default">{nodeContent}</div>
                  ) : (
                    <Link href={`/posts/${post.slug}`}>{nodeContent}</Link>
                  )}
                  {index < posts.length - 1 && (
                    <ChevronRight className="mx-1 w-4 h-4 flex-shrink-0 text-muted-foreground/50" />
                  )}
                </div>
              )
            })}

          {arcs.length > 0 && containerSize.width > 0 && (
            <svg
              className="absolute inset-0 hidden sm:block pointer-events-none"
              width={containerSize.width}
              height={containerSize.height}
              aria-hidden="true"
            >
              <defs>
                <marker id="depArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" opacity="0.55" />
                </marker>
              </defs>
              {arcs.map((arc, i) => {
                const dip = 26 + i * 16
                const midX = (arc.from.x + arc.to.x) / 2
                const bottomY = Math.max(arc.from.y, arc.to.y) + dip
                return (
                  <path
                    key={arc.key}
                    d={`M ${arc.from.x} ${arc.from.y} Q ${midX} ${bottomY} ${arc.to.x} ${arc.to.y}`}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.4"
                    strokeWidth="1.3"
                    strokeDasharray="3 4"
                    className="text-muted-foreground"
                    markerEnd="url(#depArrow)"
                  />
                )
              })}
            </svg>
          )}
        </div>
      </div>
    </div>
  )
}
