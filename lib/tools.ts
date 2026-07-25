export interface ToolEntry {
  id: string
  title: string
  description: string
  href: string
  tags: string[]
  status: "available" | "coming-soon"
}

export const tools: ToolEntry[] = [
  {
    id: "diagram-builder",
    title: "CTI Diagram Builder",
    description:
      "Build Kill Chain, Diamond Model, Unified Kill Chain, Attack Tree, OODA Loop, F3EAD, Bow-Tie, or hybrid intrusion and risk analysis diagrams on an interactive canvas, then export as SVG, PNG, or JPEG.",
    href: "/tools/diagram-builder",
    tags: ["kill chain", "diamond model", "attack tree", "ooda", "f3ead", "bow-tie", "export"],
    status: "available",
  },
  {
    id: "attack-matrix",
    title: "MITRE ATT&CK Matrix",
    description:
      "The full Enterprise ATT&CK matrix. Color and annotate techniques to map adversary behavior, then export as SVG, PNG, or JPEG.",
    href: "/tools/attack-matrix",
    tags: ["mitre att&ck", "tactics", "techniques", "export"],
    status: "available",
  },
  {
    id: "coa-matrix",
    title: "Courses of Action Matrix",
    description:
      "The seven Ds (Discover, Detect, Deny, Disrupt, Degrade, Deceive, Destroy) against the kill chain. Note controls per cell and color for coverage, then export as SVG, PNG, or JPEG.",
    href: "/tools/coa-matrix",
    tags: ["courses of action", "kill chain", "7 ds", "export"],
    status: "available",
  },
  {
    id: "admiralty-code",
    title: "Admiralty Code Tool",
    description:
      "Grade source reliability (A-F) and information credibility (1-6) with the NATO Admiralty System, with notes per rating, then export as SVG, PNG, or JPEG.",
    href: "/tools/admiralty-code",
    tags: ["admiralty code", "source reliability", "intelligence grading", "export"],
    status: "available",
  },
]

export function getTools(): ToolEntry[] {
  return tools
}
