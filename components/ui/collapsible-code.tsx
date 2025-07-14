"use client"

import React, { useState, ReactNode } from "react"
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface CollapsibleCodeProps {
  children: ReactNode
  language?: string
  title?: string
  defaultOpen?: boolean | string
  showCopy?: boolean | string
  className?: string
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-7 w-7 p-0 hover:bg-muted-foreground/20"
      onClick={copyToClipboard}
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </Button>
  )
}

export function CollapsibleCode({ 
  children, 
  language, 
  title, 
  defaultOpen = false, 
  showCopy = true,
  className = ""
}: CollapsibleCodeProps) {
  // Handle string boolean props from MDX
  const isDefaultOpen = typeof defaultOpen === 'string' ? defaultOpen === 'true' : defaultOpen
  const shouldShowCopy = typeof showCopy === 'string' ? showCopy === 'true' : showCopy
  
  const [isOpen, setIsOpen] = useState(isDefaultOpen)
  
  // Extract text content for copy functionality
  const getTextContent = (node: ReactNode): string => {
    if (typeof node === 'string') return node
    if (typeof node === 'number') return node.toString()
    if (React.isValidElement(node)) {
      return React.Children.toArray((node.props as any).children)
        .map(getTextContent)
        .join('')
    }
    if (Array.isArray(node)) {
      return node.map(getTextContent).join('')
    }
    return ''
  }

  const codeText = getTextContent(children)
  const displayTitle = title || (language ? `${language.charAt(0).toUpperCase() + language.slice(1)} Code` : 'Code')

  return (
    <div className={`my-6 border border-border/50 rounded-lg overflow-hidden ${className}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-3 bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer border-b border-border/50">
            <div className="flex items-center gap-2">
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium text-foreground">
                {displayTitle}
              </span>
              {language && (
                <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                  {language}
                </span>
              )}
            </div>
            {shouldShowCopy && isOpen && (
              <div onClick={(e) => e.stopPropagation()}>
                <CopyButton text={codeText} />
              </div>
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="relative">
            <pre className="overflow-x-auto bg-background p-4 text-sm font-mono">
              {children}
            </pre>
            {shouldShowCopy && !isOpen && (
              <div className="absolute top-2 right-2">
                <CopyButton text={codeText} />
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
