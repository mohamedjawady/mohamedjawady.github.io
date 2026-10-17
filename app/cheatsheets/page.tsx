import { Suspense } from "react"
import { Metadata } from "next"
import { getAllCheatsheets, getVisibleCheatsheets } from "@/lib/cheatsheets"
import { getCanonicalUrl } from "@/lib/url"
import { CheatsheetsClient } from "./cheatsheets-client"
import { SectionHero } from "@/components/section-hero"

export const metadata: Metadata = {
  title: "Cheatsheets | Mohamed Habib Jaouadi",
  description: "Quick reference guides and cheatsheets for programming, cybersecurity, and development tools.",
  openGraph: {
    title: "Cheatsheets | Mohamed Habib Jaouadi",
    description: "Quick reference guides and cheatsheets for programming, cybersecurity, and development tools.",
    type: "website",
    url: getCanonicalUrl("/cheatsheets"),
    images: {
        url: getCanonicalUrl('/android-chrome-512x512.png'),
      },
  },
  twitter: {
    card: "summary_large_image",
    title: "Cheatsheets | Mohamed Habib Jaouadi",
    description: "Quick reference guides and cheatsheets for programming, cybersecurity, and development tools.",
    images: [getCanonicalUrl('/android-chrome-512x512.png')],
  },
}

export default async function CheatsheetsPage() {
  const cheatsheets = await getVisibleCheatsheets()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SectionHero
        eyebrow="Quick Reference"
        title={
          <>
            <span className="text-emerald-600 dark:text-emerald-400">Cheat</span>sheets
          </>
        }
        description="Quick reference guides to help you work more efficiently. From programming languages to cybersecurity tools, find the information you need at a glance."
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Suspense fallback={<div>Loading cheatsheets...</div>}>
          <CheatsheetsClient cheatsheets={cheatsheets} />
        </Suspense>
      </div>
    </div>
  )
}
