export type DiagramMode =
  | "kill-chain"
  | "diamond-model"
  | "hybrid"
  | "unified-kill-chain"
  | "attack-tree"
  | "ooda"
  | "f3ead"
  | "bow-tie"
  | "blank"

export type NodeKind =
  | "kill-chain"
  | "adversary"
  | "capability"
  | "infrastructure"
  | "victim"
  | "custom"
  | "ukc-in"
  | "ukc-through"
  | "ukc-out"
  | "attack-root"
  | "attack-node"
  | "ooda"
  | "f3ead"
  | "bowtie-cause"
  | "bowtie-event"
  | "bowtie-consequence"

export type NodeShape = "rect" | "diamond" | "ellipse"

export type GateType = "AND" | "OR"

export interface DiagramNode {
  id: string
  kind: NodeKind
  shape: NodeShape
  label: string
  notes?: string
  gate?: GateType
  x: number
  y: number
  width: number
  height: number
  color: string
  textColor: string
}

export interface DiagramEdge {
  id: string
  source: string
  target: string
  label?: string
  dashed: boolean
  directed: boolean
  color: string
}

export interface DiagramState {
  title: string
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  /** Exportable canvas/page size. Falls back to CANVAS_WIDTH/CANVAS_HEIGHT when unset. */
  canvasWidth?: number
  canvasHeight?: number
}

export const MIN_CANVAS_SIZE = 400
export const MAX_CANVAS_SIZE = 3000

export const CANVAS_SIZE_PRESETS: { label: string; width: number; height: number }[] = [
  { label: "Standard", width: 1200, height: 800 },
  { label: "Wide", width: 1600, height: 900 },
  { label: "Tall", width: 900, height: 1300 },
  { label: "Large", width: 1800, height: 1200 },
  { label: "Square", width: 1000, height: 1000 },
]

export function clampCanvasSize(value: number): number {
  if (Number.isNaN(value)) return MIN_CANVAS_SIZE
  return Math.min(MAX_CANVAS_SIZE, Math.max(MIN_CANVAS_SIZE, Math.round(value)))
}

export const NODE_STYLES: Record<NodeKind, { fill: string; stroke: string; text: string; shape: NodeShape; label: string }> = {
  "kill-chain": { fill: "#ecfdf5", stroke: "#059669", text: "#064e3b", shape: "rect", label: "Kill Chain Phase" },
  adversary: { fill: "#fef2f2", stroke: "#dc2626", text: "#7f1d1d", shape: "diamond", label: "Adversary" },
  capability: { fill: "#fff7ed", stroke: "#ea580c", text: "#7c2d12", shape: "diamond", label: "Capability" },
  infrastructure: { fill: "#eff6ff", stroke: "#2563eb", text: "#1e3a8a", shape: "diamond", label: "Infrastructure" },
  victim: { fill: "#faf5ff", stroke: "#9333ea", text: "#581c87", shape: "diamond", label: "Victim" },
  custom: { fill: "#f8fafc", stroke: "#64748b", text: "#1e293b", shape: "rect", label: "Custom Node" },
  "ukc-in": { fill: "#e0f2fe", stroke: "#0284c7", text: "#075985", shape: "rect", label: "In (Initial Foothold)" },
  "ukc-through": { fill: "#fef3c7", stroke: "#d97706", text: "#78350f", shape: "rect", label: "Through (Network Propagation)" },
  "ukc-out": { fill: "#fee2e2", stroke: "#dc2626", text: "#7f1d1d", shape: "rect", label: "Out (Action on Objectives)" },
  "attack-root": { fill: "#fef2f2", stroke: "#991b1b", text: "#7f1d1d", shape: "rect", label: "Attack Goal" },
  "attack-node": { fill: "#eef2ff", stroke: "#4f46e5", text: "#312e81", shape: "rect", label: "Attack Step" },
  ooda: { fill: "#ecfeff", stroke: "#0891b2", text: "#164e63", shape: "rect", label: "OODA Phase" },
  f3ead: { fill: "#fdf2f8", stroke: "#db2777", text: "#831843", shape: "rect", label: "F3EAD Phase" },
  "bowtie-cause": { fill: "#fefce8", stroke: "#ca8a04", text: "#713f12", shape: "rect", label: "Threat / Cause" },
  "bowtie-event": { fill: "#fee2e2", stroke: "#dc2626", text: "#7f1d1d", shape: "rect", label: "Top Event" },
  "bowtie-consequence": { fill: "#f8fafc", stroke: "#475569", text: "#0f172a", shape: "rect", label: "Consequence" },
}

export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 800

let idCounter = 0
export function makeId(prefix: string): string {
  idCounter += 1
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`
}

export function createNode(kind: NodeKind, x: number, y: number, label?: string): DiagramNode {
  const style = NODE_STYLES[kind]
  const isDiamond = style.shape === "diamond"
  return {
    id: makeId("node"),
    kind,
    shape: style.shape,
    label: label ?? style.label,
    x,
    y,
    width: isDiamond ? 160 : 170,
    height: isDiamond ? 160 : 80,
    color: style.fill,
    textColor: style.text,
  }
}

export function createEdge(source: string, target: string, opts?: Partial<Pick<DiagramEdge, "label" | "dashed" | "directed" | "color">>): DiagramEdge {
  return {
    id: makeId("edge"),
    source,
    target,
    label: opts?.label,
    dashed: opts?.dashed ?? false,
    directed: opts?.directed ?? true,
    color: opts?.color ?? "#94a3b8",
  }
}
