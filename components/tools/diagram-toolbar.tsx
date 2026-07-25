"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CANVAS_SIZE_PRESETS, DiagramMode, MAX_CANVAS_SIZE, MIN_CANVAS_SIZE, NodeKind } from "@/lib/diagram-builder/types"
import { DIAGRAM_THEMES } from "@/lib/diagram-builder/themes"
import {
  Cable,
  Crosshair,
  Download,
  FileImage,
  FileJson,
  Gem,
  GitMerge,
  Maximize2,
  Network,
  Plus,
  RefreshCw,
  RotateCcw,
  Shield,
  Swords,
  Trash2,
  TreeDeciduous,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DiagramToolbarProps {
  mode: DiagramMode
  showModeSelect?: boolean
  connectMode: boolean
  hasSelection: boolean
  themeId: string
  canvasWidth: number
  canvasHeight: number
  onModeChange: (mode: DiagramMode) => void
  onAddNode: (kind: NodeKind) => void
  onInsertBlock: (block: "diamond-model" | "kill-chain" | "unified-kill-chain" | "attack-tree" | "ooda" | "f3ead" | "bow-tie") => void
  onToggleConnect: () => void
  onDeleteSelected: () => void
  onReset: () => void
  onAutoLayout: () => void
  onExport: (format: "svg" | "png" | "jpeg") => void
  onThemeChange: (id: string) => void
  onResizeCanvas: (width: number, height: number) => void
}

function CanvasSizeControl({
  canvasWidth,
  canvasHeight,
  onResizeCanvas,
}: {
  canvasWidth: number
  canvasHeight: number
  onResizeCanvas: (width: number, height: number) => void
}) {
  const [widthText, setWidthText] = useState(String(canvasWidth))
  const [heightText, setHeightText] = useState(String(canvasHeight))

  useEffect(() => {
    setWidthText(String(canvasWidth))
    setHeightText(String(canvasHeight))
  }, [canvasWidth, canvasHeight])

  const commit = () => {
    const width = Number(widthText)
    const height = Number(heightText)
    onResizeCanvas(Number.isFinite(width) ? width : canvasWidth, Number.isFinite(height) ? height : canvasHeight)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" title="Resize canvas">
          <Maximize2 className="w-4 h-4 mr-1.5" />
          Size
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 space-y-3">
        <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">Canvas Size</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-1">
            <Label htmlFor="canvas-width" className="text-xs">Width</Label>
            <Input
              id="canvas-width"
              type="number"
              min={MIN_CANVAS_SIZE}
              max={MAX_CANVAS_SIZE}
              value={widthText}
              onChange={(e) => setWidthText(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => e.key === "Enter" && commit()}
              className="h-8"
            />
          </div>
          <div className="flex-1 space-y-1">
            <Label htmlFor="canvas-height" className="text-xs">Height</Label>
            <Input
              id="canvas-height"
              type="number"
              min={MIN_CANVAS_SIZE}
              max={MAX_CANVAS_SIZE}
              value={heightText}
              onChange={(e) => setHeightText(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => e.key === "Enter" && commit()}
              className="h-8"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CANVAS_SIZE_PRESETS.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onResizeCanvas(preset.width, preset.height)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Resizes the exportable page, existing nodes keep their position.
        </p>
      </PopoverContent>
    </Popover>
  )
}

const ADD_NODE_OPTIONS: { kind: NodeKind; label: string }[] = [
  { kind: "kill-chain", label: "Kill Chain Phase" },
  { kind: "adversary", label: "Adversary" },
  { kind: "capability", label: "Capability" },
  { kind: "infrastructure", label: "Infrastructure" },
  { kind: "victim", label: "Victim" },
  { kind: "attack-root", label: "Attack Goal (root)" },
  { kind: "attack-node", label: "Attack Step" },
  { kind: "custom", label: "Custom Node" },
]

export function DiagramToolbar({
  mode,
  showModeSelect = true,
  connectMode,
  hasSelection,
  themeId,
  canvasWidth,
  canvasHeight,
  onModeChange,
  onAddNode,
  onInsertBlock,
  onToggleConnect,
  onDeleteSelected,
  onReset,
  onAutoLayout,
  onExport,
  onThemeChange,
  onResizeCanvas,
}: DiagramToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
      {showModeSelect && (
        <>
          <Select value={mode} onValueChange={(v) => onModeChange(v as DiagramMode)}>
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kill-chain">Kill Chain</SelectItem>
              <SelectItem value="diamond-model">Diamond Model</SelectItem>
              <SelectItem value="hybrid">Hybrid (Both)</SelectItem>
              <SelectItem value="unified-kill-chain">Unified Kill Chain</SelectItem>
              <SelectItem value="attack-tree">Attack Tree</SelectItem>
              <SelectItem value="ooda">OODA Loop</SelectItem>
              <SelectItem value="f3ead">F3EAD Cycle</SelectItem>
              <SelectItem value="bow-tie">Bow-Tie Diagram</SelectItem>
              <SelectItem value="blank">Blank Canvas</SelectItem>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-6" />
        </>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Single node</DropdownMenuLabel>
          {ADD_NODE_OPTIONS.map((opt) => (
            <DropdownMenuItem key={opt.kind} onClick={() => onAddNode(opt.kind)}>
              {opt.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Insert full block</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onInsertBlock("diamond-model")}>
            <Gem className="w-4 h-4 mr-2" />
            Diamond Model (4 nodes)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsertBlock("kill-chain")}>
            <Swords className="w-4 h-4 mr-2" />
            Kill Chain (7 phases)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsertBlock("unified-kill-chain")}>
            <GitMerge className="w-4 h-4 mr-2" />
            Unified Kill Chain (18 phases)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsertBlock("attack-tree")}>
            <TreeDeciduous className="w-4 h-4 mr-2" />
            Attack Tree (example)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsertBlock("ooda")}>
            <RefreshCw className="w-4 h-4 mr-2" />
            OODA Loop (4 phases)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsertBlock("f3ead")}>
            <Crosshair className="w-4 h-4 mr-2" />
            F3EAD Cycle (6 phases)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsertBlock("bow-tie")}>
            <Shield className="w-4 h-4 mr-2" />
            Bow-Tie Diagram (example)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant={connectMode ? "default" : "outline"} size="sm" onClick={onToggleConnect}>
        <Cable className="w-4 h-4 mr-1.5" />
        {connectMode ? "Connecting…" : "Connect"}
      </Button>

      <Button variant="outline" size="sm" onClick={onAutoLayout} title="Lay out selected structure as a tree by following connectors from root to leaves">
        <Network className="w-4 h-4 mr-1.5" />
        Auto Layout
      </Button>

      <Button variant="outline" size="sm" onClick={onDeleteSelected} disabled={!hasSelection}>
        <Trash2 className="w-4 h-4 mr-1.5" />
        Delete
      </Button>

      <Button variant="ghost" size="sm" onClick={onReset}>
        <RotateCcw className="w-4 h-4 mr-1.5" />
        Reset
      </Button>

      <CanvasSizeControl canvasWidth={canvasWidth} canvasHeight={canvasHeight} onResizeCanvas={onResizeCanvas} />

      <div className="ml-auto flex items-center gap-2">
        <Select value={themeId} onValueChange={onThemeChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            {DIAGRAM_THEMES.map((theme) => (
              <SelectItem key={theme.id} value={theme.id}>
                {theme.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm">
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport("svg")}>
              <FileJson className="w-4 h-4 mr-2" />
              SVG (vector)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("png")}>
              <FileImage className="w-4 h-4 mr-2" />
              PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("jpeg")}>
              <FileImage className="w-4 h-4 mr-2" />
              JPEG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
