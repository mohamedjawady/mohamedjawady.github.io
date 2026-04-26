import { Suspense } from "react"
import { Metadata } from "next"
import { getAllCheatsheets, getVisibleCheatsheets } from "@/lib/cheatsheets"
import { getCanonicalUrl } from "@/lib/url"
import { CheatsheetsClient } from "./cheatsheets-client"
import { HeroBackground } from "@/components/hero-background"

export const metadata: Metadata = {
  title: "Cheatsheets | 0xHabib",
  description: "Quick reference guides and cheatsheets for programming, cybersecurity, and development tools.",
  openGraph: {
    title: "Cheatsheets | 0xHabib",
    description: "Quick reference guides and cheatsheets for programming, cybersecurity, and development tools.",
    type: "website",
    url: getCanonicalUrl("/cheatsheets"),
    images: {
        url: `${getCanonicalUrl('/api/og/cheatsheet')}?title=Quick Reference Guides&description=Programming, cybersecurity, and development cheatsheets for efficient work&category=reference&difficulty=all&author=0xHabib&tags=programming,cybersecurity,development`,
      },
  },
  twitter: {
    card: "summary_large_image",
    title: "Cheatsheets | 0xHabib",
    description: "Quick reference guides and cheatsheets for programming, cybersecurity, and development tools.",
    images: [`${getCanonicalUrl('/api/og/cheatsheet')}?title=Quick Reference Guides&description=Programming, cybersecurity, and development cheatsheets for efficient work&category=reference&difficulty=all&author=0xHabib&tags=programming,cybersecurity,development`],
  },
}

export default async function CheatsheetsPage() {
  const cheatsheets = await getVisibleCheatsheets()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden border-b border-border/20">
        <HeroBackground />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">

          
          <h1 className="text-4xl md:text-6xl font-bold font-mono tracking-tighter mb-6">
            <span className="text-emerald-500">Cheat</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-muted-foreground to-foreground">
              sheets
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Quick reference guides and cheatsheets to help you work more efficiently. 
            From programming languages to cybersecurity tools, find the information you need at a glance.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Suspense fallback={<div>Loading cheatsheets...</div>}>
          <CheatsheetsClient cheatsheets={cheatsheets} />
        </Suspense>
      </div>
    </div>
  )
}
