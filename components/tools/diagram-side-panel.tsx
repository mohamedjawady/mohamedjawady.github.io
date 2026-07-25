"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { DiagramEdge, DiagramNode, GateType } from "@/lib/diagram-builder/types"

const GATE_OPTIONS: { value: GateType | null; label: string }[] = [
  { value: null, label: "None" },
  { value: "AND", label: "AND" },
  { value: "OR", label: "OR" },
]

interface DiagramSidePanelProps {
  node: DiagramNode | null
  edge: DiagramEdge | null
  onUpdateNode: (id: string, patch: Partial<DiagramNode>) => void
  onUpdateEdge: (id: string, patch: Partial<DiagramEdge>) => void
}

export function DiagramSidePanel({ node, edge, onUpdateNode, onUpdateEdge }: DiagramSidePanelProps) {
  if (!node && !edge) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
        Select a node or connector to edit its properties, or drag nodes on the canvas to reposition them.
      </div>
    )
  }

  if (node) {
    return (
      <div className="rounded-lg border border-border/60 p-4 space-y-4">
        <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">Node</p>
        <div className="space-y-1.5">
          <Label htmlFor="node-label">Label</Label>
          <Input
            id="node-label"
            value={node.label}
            onChange={(e) => onUpdateNode(node.id, { label: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="node-notes">Notes</Label>
          <Textarea
            id="node-notes"
            rows={4}
            placeholder="Optional analyst notes (not shown on canvas, kept for reference)"
            value={node.notes ?? ""}
            onChange={(e) => onUpdateNode(node.id, { notes: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Gate (for attack trees)</Label>
          <div className="flex gap-1.5">
            {GATE_OPTIONS.map((opt) => (
              <Button
                key={opt.label}
                type="button"
                size="sm"
                variant={(node.gate ?? null) === opt.value ? "default" : "outline"}
                className="flex-1 h-8"
                onClick={() => onUpdateNode(node.id, { gate: opt.value ?? undefined })}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Sets whether this node&apos;s children must all succeed (AND) or any one is enough (OR).
          </p>
        </div>
      </div>
    )
  }

  if (edge) {
    return (
      <div className="rounded-lg border border-border/60 p-4 space-y-4">
        <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">Connector</p>
        <div className="space-y-1.5">
          <Label htmlFor="edge-label">Label</Label>
          <Input
            id="edge-label"
            placeholder="e.g. leads to"
            value={edge.label ?? ""}
            onChange={(e) => onUpdateEdge(edge.id, { label: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="edge-dashed">Dashed line</Label>
          <Switch
            id="edge-dashed"
            checked={edge.dashed}
            onCheckedChange={(checked) => onUpdateEdge(edge.id, { dashed: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="edge-directed">Arrowhead</Label>
          <Switch
            id="edge-directed"
            checked={edge.directed}
            onCheckedChange={(checked) => onUpdateEdge(edge.id, { directed: checked })}
          />
        </div>
      </div>
    )
  }

  return null
}
