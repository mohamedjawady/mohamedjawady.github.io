import { CANVAS_WIDTH, createEdge, createNode, DiagramEdge, DiagramNode, DiagramState, NodeKind } from "./types"

const KILL_CHAIN_PHASES = [
  "Reconnaissance",
  "Weaponization",
  "Delivery",
  "Exploitation",
  "Installation",
  "Command & Control",
  "Actions on Objectives",
]

const UNIFIED_KILL_CHAIN_GROUPS: { kind: NodeKind; phases: string[] }[] = [
  {
    kind: "ukc-in",
    phases: [
      "Reconnaissance",
      "Weaponization",
      "Delivery",
      "Social Engineering",
      "Exploitation",
      "Persistence",
      "Defense Evasion",
      "Command & Control",
    ],
  },
  {
    kind: "ukc-through",
    phases: ["Pivoting", "Discovery", "Privilege Escalation", "Execution", "Credential Access", "Lateral Movement"],
  },
  {
    kind: "ukc-out",
    phases: ["Collection", "Exfiltration", "Impact", "Objectives"],
  },
]

function phaseRowNodes(labels: string[], kind: NodeKind, y: number, width: number, nodeW: number) {
  const count = labels.length
  const gap = (width - nodeW * count) / (count + 1)
  return labels.map((label, i) => {
    const x = gap + nodeW / 2 + i * (nodeW + gap)
    const node = createNode(kind, x, y, label)
    node.width = nodeW
    node.height = 78
    return node
  })
}

function killChainNodes(y: number, width = CANVAS_WIDTH) {
  return phaseRowNodes(KILL_CHAIN_PHASES, "kill-chain", y, width, 148)
}

export function killChainBlock(cx: number, cy: number, width = CANVAS_WIDTH * 0.78): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  const left = cx - width / 2
  const nodes = killChainNodes(cy, width).map((n) => ({ ...n, x: n.x + left }))
  const edges = nodes.slice(0, -1).map((n, i) => createEdge(n.id, nodes[i + 1].id, { color: "#059669" }))
  return { nodes, edges }
}

export function unifiedKillChainBlock(cx: number, cy: number, width = CANVAS_WIDTH - 60, rowGap = 150): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  const left = cx - width / 2
  const nodes: DiagramNode[] = []
  UNIFIED_KILL_CHAIN_GROUPS.forEach((group, rowIndex) => {
    const y = cy + rowIndex * rowGap
    const nodeW = Math.min(148, (width - (group.phases.length + 1) * 12) / group.phases.length)
    const rowNodes = phaseRowNodes(group.phases, group.kind, y, width, nodeW).map((n) => ({ ...n, x: n.x + left }))
    nodes.push(...rowNodes)
  })
  const edges = nodes.slice(0, -1).map((n, i) => createEdge(n.id, nodes[i + 1].id, { color: "#4f46e5" }))
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

export function unifiedKillChainPreset(): DiagramState {
  const { nodes, edges } = unifiedKillChainBlock(CANVAS_WIDTH / 2, 120, CANVAS_WIDTH - 60, 220)
  return { title: "Unified Kill Chain (Pols, 2017)", nodes, edges }
}

export function attackTreeBlock(cx: number, cy: number): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  const root = createNode("attack-root", cx, cy, "Compromise Domain Admin Credentials")
  root.gate = "OR"

  const ntds = createNode("attack-node", cx - 300, cy + 170, "Steal NTDS.dit")
  ntds.gate = "AND"
  const kerberoast = createNode("attack-node", cx, cy + 170, "Kerberoasting")
  kerberoast.gate = "AND"
  const phish = createNode("attack-node", cx + 300, cy + 170, "Phish Domain Admin Directly")

  const dcAccess = createNode("attack-node", cx - 380, cy + 340, "Obtain Domain Controller Access")
  const extractHive = createNode("attack-node", cx - 220, cy + 340, "Extract NTDS.dit + SYSTEM Hive")
  const enumSpns = createNode("attack-node", cx - 80, cy + 340, "Enumerate SPNs")
  const crackTgs = createNode("attack-node", cx + 80, cy + 340, "Crack TGS Ticket Offline")

  const nodes = [root, ntds, kerberoast, phish, dcAccess, extractHive, enumSpns, crackTgs]
  const edges = [
    createEdge(root.id, ntds.id, { color: "#4f46e5" }),
    createEdge(root.id, kerberoast.id, { color: "#4f46e5" }),
    createEdge(root.id, phish.id, { color: "#4f46e5" }),
    createEdge(ntds.id, dcAccess.id, { color: "#4f46e5" }),
    createEdge(ntds.id, extractHive.id, { color: "#4f46e5" }),
    createEdge(kerberoast.id, enumSpns.id, { color: "#4f46e5" }),
    createEdge(kerberoast.id, crackTgs.id, { color: "#4f46e5" }),
  ]

  return { nodes, edges }
}

