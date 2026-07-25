export type ToolCategory =
  | "Intrusion Chains"
  | "Structured Models"
  | "Decision & Operations Cycles"
  | "Risk Analysis"
  | "Matrices & Scoring"
  | "Free-Form"

export interface ToolEntry {
  id: string
  title: string
  description: string
  href: string
  category: ToolCategory
  tags: string[]
  status: "available" | "coming-soon"
}

export const CATEGORY_ORDER: ToolCategory[] = [
  "Intrusion Chains",
  "Structured Models",
  "Decision & Operations Cycles",
  "Risk Analysis",
  "Matrices & Scoring",
  "Free-Form",
]

export const tools: ToolEntry[] = [
  {
    id: "kill-chain",
    title: "Cyber Kill Chain Builder",
    description:
      "Lockheed Martin's 7-phase intrusion model, from Reconnaissance to Actions on Objectives. Export as SVG, PNG, or JPEG.",
    href: "/tools/kill-chain",
    category: "Intrusion Chains",
    tags: ["kill chain", "intrusion analysis", "export"],
    status: "available",
  },
  {
    id: "unified-kill-chain",
    title: "Unified Kill Chain Builder",
    description:
      "Paul Pols' 18-phase merge of the Kill Chain, MITRE ATT&CK, and the Diamond Model, grouped into In, Through, and Out. Export as SVG, PNG, or JPEG.",
    href: "/tools/unified-kill-chain",
    category: "Intrusion Chains",
    tags: ["unified kill chain", "intrusion analysis", "export"],
    status: "available",
  },
  {
    id: "diamond-model",
    title: "Diamond Model Builder",
    description:
      "The four core features of an intrusion: Adversary, Capability, Infrastructure, and Victim, linked by the socio-political and technical axes. Export as SVG, PNG, or JPEG.",
    href: "/tools/diamond-model",
    category: "Structured Models",
    tags: ["diamond model", "intrusion analysis", "export"],
    status: "available",
  },
  {
    id: "attack-tree",
    title: "Attack Tree Builder",
    description:
      "Break an attacker's goal into AND/OR sub-goals and leaf attacks, with automatic tree layout. Export as SVG, PNG, or JPEG.",
    href: "/tools/attack-tree",
    category: "Structured Models",
    tags: ["attack tree", "and/or gates", "export"],
    status: "available",
  },
  {
    id: "ooda-loop",
    title: "OODA Loop Builder",
    description: "Boyd's decision cycle: Observe, Orient, Decide, Act. Export as SVG, PNG, or JPEG.",
    href: "/tools/ooda-loop",
    category: "Decision & Operations Cycles",
    tags: ["ooda", "decision cycle", "export"],
    status: "available",
  },
  {
    id: "f3ead",
    title: "F3EAD Cycle Builder",
    description:
      "The Find, Fix, Finish, Exploit, Analyze, Disseminate cycle for fusing operations and intelligence. Export as SVG, PNG, or JPEG.",
    href: "/tools/f3ead",
    category: "Decision & Operations Cycles",
    tags: ["f3ead", "operations", "export"],
    status: "available",
  },
  {
    id: "bow-tie",
    title: "Bow-Tie Risk Diagram Builder",
    description:
      "Threat causes and preventive barriers on the left, a central top event, consequences and mitigative barriers on the right. Export as SVG, PNG, or JPEG.",
    href: "/tools/bow-tie",
    category: "Risk Analysis",
    tags: ["bow-tie", "risk analysis", "export"],
    status: "available",
  },
  {
    id: "attack-matrix",
    title: "MITRE ATT&CK Matrix",
    description:
      "The full Enterprise ATT&CK matrix. Color and annotate techniques to map adversary behavior, then export as SVG, PNG, or JPEG.",
    href: "/tools/attack-matrix",
    category: "Matrices & Scoring",
    tags: ["mitre att&ck", "tactics", "techniques", "export"],
    status: "available",
  },
  {
    id: "coa-matrix",
    title: "Courses of Action Matrix",
    description:
      "The seven Ds (Discover, Detect, Deny, Disrupt, Degrade, Deceive, Destroy) against the kill chain. Note controls per cell and color for coverage, then export as SVG, PNG, or JPEG.",
    href: "/tools/coa-matrix",
    category: "Matrices & Scoring",
    tags: ["courses of action", "kill chain", "7 ds", "export"],
    status: "available",
  },
  {
    id: "admiralty-code",
    title: "Admiralty Code Tool",
    description:
      "Grade source reliability (A-F) and information credibility (1-6) with the NATO Admiralty System, with notes per rating, then export as SVG, PNG, or JPEG.",
    href: "/tools/admiralty-code",
    category: "Matrices & Scoring",
    tags: ["admiralty code", "source reliability", "intelligence grading", "export"],
    status: "available",
  },
  {
    id: "diagram-builder",
    title: "Free-Form Diagram Canvas",
    description:
      "A blank, general-purpose canvas that switches between every model above, kill chain, diamond model, attack tree, and more, so you can mix and match on one diagram. Export as SVG, PNG, or JPEG.",
    href: "/tools/diagram-builder",
    category: "Free-Form",
    tags: ["custom", "mix models", "export"],
    status: "available",
  },
]

export function getTools(): ToolEntry[] {
  return tools
}

export function getToolsByCategory(): { category: ToolCategory; tools: ToolEntry[] }[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    tools: tools.filter((t) => t.category === category),
  })).filter((group) => group.tools.length > 0)
}
