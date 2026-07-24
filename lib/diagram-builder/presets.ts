import { CANVAS_WIDTH, createEdge, createNode, DiagramEdge, DiagramNode, DiagramState } from "./types"

const KILL_CHAIN_PHASES = [
  "Reconnaissance",
  "Weaponization",
  "Delivery",
  "Exploitation",
  "Installation",
  "Command & Control",
  "Actions on Objectives",
]

function killChainNodes(y: number, width = CANVAS_WIDTH) {
  const count = KILL_CHAIN_PHASES.length
  const nodeW = 148
  const gap = (width - nodeW * count) / (count + 1)
  return KILL_CHAIN_PHASES.map((phase, i) => {
    const x = gap + nodeW / 2 + i * (nodeW + gap)
    const node = createNode("kill-chain", x, y, phase)
    node.width = nodeW
    node.height = 78
    return node
  })
}

export function killChainBlock(cx: number, cy: number, width = CANVAS_WIDTH * 0.78): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  const left = cx - width / 2
  const nodes = killChainNodes(cy, width).map((n) => ({ ...n, x: n.x + left }))
  const edges = nodes.slice(0, -1).map((n, i) => createEdge(n.id, nodes[i + 1].id, { color: "#059669" }))
  return { nodes, edges }
}

export function diamondModelBlock(cx: number, cy: number, spread = 190): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  const adversary = createNode("adversary", cx, cy - spread, "Adversary")
  const capability = createNode("capability", cx - spread * 1.35, cy, "Capability")
  const infrastructure = createNode("infrastructure", cx + spread * 1.35, cy, "Infrastructure")
  const victim = createNode("victim", cx, cy + spread, "Victim")

  const nodes = [adversary, capability, infrastructure, victim]
  const edges = [
    createEdge(adversary.id, capability.id, { color: "#94a3b8" }),
    createEdge(adversary.id, infrastructure.id, { color: "#94a3b8" }),
    createEdge(victim.id, capability.id, { color: "#94a3b8" }),
    createEdge(victim.id, infrastructure.id, { color: "#94a3b8" }),
    createEdge(adversary.id, victim.id, { dashed: true, directed: false, color: "#cbd5e1", label: "Socio-Political Axis" }),
    createEdge(capability.id, infrastructure.id, { dashed: true, directed: false, color: "#cbd5e1", label: "Technical Axis" }),
  ]

  return { nodes, edges }
}

export function killChainPreset(): DiagramState {
  const { nodes, edges } = killChainBlock(CANVAS_WIDTH / 2, 140, CANVAS_WIDTH - 70)
  return { title: "Lockheed Martin Cyber Kill Chain", nodes, edges }
}

export function diamondModelPreset(): DiagramState {
  const { nodes, edges } = diamondModelBlock(CANVAS_WIDTH / 2, 420, 210)
  return { title: "Diamond Model of Intrusion Analysis", nodes, edges }
}

export function hybridPreset(): DiagramState {
  const chain = killChainBlock(CANVAS_WIDTH / 2, 90, CANVAS_WIDTH - 70)
  const diamond = diamondModelBlock(CANVAS_WIDTH / 2, 500, 170)

  const delivery = chain.nodes.find((n) => n.label === "Delivery")!
  const infrastructure = diamond.nodes.find((n) => n.kind === "infrastructure")!
  const linkEdge = createEdge(delivery.id, infrastructure.id, { dashed: true, directed: true, color: "#f59e0b", label: "maps to" })

  return {
    title: "Kill Chain + Diamond Model (Hybrid)",
    nodes: [...chain.nodes, ...diamond.nodes],
    edges: [...chain.edges, ...diamond.edges, linkEdge],
  }
}

export function blankPreset(): DiagramState {
  return { title: "Untitled Diagram", nodes: [], edges: [] }
}

export function getPreset(mode: string): DiagramState {
  switch (mode) {
    case "kill-chain":
      return killChainPreset()
    case "diamond-model":
      return diamondModelPreset()
    case "hybrid":
      return hybridPreset()
    default:
      return blankPreset()
  }
}
