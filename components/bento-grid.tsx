import React from "react"
import { cn } from "@/lib/utils"

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-2xl group/bento hover:shadow-2xl transition duration-500 shadow-input dark:shadow-none p-6 bg-card border border-border/50 justify-between flex flex-col space-y-4 hover:border-emerald-500/30 relative overflow-hidden",
        className
      )}
    >
      {/* Background glowing effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-500" />
      
      {header}
      <div className="group-hover/bento:translate-x-1 transition duration-200 z-10 relative">
        {icon}
        <div className="font-mono font-bold text-lg text-foreground mt-2 mb-2">
          {title}
        </div>
        <div className="font-sans font-normal text-muted-foreground text-sm">
          {description}
        </div>
      </div>
    </div>
  )
}
