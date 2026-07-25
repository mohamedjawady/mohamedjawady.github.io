"use client"

import { useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileImage, FileJson, Moon, RotateCcw, Sun } from "lucide-react"
import { admiraltyCellKey, CREDIBILITY_RATINGS, RELIABILITY_GRADES } from "@/lib/admiralty-code/types"
import { exportRaster, exportSvg } from "@/lib/svg-export"

const ROW_LABEL_WIDTH = 170
const COLUMN_WIDTH = 150
const CELL_HEIGHT = 72
const GAP = 4
const HEADER_HEIGHT = 54
const TITLE_HEIGHT = 44
const PADDING = 20

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "admiralty-code"
  )
}

export function AdmiraltyCodeTool() {
  const [title, setTitle] = useState("Admiralty Code Rating")
  const [selected, setSelected] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [dark, setDark] = useState(false)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const width = PADDING * 2 + ROW_LABEL_WIDTH + CREDIBILITY_RATINGS.length * (COLUMN_WIDTH + GAP) - GAP
  const height = PADDING * 2 + TITLE_HEIGHT + HEADER_HEIGHT + GAP + RELIABILITY_GRADES.length * (CELL_HEIGHT + GAP)

  const palette = dark
    ? { bg: "#0f172a", header: "#1e293b", headerText: "#f8fafc", cell: "#1e293b", cellStroke: "#334155", cellText: "#e2e8f0", muted: "#64748b" }
    : { bg: "#ffffff", header: "#1e293b", headerText: "#ffffff", cell: "#ffffff", cellStroke: "#cbd5e1", cellText: "#0f172a", muted: "#94a3b8" }

  const selectedInfo = useMemo(() => {
    if (!selected) return null
    const reliabilityCode = selected[0]
    const credibilityCode = selected[1]
    const reliability = RELIABILITY_GRADES.find((r) => r.code === reliabilityCode) ?? null
    const credibility = CREDIBILITY_RATINGS.find((c) => c.code === credibilityCode) ?? null
    return { reliability, credibility }
  }, [selected])

  const handleCellClick = (key: string) => {
    setSelected((prev) => (prev === key ? null : key))
  }

  const handleReset = () => {
    if (typeof window !== "undefined" && (selected || Object.keys(notes).length > 0)) {
      const ok = window.confirm("Clear the current selection and all notes?")
      if (!ok) return
    }
    setSelected(null)
    setNotes({})
  }

  const handleExport = async (format: "svg" | "png" | "jpeg") => {
    const svg = svgRef.current
    if (!svg) return
    const filename = `${slugify(title)}.${format}`
    if (format === "svg") {
      exportSvg(svg, filename)
    } else {
      await exportRaster(svg, format, filename, width, height)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="max-w-xs h-9 font-mono text-sm" />

        <Button variant="ghost" size="sm" onClick={() => setDark((d) => !d)}>
          {dark ? <Sun className="w-4 h-4 mr-1.5" /> : <Moon className="w-4 h-4 mr-1.5" />}
          {dark ? "Light" : "Dark"}
        </Button>

        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Reset
        </Button>

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Download className="w-4 h-4 mr-1.5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("svg")}>
                <FileJson className="w-4 h-4 mr-2" />
                SVG (vector)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("png")}>
                <FileImage className="w-4 h-4 mr-2" />
                PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("jpeg")}>
                <FileImage className="w-4 h-4 mr-2" />
                JPEG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        <div className="rounded-lg border border-border/60 overflow-x-auto">
          <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block select-none">
            <rect x={0} y={0} width={width} height={height} fill={palette.bg} />

            <text x={PADDING} y={PADDING + 22} fontSize={18} fontWeight={700} fill={palette.cellText} fontFamily="var(--font-mono, monospace)">
              {title}
            </text>

            {/* Credibility column headers */}
            {CREDIBILITY_RATINGS.map((cred, colIndex) => {
              const x = PADDING + ROW_LABEL_WIDTH + colIndex * (COLUMN_WIDTH + GAP)
              const y = PADDING + TITLE_HEIGHT
              return (
                <g key={cred.code}>
                  <rect x={x} y={y} width={COLUMN_WIDTH} height={HEADER_HEIGHT} rx={6} fill={palette.header} />
                  <text x={x + COLUMN_WIDTH / 2} y={y + 22} textAnchor="middle" fontSize={13} fontWeight={700} fill={palette.headerText}>
                    {cred.code}. {cred.label}
                  </text>
                  <text x={x + COLUMN_WIDTH / 2} y={y + 38} textAnchor="middle" fontSize={9} fill="#94a3b8">
                    Credibility
                  </text>
                </g>
              )
            })}

            {/* Reliability rows + cells */}
            {RELIABILITY_GRADES.map((rel, rowIndex) => {
              const rowY = PADDING + TITLE_HEIGHT + HEADER_HEIGHT + GAP + rowIndex * (CELL_HEIGHT + GAP)
              return (
                <g key={rel.code}>
                  <rect x={PADDING} y={rowY} width={ROW_LABEL_WIDTH} height={CELL_HEIGHT} rx={6} fill={palette.header} />
                  <text x={PADDING + ROW_LABEL_WIDTH / 2} y={rowY + CELL_HEIGHT / 2 - 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={palette.headerText}>
                    {rel.code}. {rel.label}
                  </text>
                  <text x={PADDING + ROW_LABEL_WIDTH / 2} y={rowY + CELL_HEIGHT / 2 + 12} textAnchor="middle" fontSize={9} fill="#94a3b8">
                    Reliability
                  </text>

                  {CREDIBILITY_RATINGS.map((cred, colIndex) => {
                    const key = admiraltyCellKey(rel.code, cred.code)
                    const x = PADDING + ROW_LABEL_WIDTH + colIndex * (COLUMN_WIDTH + GAP)
                    const isSelected = selected === key
                    const hasNote = Boolean(notes[key]?.trim())
                    return (
                      <g key={key} onClick={() => handleCellClick(key)} style={{ cursor: "pointer" }}>
                        <rect
                          x={x}
                          y={rowY}
                          width={COLUMN_WIDTH}
                          height={CELL_HEIGHT}
                          rx={4}
                          fill={isSelected ? "#0ea5e9" : palette.cell}
                          stroke={isSelected ? "#0284c7" : palette.cellStroke}
                          strokeWidth={isSelected ? 2.5 : 1}
                        />
                        <text
                          x={x + COLUMN_WIDTH / 2}
                          y={rowY + CELL_HEIGHT / 2 + 6}
                          textAnchor="middle"
                          fontSize={20}
                          fontWeight={700}
                          fill={isSelected ? "#ffffff" : palette.cellText}
                        >
                          {key}
                        </text>
                        {hasNote && !isSelected && (
                          <circle cx={x + COLUMN_WIDTH - 12} cy={rowY + 12} r={4} fill="#f59e0b" />
                        )}
                      </g>
                    )
                  })}
                </g>
              )
            })}
          </svg>
        </div>

        <div className="rounded-lg border border-border/60 p-4 space-y-4">
          {selectedInfo ? (
            <>
              <div>
                <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold font-mono mt-1">{selected}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wide">
                  {selectedInfo.reliability?.code}. {selectedInfo.reliability?.label}
                </p>
                <p className="text-sm text-muted-foreground">{selectedInfo.reliability?.description}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  {selectedInfo.credibility?.code}. {selectedInfo.credibility?.label}
                </p>
                <p className="text-sm text-muted-foreground">{selectedInfo.credibility?.description}</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="admiralty-notes">Source / notes</Label>
                <Textarea
                  id="admiralty-notes"
                  rows={4}
                  placeholder="What is being rated, and why?"
                  value={notes[selected!] ?? ""}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [selected!]: e.target.value }))}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Click a cell to select a reliability/credibility rating for a piece of intelligence. Its full
              definitions and a notes field will appear here.
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        NATO Admiralty System (STANAG 2511): grade the source&apos;s reliability (A-F) and the information&apos;s
        credibility (1-6) independently, then combine them, e.g. B2, to communicate confidence in a report.
      </p>
    </div>
  )
}
