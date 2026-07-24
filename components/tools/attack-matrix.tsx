"use client"

import { useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, Eraser, FileImage, FileJson, Moon, RotateCcw, Search, Sun } from "lucide-react"
import { ATTACK_TACTICS, ATTACK_TECHNIQUES, cellKey, techniquesForTactic } from "@/lib/attack-matrix/types"
import { exportRaster, exportSvg } from "@/lib/svg-export"

const COLUMN_WIDTH = 172
const COLUMN_GAP = 6
const CELL_HEIGHT = 42
const CELL_GAP = 4
const HEADER_HEIGHT = 50
const TITLE_HEIGHT = 44
const PADDING = 20

const PALETTE = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
]

function wrapText(label: string, maxChars: number, maxLines: number): string[] {
  const words = label.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  if (lines.length > maxLines) {
    const truncated = lines.slice(0, maxLines)
    truncated[maxLines - 1] = truncated[maxLines - 1].replace(/.{0,3}$/, "…")
    return truncated
  }
  return lines
}

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "attack-matrix"
  )
}

export function AttackMatrix() {
  const [title, setTitle] = useState("ATT&CK Technique Coverage")
  const [colors, setColors] = useState<Record<string, string>>({})
  const [activeColor, setActiveColor] = useState(PALETTE[0])
  const [erasing, setErasing] = useState(false)
  const [search, setSearch] = useState("")
  const [dark, setDark] = useState(false)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const columns = useMemo(
    () => ATTACK_TACTICS.map((tactic) => ({ tactic, techniques: techniquesForTactic(tactic.shortname) })),
    []
  )
  const maxRows = useMemo(() => Math.max(...columns.map((c) => c.techniques.length)), [columns])

  const width = PADDING * 2 + columns.length * COLUMN_WIDTH + (columns.length - 1) * COLUMN_GAP
  const height = PADDING * 2 + TITLE_HEIGHT + HEADER_HEIGHT + maxRows * (CELL_HEIGHT + CELL_GAP)

  const palette = dark
    ? { bg: "#0f172a", header: "#1e293b", headerText: "#f8fafc", cell: "#1e293b", cellStroke: "#334155", cellText: "#e2e8f0", muted: "#64748b" }
    : { bg: "#ffffff", header: "#1e293b", headerText: "#ffffff", cell: "#ffffff", cellStroke: "#cbd5e1", cellText: "#0f172a", muted: "#94a3b8" }

  const query = search.trim().toLowerCase()
  const matches = (id: string, name: string) =>
    query.length === 0 || id.toLowerCase().includes(query) || name.toLowerCase().includes(query)

  const handleCellClick = (key: string) => {
    setColors((prev) => {
      const next = { ...prev }
      if (erasing || next[key] === activeColor) {
        delete next[key]
      } else {
        next[key] = activeColor
      }
      return next
    })
  }

  const handleReset = () => {
    if (typeof window !== "undefined" && Object.keys(colors).length > 0) {
      const ok = window.confirm("Clear all coloring on this matrix?")
      if (!ok) return
    }
    setColors({})
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
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="max-w-xs h-9 font-mono text-sm"
        />

        <div className="flex items-center gap-1 rounded-md border border-border/60 p-1">
          {PALETTE.map((color) => (
            <button
              key={color}
              type="button"
              title={`Paint with ${color}`}
              onClick={() => {
                setActiveColor(color)
                setErasing(false)
              }}
              className="w-5 h-5 rounded-sm"
              style={{
                backgroundColor: color,
                outline: !erasing && activeColor === color ? "2px solid #0ea5e9" : "none",
                outlineOffset: 1,
              }}
            />
          ))}
          <Button
            variant={erasing ? "default" : "ghost"}
            size="icon"
            className="h-6 w-6"
            title="Eraser"
            onClick={() => setErasing((e) => !e)}
          >
            <Eraser className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search technique or ID"
            className="h-9 pl-8 w-56"
          />
        </div>

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

      <div className="rounded-lg border border-border/60 overflow-x-auto">
        <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block select-none">
          <rect x={0} y={0} width={width} height={height} fill={palette.bg} />

          <text x={PADDING} y={PADDING + 22} fontSize={18} fontWeight={700} fill={palette.cellText} fontFamily="var(--font-mono, monospace)">
            {title}
          </text>

          {columns.map((col, colIndex) => {
            const x = PADDING + colIndex * (COLUMN_WIDTH + COLUMN_GAP)
            const headerY = PADDING + TITLE_HEIGHT
            return (
              <g key={col.tactic.shortname}>
                <rect x={x} y={headerY} width={COLUMN_WIDTH} height={HEADER_HEIGHT} rx={6} fill={palette.header} />
                <text
                  x={x + COLUMN_WIDTH / 2}
                  y={headerY + 20}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={700}
                  fill={palette.headerText}
                >
                  {col.tactic.name}
                </text>
                <text x={x + COLUMN_WIDTH / 2} y={headerY + 37} textAnchor="middle" fontSize={10} fill="#94a3b8">
                  {col.techniques.length} techniques
                </text>

                {col.techniques.map((tech, rowIndex) => {
                  const key = cellKey(tech.id, col.tactic.shortname)
                  const y = headerY + HEADER_HEIGHT + CELL_GAP + rowIndex * (CELL_HEIGHT + CELL_GAP)
                  const color = colors[key]
                  const isMatch = matches(tech.id, tech.name)
                  const lines = wrapText(tech.name, 22, 2)
                  return (
                    <g
                      key={key}
                      onClick={() => handleCellClick(key)}
                      style={{ cursor: "pointer", opacity: isMatch ? 1 : 0.3 }}
                    >
                      <rect
                        x={x}
                        y={y}
                        width={COLUMN_WIDTH}
                        height={CELL_HEIGHT}
                        rx={4}
                        fill={color ?? palette.cell}
                        stroke={isMatch && query ? "#0ea5e9" : palette.cellStroke}
                        strokeWidth={isMatch && query ? 2 : 1}
                      />
                      <text
                        x={x + 8}
                        y={y + 14}
                        fontSize={9.5}
                        fontWeight={700}
                        fill={color ? "#0f172a" : palette.muted}
                        fontFamily="var(--font-mono, monospace)"
                      >
                        {tech.id}
                      </text>
                      {tech.subCount ? (
                        <text x={x + COLUMN_WIDTH - 8} y={y + 14} textAnchor="end" fontSize={9} fill={color ? "#0f172a" : palette.muted}>
                          +{tech.subCount}
                        </text>
                      ) : null}
                      {lines.map((line, i) => (
                        <text
                          key={i}
                          x={x + 8}
                          y={y + 27 + i * 11}
                          fontSize={10}
                          fill={color ? "#0f172a" : palette.cellText}
                        >
                          {line}
                        </text>
                      ))}
                    </g>
                  )
                })}
              </g>
            )
          })}
        </svg>
      </div>

      <p className="text-xs text-muted-foreground">
        {ATTACK_TECHNIQUES.length} top-level techniques across {ATTACK_TACTICS.length} tactics. Click a cell to paint
        it with the active color; click a painted cell again to clear it. Sub-technique counts are shown as +N.
      </p>
    </div>
  )
}
