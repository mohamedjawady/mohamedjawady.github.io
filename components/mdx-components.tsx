"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HillCipher } from "@/components/visualizations/hill-cipher"
import { WindowsProtectionHierarchy } from "@/components/visualizations/windows-protection-hierarchy"
import { LawOfLargeNumbers } from "@/components/visualizations/law-of-large-numbers"
import { MalwareDetectionMechanisms } from "@/components/visualizations/malware-detection-mechanisms"
import { DNSResolution } from "@/components/visualizations/dns-resolution"
import { C2JitterAndSleep } from "@/components/visualizations/c2-jitter-and-sleep"
import { ProcessMemoryMap } from "@/components/visualizations/process-memory-map"
import { C2InfrastructureMap } from "@/components/visualizations/c2-infrastructure-map"
import { MalwareC2Lifecycle } from "@/components/visualizations/malware-c2-lifecycle"
import { Win32MessageLoop } from "@/components/visualizations/win32-message-loop"
import { ThreadSynchronization } from "@/components/visualizations/thread-synchronization"
import { PEHeaderViewer } from "@/components/visualizations/pe-header-viewer"
import { ExportTableWalker } from "@/components/visualizations/export-table-walker"
import { ProtectedProcessBypass } from "@/components/visualizations/protected-process-bypass"
import { ChomskySecurityHierarchy } from "@/components/visualizations/chomsky-security-hierarchy"
import { FiniteAutomatonVisualizer } from "@/components/visualizations/finite-automaton-visualizer"
import { PushdownAutomatonVisualizer } from "@/components/visualizations/pushdown-automaton-visualizer"
import { LanguageHierarchyVenn } from "@/components/visualizations/language-hierarchy-venn"
import { LinuxSystemCallsCheatsheet } from "@/components/cheatsheets/linux-system-calls"
import GdbDebuggingCheatsheet from "@/components/cheatsheets/gdb-debugging"
import { CollapsibleCode } from "@/components/ui/collapsible-code"
import { LinkPreview } from "@/components/link-preview"
import { shouldBeCollapsible, shouldBeExpandedByDefault } from "@/lib/code-block-config"

// Simple copy button component for regular code blocks
function SimpleCopyButton({ text }: { text: string }) {
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
  pre: ({ children, ...props }: any) => {
    // Extract language and content from the code element if present
    const codeElement = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.type === 'code'
    ) as React.ReactElement<any> | undefined

    const className = codeElement?.props?.className as string | undefined
    const language = className?.replace('language-', '') || undefined
    const content = typeof codeElement?.props?.children === 'string'
      ? codeElement.props.children
      : ''

    // Determine if this code block should be collapsible
    const isCollapsible = shouldBeCollapsible(language, content)
    const defaultOpen = isCollapsible ? shouldBeExpandedByDefault(language) : true

    // If not collapsible, render as regular code block
    if (!isCollapsible) {
      return (
        <div className="relative group my-6">
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm font-mono border border-border/50" {...props}>
            {children}
          </pre>
          {content && <SimpleCopyButton text={content} />}
        </div>
      )
    }

    // Render as collapsible code block
    return (
      <CollapsibleCode
        language={language}
        defaultOpen={defaultOpen}
        showCopy={true}
      >
        <code {...(codeElement?.props || {})}>
          {codeElement?.props?.children || children}
        </code>
      </CollapsibleCode>
    )
  },
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
  img: ({ src, alt, ...props }: { src?: string; alt?: string;[key: string]: any }) => (
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
    <LinkPreview href={href || "#"}>
      {children}
    </LinkPreview>
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
  WindowsProtectionHierarchy: () => <WindowsProtectionHierarchy />,
  LawOfLargeNumbers: () => <LawOfLargeNumbers />,
  MalwareDetectionMechanisms: () => <MalwareDetectionMechanisms />,
  DNSResolution: () => <DNSResolution />,
  C2JitterAndSleep: () => <C2JitterAndSleep />,
  ProcessMemoryMap: () => <ProcessMemoryMap />,
  C2InfrastructureMap: () => <C2InfrastructureMap />,
  MalwareC2Lifecycle: () => <MalwareC2Lifecycle />,
  Win32MessageLoop: () => <Win32MessageLoop />,
  ThreadSynchronization: () => <ThreadSynchronization />,
  PEHeaderViewer: () => <PEHeaderViewer />,
  ExportTableWalker: () => <ExportTableWalker />,
  ProtectedProcessBypass: () => <ProtectedProcessBypass />,
  ChomskySecurityHierarchy: () => <ChomskySecurityHierarchy />,
  FiniteAutomatonVisualizer: () => <FiniteAutomatonVisualizer />,
  PushdownAutomatonVisualizer: () => <PushdownAutomatonVisualizer />,
  LanguageHierarchyVenn: () => <LanguageHierarchyVenn />,
  // Cheatsheet Components
  LinuxSystemCallsCheatsheet: () => <LinuxSystemCallsCheatsheet />,
  GdbDebuggingCheatsheet: () => <GdbDebuggingCheatsheet />,
  // Custom collapsible code component for manual use
  CollapsibleCode: CollapsibleCode,
}
