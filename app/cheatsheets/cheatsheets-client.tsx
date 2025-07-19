"use client"

import { useState } from "react"
import { CheatsheetCard } from "@/components/cheatsheet-card"
import { CheatsheetsFilter } from "@/components/cheatsheets-filter"
import type { Cheatsheet } from "@/lib/cheatsheets"

interface CheatsheetsClientProps {
  cheatsheets: Cheatsheet[]
}

export function CheatsheetsClient({ cheatsheets }: CheatsheetsClientProps) {
  const [filteredCheatsheets, setFilteredCheatsheets] = useState<Cheatsheet[]>(cheatsheets)

  return (
    <>
      <CheatsheetsFilter
        cheatsheets={cheatsheets}
        onFilter={setFilteredCheatsheets}
      />

      {filteredCheatsheets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No cheatsheets found matching your criteria.</p>
          <p className="text-muted-foreground text-sm mt-2">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCheatsheets.map((cheatsheet) => (
            <CheatsheetCard key={cheatsheet.id} cheatsheet={cheatsheet} />
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        Showing {filteredCheatsheets.length} of {cheatsheets.length} cheatsheets
      </div>
    </>
  )
}
