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
import { Download, Eraser, FileImage, FileJson, Moon, RotateCcw, Sun } from "lucide-react"
import {
  COA_ACTIONS,
  COA_KIND_COLOR,
  COA_KIND_LABEL,
  KILL_CHAIN_PHASES,
  coaCellKey,
  seededCoaText,
} from "@/lib/coa-matrix/types"
import { exportRaster, exportSvg } from "@/lib/svg-export"

const ROW_LABEL_WIDTH = 150
const COLUMN_WIDTH = 150
const CELL_HEIGHT = 76
const GAP = 4
const HEADER_HEIGHT = 54
const TITLE_HEIGHT = 44
const PADDING = 20

const PALETTE = [
  { color: "#22c55e", label: "Covered" },
  { color: "#f59e0b", label: "Partial" },
  { color: "#ef4444", label: "Gap" },
  { color: "#94a3b8", label: "Not applicable" },
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
    truncated[maxLines - 1] = truncated[maxLines - 1].replace(/.{0,3}$/, "...")
    return truncated
  }
  return lines
}

function slugify(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "coa-matrix"
  )
}

export function CoaMatrixTool() {
  const [title, setTitle] = useState("Courses of Action Matrix")
  const [cellText, setCellText] = useState<Record<string, string>>(() => seededCoaText())
  const [cellColor, setCellColor] = useState<Record<string, string>>({})
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [activeColor, setActiveColor] = useState(PALETTE[0].color)
  const [erasing, setErasing] = useState(false)
  const [dark, setDark] = useState(false)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const width = PADDING * 2 + ROW_LABEL_WIDTH + COA_ACTIONS.length * (COLUMN_WIDTH + GAP) - GAP
  const height = PADDING * 2 + TITLE_HEIGHT + HEADER_HEIGHT + GAP + KILL_CHAIN_PHASES.length * (CELL_HEIGHT + GAP)

  const palette = dark
    ? { bg: "#0f172a", header: "#1e293b", headerText: "#f8fafc", cell: "#1e293b", cellStroke: "#334155", cellText: "#e2e8f0", muted: "#64748b" }
    : { bg: "#ffffff", header: "#1e293b", headerText: "#ffffff", cell: "#ffffff", cellStroke: "#cbd5e1", cellText: "#0f172a", muted: "#94a3b8" }

  const selectedAction = useMemo(() => {
    if (!selectedKey) return null
    const [actionId] = selectedKey.split("::")
    return COA_ACTIONS.find((a) => a.id === actionId) ?? null
  }, [selectedKey])
  const selectedPhaseIndex = selectedKey ? Number(selectedKey.split("::")[1]) : null

  const handleCellClick = (key: string) => {
    setSelectedKey(key)
    setCellColor((prev) => {
      const next = { ...prev }
      if (erasing) {
        delete next[key]
      } else {
        next[key] = activeColor
      }
      return next
    })
  }

  const handleReset = () => {
    if (typeof window !== "undefined") {
      const ok = window.confirm("Reset the matrix back to the seeded example? Your edits will be lost.")
      if (!ok) return
    }
    setCellText(seededCoaText())
    setCellColor({})
    setSelectedKey(null)
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

        <div className="flex items-center gap-1 rounded-md border border-border/60 p-1">
          {PALETTE.map((swatch) => (
            <button
              key={swatch.color}
              type="button"
              title={swatch.label}
              onClick={() => {
                setActiveColor(swatch.color)
                setErasing(false)
              }}
              className="w-5 h-5 rounded-sm"
              style={{
                backgroundColor: swatch.color,
                outline: !erasing && activeColor === swatch.color ? "2px solid #0ea5e9" : "none",
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="rounded-lg border border-border/60 overflow-x-auto">
          <svg ref={svgRef} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block select-none">
            <rect x={0} y={0} width={width} height={height} fill={palette.bg} />

            <text x={PADDING} y={PADDING + 22} fontSize={18} fontWeight={700} fill={palette.cellText} fontFamily="var(--font-mono, monospace)">
              {title}
            </text>

            {/* Action column headers */}
            {COA_ACTIONS.map((action, colIndex) => {
              const x = PADDING + ROW_LABEL_WIDTH + colIndex * (COLUMN_WIDTH + GAP)
              const y = PADDING + TITLE_HEIGHT
              return (
                <g key={action.id}>
                  <rect x={x} y={y} width={COLUMN_WIDTH} height={HEADER_HEIGHT} rx={6} fill={COA_KIND_COLOR[action.kind]} />
                  <text x={x + COLUMN_WIDTH / 2} y={y + 23} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">
                    {action.name}
                  </text>
                  <text x={x + COLUMN_WIDTH / 2} y={y + 40} textAnchor="middle" fontSize={9} fill="#ffffff" opacity={0.85}>
                    {COA_KIND_LABEL[action.kind]}
                  </text>
                </g>
              )
            })}

            {/* Phase row labels + cells */}
            {KILL_CHAIN_PHASES.map((phase, rowIndex) => {
              const rowY = PADDING + TITLE_HEIGHT + HEADER_HEIGHT + GAP + rowIndex * (CELL_HEIGHT + GAP)
              return (
                <g key={phase}>
                  <rect x={PADDING} y={rowY} width={ROW_LABEL_WIDTH} height={CELL_HEIGHT} rx={6} fill={palette.header} />
                  {wrapText(phase, 16, 3).map((line, i, arr) => (
                    <text
                      key={i}
                      x={PADDING + ROW_LABEL_WIDTH / 2}
                      y={rowY + CELL_HEIGHT / 2 - ((arr.length - 1) * 12) / 2 + i * 12 + 4}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={700}
                      fill={palette.headerText}
                    >
                      {line}
                    </text>
                  ))}

                  {COA_ACTIONS.map((action, colIndex) => {
                    const key = coaCellKey(action.id, rowIndex)
                    const x = PADDING + ROW_LABEL_WIDTH + colIndex * (COLUMN_WIDTH + GAP)
                    const color = cellColor[key]
                    const text = cellText[key] ?? ""
                    const isSelected = selectedKey === key
                    const lines = wrapText(text, 18, 4)
                    return (
                      <g key={key} onClick={() => handleCellClick(key)} style={{ cursor: "pointer" }}>
                        <rect
                          x={x}
                          y={rowY}
                          width={COLUMN_WIDTH}
                          height={CELL_HEIGHT}
                          rx={4}
                          fill={color ?? palette.cell}
                          stroke={isSelected ? "#0ea5e9" : palette.cellStroke}
                          strokeWidth={isSelected ? 2.5 : 1}
                        />
                        {lines.map((line, i) => (
                          <text
                            key={i}
                            x={x + COLUMN_WIDTH / 2}
                            y={rowY + 18 + i * 13}
                            textAnchor="middle"
                            fontSize={10}
                            fill={color ? "#0f172a" : palette.cellText}
                          >
                            {line}
                          </text>
                        ))}
                        {lines.length === 0 && (
                          <text x={x + COLUMN_WIDTH / 2} y={rowY + CELL_HEIGHT / 2 + 4} textAnchor="middle" fontSize={14} fill={palette.muted}>
                            +
                          </text>
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
          {selectedAction && selectedPhaseIndex !== null ? (
            <>
              <div>
                <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">Cell</p>
                <p className="text-sm font-semibold mt-1">
                  {selectedAction.name} &times; {KILL_CHAIN_PHASES[selectedPhaseIndex]}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{selectedAction.blurb}</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="coa-cell-text">Action / control</Label>
                <Textarea
                  id="coa-cell-text"
                  rows={4}
                  placeholder="e.g. AppLocker rule, DNS sinkhole, session TCP reset"
                  value={cellText[selectedKey!] ?? ""}
                  onChange={(e) => setCellText((prev) => ({ ...prev, [selectedKey!]: e.target.value }))}
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Click a cell to describe the control or action for that phase, and paint it with the active color to
              mark coverage status.
            </p>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Run both passive actions (Discover, Detect) every time. Choose exactly one mitigating action per event since
        they exclude each other. Destroy requires legal authority most organizations do not have.
      </p>
    </div>
  )
}
