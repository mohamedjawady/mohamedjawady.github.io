export interface DiagramTheme {
  id: string
  name: string
  description: string
  css: string
  canvasBg: string
  /** Background of the viewport area surrounding the canvas (visible when zoomed out), distinct from canvasBg so the canvas edge stays legible. */
  viewportBg: string
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
.ctidiag-node--ukc-in { fill: #0c4a6e; stroke: #38bdf8; }
.ctidiag-node--ukc-through { fill: #78350f; stroke: #fbbf24; }
.ctidiag-node--ukc-out { fill: #450a0a; stroke: #f87171; }
.ctidiag-node--attack-root { fill: #450a0a; stroke: #f87171; }
.ctidiag-node--attack-node { fill: #312e81; stroke: #818cf8; }
.ctidiag-node--ooda { fill: #083344; stroke: #22d3ee; }
.ctidiag-node--f3ead { fill: #500724; stroke: #f472b6; }
.ctidiag-node--bowtie-cause { fill: #422006; stroke: #facc15; }
.ctidiag-node--bowtie-event { fill: #450a0a; stroke: #f87171; }
.ctidiag-node--bowtie-consequence { fill: #1e293b; stroke: #94a3b8; }
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
.ctidiag-node--ukc-in { fill: #e0f2fe; stroke: #0369a1; }
.ctidiag-node--ukc-through { fill: #fef3c7; stroke: #b45309; }
.ctidiag-node--ukc-out { fill: #fee2e2; stroke: #b91c1c; }
.ctidiag-node--attack-root { fill: #fee2e2; stroke: #b91c1c; }
.ctidiag-node--attack-node { fill: #e0e7ff; stroke: #4338ca; }
.ctidiag-node--ooda { fill: #cffafe; stroke: #0e7490; }
.ctidiag-node--f3ead { fill: #fce7f3; stroke: #be185d; }
.ctidiag-node--bowtie-cause { fill: #fef9c3; stroke: #a16207; }
.ctidiag-node--bowtie-event { fill: #fee2e2; stroke: #b91c1c; }
.ctidiag-node--bowtie-consequence { fill: #f1f5f9; stroke: #334155; }
.ctidiag-node-text { fill: #0f172a; }
.ctidiag-edge { stroke: #64748b; }
`.trim()

export const DIAGRAM_THEMES: DiagramTheme[] = [
  { id: "light", name: "Light (Default)", description: "Default whiteboard palette", css: "", canvasBg: "#ffffff", viewportBg: "#f1f5f9" },
  { id: "dark", name: "Dark", description: "Dark canvas for slide decks", css: DARK_CSS, canvasBg: "#0f172a", viewportBg: "#020617" },
  { id: "print", name: "Print / Grayscale", description: "High-contrast black and white for reports", css: PRINT_CSS, canvasBg: "#ffffff", viewportBg: "#e5e7eb" },
  { id: "corporate", name: "Corporate Blue", description: "Muted blue palette", css: CORPORATE_CSS, canvasBg: "#f8fafc", viewportBg: "#cbd5e1" },
  { id: "custom", name: "Custom CSS", description: "Write your own CSS targeting the diagram's classes", css: "", canvasBg: "#ffffff", viewportBg: "#e2e8f0", editable: true },
]

export const CUSTOM_CSS_CLASS_REFERENCE = [
  ".ctidiag-canvas-bg",
  ".ctidiag-node, .ctidiag-node--kill-chain / --adversary / --capability / --infrastructure / --victim / --custom / --ukc-in / --ukc-through / --ukc-out / --attack-root / --attack-node / --ooda / --f3ead / --bowtie-cause / --bowtie-event / --bowtie-consequence",
  ".ctidiag-node-text",
  ".ctidiag-edge, .ctidiag-edge--dashed",
  ".ctidiag-edge-label, .ctidiag-edge-label-bg",
]

export function getTheme(id: string): DiagramTheme {
  return DIAGRAM_THEMES.find((t) => t.id === id) ?? DIAGRAM_THEMES[0]
}
