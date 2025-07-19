import { Suspense } from "react"
import { Metadata } from "next"
import { getAllCheatsheets, getVisibleCheatsheets } from "@/lib/cheatsheets"
import { CheatsheetsClient } from "./cheatsheets-client"

export const metadata: Metadata = {
  title: "Cheatsheets | 0xHabib",
  description: "Quick reference guides and cheatsheets for programming, cybersecurity, and development tools.",
  openGraph: {
    title: "Cheatsheets | 0xHabib",
    description: "Quick reference guides and cheatsheets for programming, cybersecurity, and development tools.",
    type: "website",
  },
}

export default async function CheatsheetsPage() {
  const cheatsheets = await getVisibleCheatsheets()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
          Cheatsheets
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Quick reference guides and cheatsheets to help you work more efficiently. 
          From programming languages to cybersecurity tools, find the information you need at a glance.
        </p>
      </div>

      <Suspense fallback={<div>Loading cheatsheets...</div>}>
        <CheatsheetsClient cheatsheets={cheatsheets} />
      </Suspense>
    </div>
  )
}
