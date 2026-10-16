"use client"

import { useMemo, useState } from "react"
import { Copy, Check, Terminal, Database, TableProperties } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { SPL_COMMANDS, SPL_GROUPS, type SplVariant } from "@/lib/spl-builder"

function DataTable({ table, accent }: { table: { fields: string[]; rows: string[][] }; accent?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className={cn("border-b border-border", accent ? "bg-emerald-500/10" : "bg-muted/40")}>
            {table.fields.map((f) => (
              <th key={f} className="px-3 py-2 text-left font-semibold text-foreground whitespace-nowrap">
                {f}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-border/50 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                  {cell === "" ? <span className="text-muted-foreground/40">(blank)</span> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function SplBuilder() {
  const [commandId, setCommandId] = useState(SPL_COMMANDS[0].id)
  const [variantId, setVariantId] = useState(SPL_COMMANDS[0].variants[0].id)
  const [copied, setCopied] = useState(false)

  const command = useMemo(() => SPL_COMMANDS.find((c) => c.id === commandId)!, [commandId])
  const variant: SplVariant = useMemo(
    () => command.variants.find((v) => v.id === variantId) ?? command.variants[0],
    [command, variantId],
  )

  const fullSpl = `${variant.sourceLine}\n${variant.spl}`

  function selectCommand(id: string) {
    setCommandId(id)
    const next = SPL_COMMANDS.find((c) => c.id === id)!
    setVariantId(next.variants[0].id)
  }

  function copySpl() {
    navigator.clipboard.writeText(fullSpl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      {/* Command picker */}
      <div className="space-y-5">
        {SPL_GROUPS.map((group) => {
          const groupCommands = SPL_COMMANDS.filter((c) => c.group === group)
          if (groupCommands.length === 0) return null
          return (
            <div key={group}>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">{group}</div>
              <div className="flex flex-wrap gap-1.5">
                {groupCommands.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectCommand(c.id)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md text-sm font-mono border transition-colors",
                      c.id === commandId
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-border bg-muted/20 text-muted-foreground hover:border-emerald-500/40 hover:text-foreground",
                    )}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Generated example */}
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold font-mono">{command.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">{command.summary}</p>
        </div>

        {command.variants.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {command.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setVariantId(v.id)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm border transition-colors text-left",
                  v.id === variant.id
                    ? "border-emerald-500 bg-emerald-500/10 text-foreground"
                    : "border-border bg-muted/20 text-muted-foreground hover:border-emerald-500/40",
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground">{variant.description}</p>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <Terminal className="w-3.5 h-3.5" />
              Generated SPL
            </div>
            <button
              onClick={copySpl}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-emerald-500 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="rounded-md border border-border bg-muted/30 p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
            {fullSpl}
          </pre>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
            <Database className="w-3.5 h-3.5" />
            Shape of the index data
          </div>
          <DataTable table={variant.input} />
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
            <TableProperties className="w-3.5 h-3.5" />
            What the command shows
          </div>
          <DataTable table={variant.output} accent />
        </div>

        {variant.note && (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-muted-foreground">
            <Badge variant="outline" className="mr-2 text-xs border-amber-500/50 text-amber-600 dark:text-amber-400">
              Note
            </Badge>
            {variant.note}
          </div>
        )}
      </div>
    </div>
  )
}
