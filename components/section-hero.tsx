import type { ReactNode } from "react"
import { HeroBackground } from "@/components/hero-background"
import { cn } from "@/lib/utils"

interface SectionHeroProps {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  stats?: { label: string }[]
  children?: ReactNode
  className?: string
}

export function SectionHero({ eyebrow, title, description, stats, children, className }: SectionHeroProps) {
  return (
    <section className={cn("relative pt-28 md:pt-32 pb-16 md:pb-20 px-4 overflow-hidden border-b border-border", className)}>
      <HeroBackground />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -left-24 -top-10 w-56 h-[160%] bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent rotate-12 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 mb-5">
            {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] mb-6">{title}</h1>
        {description && (
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">{description}</p>
        )}
        {stats && stats.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-7 text-sm font-mono">
            {stats.map((s) => (
              <span
                key={s.label}
                className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
              >
                {s.label}
              </span>
            ))}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
