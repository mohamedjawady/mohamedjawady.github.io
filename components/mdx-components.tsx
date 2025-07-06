"use client"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark, oneLight, vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useTheme } from "next-themes"
import { Copy, Check, FileCode, Terminal as TerminalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import Image from "next/image"
import { HillCipher } from "@/components/visualizations/hill-cipher"

// Get language display name and icon
const getLanguageInfo = (lang: string) => {
  const languageMap: Record<string, { name: string; icon: string; color: string }> = {
    'javascript': { name: 'JavaScript', icon: '🟨', color: 'bg-yellow-500' },
    'typescript': { name: 'TypeScript', icon: '🔷', color: 'bg-blue-500' },
    'python': { name: 'Python', icon: '🐍', color: 'bg-green-500' },
    'go': { name: 'Go', icon: '🐹', color: 'bg-cyan-500' },
    'rust': { name: 'Rust', icon: '🦀', color: 'bg-orange-500' },
    'bash': { name: 'Bash', icon: '🐚', color: 'bg-gray-500' },
    'shell': { name: 'Shell', icon: '💻', color: 'bg-gray-500' },
    'c': { name: 'C', icon: '⚡', color: 'bg-blue-600' },
    'cpp': { name: 'C++', icon: '⚡', color: 'bg-blue-600' },
    'java': { name: 'Java', icon: '☕', color: 'bg-red-500' },
    'json': { name: 'JSON', icon: '📄', color: 'bg-gray-600' },
    'yaml': { name: 'YAML', icon: '📋', color: 'bg-red-400' },
    'sql': { name: 'SQL', icon: '🗃️', color: 'bg-orange-600' },
    'yara': { name: 'YARA', icon: '🛡️', color: 'bg-purple-500' },
    'powershell': { name: 'PowerShell', icon: '💙', color: 'bg-blue-700' },
  }
  
  return languageMap[lang.toLowerCase()] || { name: lang.toUpperCase(), icon: '📝', color: 'bg-gray-500' }
}

// Extract text from React children (same logic as before)
const extractTextFromChildren = (children: any): string => {
  let text = ''
  
  if (typeof children === 'string') {
    text = children
  } else if (Array.isArray(children)) {
    text = children.map(child => typeof child === 'string' ? child : '').join('')
  } else if (children && typeof children === 'object' && children.props) {
    text = children.props.children || ''
  } else {
    text = String(children)
  }
  
  return text
}

function CodeBlock({ children, className, ...props }: any) {
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)

  const match = /language-(\w+)/.exec(className || "")
  const language = match ? match[1] : ""

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(String(children).replace(/\n$/, ""))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (match) {
    const langInfo = getLanguageInfo(language)
    
    return (
      <div className="relative group my-6">
        {/* Header with language info and copy button */}
        <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-t-lg border border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-lg">{langInfo.icon}</span>
            <Badge variant="secondary" className={`text-xs font-medium ${langInfo.color} text-white`}>
              {langInfo.name}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 hover:bg-background/80"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          </Button>
        </div>
        
        {/* Code content */}
        <div className="relative overflow-hidden rounded-b-lg border border-t-0 border-border/50">
          <SyntaxHighlighter
            style={theme === "dark" ? vscDarkPlus : vs}
            language={language}
            PreTag="div"
            showLineNumbers={true}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              color: 'var(--colors-muted-foreground)',
              borderRight: '1px solid var(--colors-border)',
              marginRight: '1em',
              userSelect: 'none'
            }}
            codeTagProps={{
              style: {
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }
            }}
            customStyle={{
              margin: 0,
              padding: '1rem',
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      </div>
    )
  }

  return (
    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium border border-border/50" {...props}>
      {children}
    </code>
  )
}

export const mdxComponents = {
  h1: ({ children }) => (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="scroll-m-20 border-b border-border/20 pb-2 text-3xl font-semibold tracking-tight mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-3">
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className="scroll-m-20 text-lg font-semibold tracking-tight mb-3">
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className="scroll-m-20 text-base font-semibold tracking-tight mb-3">
      {children}
    </h6>
  ),
  p: ({ children }) => <p className="leading-7 [&:not(:first-child)]:mt-6 mb-4">{children}</p>,
  ul: ({ children }) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>,
  ol: ({ children }) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-2 border-green-500 pl-6 italic text-muted-foreground bg-muted/50 py-2 rounded-r-lg">
      {children}
    </blockquote>
  ),
  pre: ({ children, className, ...props }: any) => {
    // For MDX Remote, the className is often on the pre element
    if (className && className.includes('language-')) {
      return <CodeBlock className={className}>{children}</CodeBlock>
    }
    
    // Check if children is a code element with className
    if (children && typeof children === 'object' && children.props) {
      const codeProps = children.props
      if (codeProps.className && codeProps.className.includes('language-')) {
        return <CodeBlock className={codeProps.className}>{codeProps.children}</CodeBlock>
      }
    }
    
    // Fallback for regular pre elements
    return (
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm font-mono" {...props}>
        {children}
      </pre>
    )
  },
  code: ({ children, className, ...props }: any) => {
    // Handle fenced code blocks that come directly as code elements
    if (className && className.includes('language-')) {
      return <CodeBlock className={className}>{children}</CodeBlock>
    }
    
    // Handle inline code
    return (
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium border border-border/50" {...props}>
        {children}
      </code>
    )
  },
  img: ({ src, alt, ...props }) => (
    <Image 
      src={src || ""} 
      alt={alt || ""} 
      width={800} 
      height={400} 
      className="rounded-lg my-6 border border-border/50" 
      {...props} 
    />
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
  table: ({ children }) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className="w-full border-collapse border border-border/50 rounded-lg overflow-hidden">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted/50">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="border border-border/50 px-4 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border/50 px-4 py-2">
      {children}
    </td>
  ),
  hr: () => <hr className="my-8 border-border/50" />,
  // Interactive Components
  HillCipher: () => <HillCipher />,
}