export function attackTreePreset(): DiagramState {
  const { nodes, edges } = attackTreeBlock(CANVAS_WIDTH / 2, 110)
  return { title: "Attack Tree: Domain Admin Compromise", nodes, edges }
}

function circleBlock(labels: string[], kind: NodeKind, cx: number, cy: number, radius: number, edgeColor: string): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  const n = labels.length
  const nodes = labels.map((label, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    return createNode(kind, x, y, label)
  })
  const edges = nodes.map((node, i) => createEdge(node.id, nodes[(i + 1) % nodes.length].id, { color: edgeColor }))
  return { nodes, edges }
}

export function oodaBlock(cx: number, cy: number, radius = 220): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  return circleBlock(["Observe", "Orient", "Decide", "Act"], "ooda", cx, cy, radius, "#0891b2")
}

export function oodaPreset(): DiagramState {
  const { nodes, edges } = oodaBlock(CANVAS_WIDTH / 2, 380)
  return { title: "OODA Loop (Boyd)", nodes, edges }
}

export function f3eadBlock(cx: number, cy: number, radius = 260): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  return circleBlock(["Find", "Fix", "Finish", "Exploit", "Analyze", "Disseminate"], "f3ead", cx, cy, radius, "#db2777")
}

export function f3eadPreset(): DiagramState {
  const { nodes, edges } = f3eadBlock(CANVAS_WIDTH / 2, 400)
  return { title: "F3EAD Cycle", nodes, edges }
}

export function bowTieBlock(cx: number, cy: number): { nodes: DiagramNode[]; edges: DiagramEdge[] } {
  const event = createNode("bowtie-event", cx, cy, "Ransomware Deployed on Network")

  const causeLabels = ["Phishing Email Delivered", "Exposed RDP Service", "Unpatched Vulnerability Exploited"]
  const causeBarriers = ["Email Filtering", "VPN + MFA Required", "Patch Management"]
  const causes = causeLabels.map((label, i) => createNode("bowtie-cause", cx - 400, cy + (i - 1) * 170, label))

  const consequenceLabels = ["Data Loss", "Lateral Spread to Critical Systems", "Extended Business Downtime"]
  const consequenceBarriers = ["Offline Backups", "Network Segmentation", "Incident Response Plan"]
  const consequences = consequenceLabels.map((label, i) => createNode("bowtie-consequence", cx + 400, cy + (i - 1) * 170, label))

  const nodes = [event, ...causes, ...consequences]
  const edges = [
    ...causes.map((c, i) => createEdge(c.id, event.id, { color: "#ca8a04", label: causeBarriers[i] })),
    ...consequences.map((c, i) => createEdge(event.id, c.id, { color: "#475569", label: consequenceBarriers[i] })),
  ]

  return { nodes, edges }
}

export function bowTiePreset(): DiagramState {
  const { nodes, edges } = bowTieBlock(CANVAS_WIDTH / 2, 400)
  return { title: "Bow-Tie Risk Diagram: Ransomware Deployment", nodes, edges }
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
    case "unified-kill-chain":
      return unifiedKillChainPreset()
    case "attack-tree":
      return attackTreePreset()
    case "ooda":
      return oodaPreset()
    case "f3ead":
      return f3eadPreset()
    case "bow-tie":
      return bowTiePreset()
    default:
      return blankPreset()
  }
}
