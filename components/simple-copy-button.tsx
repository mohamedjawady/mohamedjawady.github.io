"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

// Copy button for regular code blocks. Kept in its own "use client" module so
// that mdx-components.tsx (which maps plain markdown tags like h1-h6, p, and
// blockquote for next-mdx-remote/rsc) can stay a server module. A "use client"
// directive on that file turns every one of its exports, including the plain
// tag-override functions, into client references, which next-mdx-remote's
// hand-rolled MDX runtime silently fails to apply to intrinsic elements.
export function SimpleCopyButton({ text }: { text: string }) {
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
      className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={copyToClipboard}
      title={copied ? "Copied!" : "Copy code"}
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </Button>
  )
}
