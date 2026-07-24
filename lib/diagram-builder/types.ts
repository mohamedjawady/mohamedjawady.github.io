export type DiagramMode = "kill-chain" | "diamond-model" | "hybrid" | "blank"

export type NodeKind =
  | "kill-chain"
  | "adversary"
  | "capability"
  | "infrastructure"
  | "victim"
  | "custom"

export type NodeShape = "rect" | "diamond" | "ellipse"

export interface DiagramNode {
  id: string
  kind: NodeKind
  shape: NodeShape
  label: string
  notes?: string
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
}

export const NODE_STYLES: Record<NodeKind, { fill: string; stroke: string; text: string; shape: NodeShape; label: string }> = {
  "kill-chain": { fill: "#ecfdf5", stroke: "#059669", text: "#064e3b", shape: "rect", label: "Kill Chain Phase" },
  adversary: { fill: "#fef2f2", stroke: "#dc2626", text: "#7f1d1d", shape: "diamond", label: "Adversary" },
  capability: { fill: "#fff7ed", stroke: "#ea580c", text: "#7c2d12", shape: "diamond", label: "Capability" },
  infrastructure: { fill: "#eff6ff", stroke: "#2563eb", text: "#1e3a8a", shape: "diamond", label: "Infrastructure" },
  victim: { fill: "#faf5ff", stroke: "#9333ea", text: "#581c87", shape: "diamond", label: "Victim" },
  custom: { fill: "#f8fafc", stroke: "#64748b", text: "#1e293b", shape: "rect", label: "Custom Node" },
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
