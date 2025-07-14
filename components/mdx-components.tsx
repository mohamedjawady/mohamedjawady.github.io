"use client"

import React from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"
import { HillCipher } from "@/components/visualizations/hill-cipher"
import { LawOfLargeNumbers } from "@/components/visualizations/law-of-large-numbers"

// Simple copy button component for code blocks
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={copyToClipboard}
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </Button>
  )
}

export const mdxComponents = {
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="scroll-m-20 border-b border-border/20 pb-2 text-3xl font-semibold tracking-tight mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
      {children}
    </h3>
  ),
  h4: ({ children }: { children: React.ReactNode }) => (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-3">
      {children}
    </h4>
  ),
  h5: ({ children }: { children: React.ReactNode }) => (
    <h5 className="scroll-m-20 text-lg font-semibold tracking-tight mb-3">
      {children}
    </h5>
  ),
  h6: ({ children }: { children: React.ReactNode }) => (
    <h6 className="scroll-m-20 text-base font-semibold tracking-tight mb-3">
      {children}
    </h6>
  ),
  p: ({ children }: { children: React.ReactNode }) => <p className="leading-7 [&:not(:first-child)]:mt-6 mb-4">{children}</p>,
  ul: ({ children }: { children: React.ReactNode }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
  ol: ({ children }: { children: React.ReactNode }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="mt-6 border-l-2 border-green-500 pl-6 italic text-muted-foreground bg-muted/50 py-2 rounded-r-lg">
      {children}
    </blockquote>
  ),
  pre: ({ children, ...props }: any) => (
    <div className="relative group my-6">
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm font-mono border border-border/50" {...props}>
        {children}
      </pre>
      {typeof children === 'string' && (
        <CopyButton text={children} />
      )}
    </div>
  ),
  code: ({ children, className, ...props }: any) => {
    // For inline code (no className with language)
    if (!className || !className.includes('language-')) {
      return (
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium border border-border/50" {...props}>
          {children}
        </code>
      )
    }
    
    // For code blocks, just return the code element - rehype-highlight will handle styling
    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
  img: ({ src, alt, ...props }: { src?: string; alt?: string; [key: string]: any }) => (
    <Image 
      src={src || ""} 
      alt={alt || ""} 
      width={800} 
      height={400} 
      className="rounded-lg my-6 border border-border/50" 
      {...props} 
    />
  ),
  a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
    <a
      href={href}
      className="font-medium text-green-500 underline underline-offset-4 hover:text-green-400 transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  table: ({ children }: { children: React.ReactNode }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse border border-border/50 rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children: React.ReactNode }) => (
    <thead className="bg-muted/50">
      {children}
    </thead>
  ),
  th: ({ children }: { children: React.ReactNode }) => (
    <th className="border border-border/50 px-4 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }: { children: React.ReactNode }) => (
    <td className="border border-border/50 px-4 py-2">
      {children}
    </td>
  ),
  hr: () => <hr className="my-8 border-border/50" />,
  // Interactive Components
  HillCipher: () => <HillCipher />,
  LawOfLargeNumbers: () => <LawOfLargeNumbers />,
}
