import rawData from "./data.json"

export interface AttackTactic {
  id: string
  shortname: string
  name: string
}

export interface AttackTechnique {
  id: string
  name: string
  tactics: string[]
  subCount?: number
}

interface AttackMatrixData {
  tactics: AttackTactic[]
  techniques: AttackTechnique[]
}

const data = rawData as AttackMatrixData

export const ATTACK_TACTICS: AttackTactic[] = data.tactics
export const ATTACK_TECHNIQUES: AttackTechnique[] = data.techniques

export function techniquesForTactic(shortname: string): AttackTechnique[] {
  return ATTACK_TECHNIQUES.filter((t) => t.tactics.includes(shortname))
}

export function cellKey(techniqueId: string, tactic: string): string {
  return `${techniqueId}::${tactic}`
}
