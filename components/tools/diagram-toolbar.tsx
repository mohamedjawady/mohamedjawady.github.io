"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { DiagramMode, NodeKind } from "@/lib/diagram-builder/types"
import { DIAGRAM_THEMES } from "@/lib/diagram-builder/themes"
import {
  Cable,
  Download,
  FileImage,
  FileJson,
  Gem,
  GitMerge,
  Plus,
  RotateCcw,
  Swords,
  Trash2,
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
  connectMode: boolean
  hasSelection: boolean
  themeId: string
  onModeChange: (mode: DiagramMode) => void
  onAddNode: (kind: NodeKind) => void
  onInsertBlock: (block: "diamond-model" | "kill-chain" | "unified-kill-chain") => void
  onToggleConnect: () => void
  onDeleteSelected: () => void
  onReset: () => void
  onExport: (format: "svg" | "png" | "jpeg") => void
  onThemeChange: (id: string) => void
}

const ADD_NODE_OPTIONS: { kind: NodeKind; label: string }[] = [
  { kind: "kill-chain", label: "Kill Chain Phase" },
  { kind: "adversary", label: "Adversary" },
  { kind: "capability", label: "Capability" },
  { kind: "infrastructure", label: "Infrastructure" },
  { kind: "victim", label: "Victim" },
  { kind: "custom", label: "Custom Node" },
]

export function DiagramToolbar({
  mode,
  connectMode,
  hasSelection,
  themeId,
  onModeChange,
  onAddNode,
  onInsertBlock,
  onToggleConnect,
  onDeleteSelected,
  onReset,
  onExport,
  onThemeChange,
}: DiagramToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
      <Select value={mode} onValueChange={(v) => onModeChange(v as DiagramMode)}>
        <SelectTrigger className="w-[190px]">
          <SelectValue placeholder="Template" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="kill-chain">Kill Chain</SelectItem>
          <SelectItem value="diamond-model">Diamond Model</SelectItem>
          <SelectItem value="hybrid">Hybrid (Both)</SelectItem>
          <SelectItem value="unified-kill-chain">Unified Kill Chain</SelectItem>
          <SelectItem value="blank">Blank Canvas</SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6" />

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
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant={connectMode ? "default" : "outline"} size="sm" onClick={onToggleConnect}>
        <Cable className="w-4 h-4 mr-1.5" />
        {connectMode ? "Connecting…" : "Connect"}
      </Button>

      <Button variant="outline" size="sm" onClick={onDeleteSelected} disabled={!hasSelection}>
        <Trash2 className="w-4 h-4 mr-1.5" />
        Delete
      </Button>

      <Button variant="ghost" size="sm" onClick={onReset}>
        <RotateCcw className="w-4 h-4 mr-1.5" />
        Reset
      </Button>

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
