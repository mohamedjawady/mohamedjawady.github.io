export interface DiagramTheme {
  id: string
  name: string
  description: string
  css: string
  editable?: boolean
}

const DARK_CSS = `
.ctidiag-canvas-bg { fill: #0f172a; stroke: #1e293b; }
.ctidiag-node--kill-chain { fill: #064e3b; stroke: #10b981; }
.ctidiag-node--adversary { fill: #450a0a; stroke: #f87171; }
.ctidiag-node--capability { fill: #431407; stroke: #fb923c; }
.ctidiag-node--infrastructure { fill: #172554; stroke: #60a5fa; }
.ctidiag-node--victim { fill: #3b0764; stroke: #c084fc; }
.ctidiag-node--custom { fill: #1e293b; stroke: #94a3b8; }
.ctidiag-node-text { fill: #f8fafc; }
.ctidiag-edge { stroke: #94a3b8; }
.ctidiag-edge-label { fill: #e2e8f0; }
.ctidiag-edge-label-bg { fill: #0f172a; }
`.trim()

const PRINT_CSS = `
.ctidiag-canvas-bg { fill: #ffffff; stroke: #000000; }
.ctidiag-node { fill: #ffffff; stroke: #000000; }
.ctidiag-node-text { fill: #000000; }
.ctidiag-edge { stroke: #000000; }
.ctidiag-edge-label { fill: #000000; }
.ctidiag-edge-label-bg { fill: #ffffff; }
`.trim()

const CORPORATE_CSS = `
.ctidiag-canvas-bg { fill: #f8fafc; stroke: #cbd5e1; }
.ctidiag-node { stroke-width: 1.5; }
.ctidiag-node--kill-chain { fill: #e0f2fe; stroke: #0369a1; }
.ctidiag-node--adversary { fill: #fee2e2; stroke: #b91c1c; }
.ctidiag-node--capability { fill: #ffedd5; stroke: #c2410c; }
.ctidiag-node--infrastructure { fill: #dbeafe; stroke: #1d4ed8; }
.ctidiag-node--victim { fill: #ede9fe; stroke: #6d28d9; }
.ctidiag-node--custom { fill: #f1f5f9; stroke: #334155; }
.ctidiag-node-text { fill: #0f172a; }
.ctidiag-edge { stroke: #64748b; }
`.trim()

export const DIAGRAM_THEMES: DiagramTheme[] = [
  { id: "light", name: "Light (Default)", description: "Default whiteboard palette", css: "" },
  { id: "dark", name: "Dark", description: "Dark canvas for slide decks", css: DARK_CSS },
  { id: "print", name: "Print / Grayscale", description: "High-contrast black and white for reports", css: PRINT_CSS },
  { id: "corporate", name: "Corporate Blue", description: "Muted blue palette", css: CORPORATE_CSS },
  { id: "custom", name: "Custom CSS", description: "Write your own CSS targeting the diagram's classes", css: "", editable: true },
]

export const CUSTOM_CSS_CLASS_REFERENCE = [
  ".ctidiag-canvas-bg",
  ".ctidiag-node, .ctidiag-node--kill-chain / --adversary / --capability / --infrastructure / --victim / --custom",
  ".ctidiag-node-text",
  ".ctidiag-edge, .ctidiag-edge--dashed",
  ".ctidiag-edge-label, .ctidiag-edge-label-bg",
]

export function getTheme(id: string): DiagramTheme {
  return DIAGRAM_THEMES.find((t) => t.id === id) ?? DIAGRAM_THEMES[0]
}
