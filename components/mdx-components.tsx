"use client"

import type { MDXComponents } from "mdx/types"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import Image from "next/image"

function CodeBlock({ children, className, ...props }: any) {
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)

  const match = /language-(\w+)/.exec(className || "")
  const language = match ? match[1] : ""

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (match) {
    return (
      <div className="relative group">
        <Button
          size="sm"
          variant="ghost"
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={copyToClipboard}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
        <SyntaxHighlighter
          style={theme === "dark" ? oneDark : oneLight}
          language={language}
          PreTag="div"
          className="rounded-lg"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </div>
    )
  }

  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm" {...props}>
      {children}
    </code>
  )
}

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-4">{children}</h2>
  ),
  h3: ({ children }) => <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">{children}</h3>,
  p: ({ children }) => <p className="leading-7 [&:not(:first-child)]:mt-6 mb-4">{children}</p>,
  ul: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
  ol: ({ children }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-2 border-green-500 pl-6 italic">{children}</blockquote>
  ),
  code: CodeBlock,
  pre: ({ children }) => <pre className="mb-4 mt-6 overflow-x-auto rounded-lg bg-muted p-4">{children}</pre>,
  img: ({ src, alt, ...props }) => (
    <Image src={src || ""} alt={alt || ""} width={800} height={400} className="rounded-lg my-6" {...props} />
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-green-500 underline underline-offset-4 hover:text-green-400 transition-colors"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
}
