export interface ReliabilityGrade {
  code: string
  label: string
  description: string
}

export interface CredibilityRating {
  code: string
  label: string
  description: string
}

export const RELIABILITY_GRADES: ReliabilityGrade[] = [
  { code: "A", label: "Reliable", description: "No doubt of authenticity, trustworthiness, or competency; history of complete reliability." },
  { code: "B", label: "Usually Reliable", description: "Minor doubt about authenticity, trustworthiness, or competency; history of valid information most of the time." },
  { code: "C", label: "Fairly Reliable", description: "Doubt of authenticity, trustworthiness, or competency, but has provided valid information in the past." },
  { code: "D", label: "Not Usually Reliable", description: "Significant doubt about authenticity, trustworthiness, or competency, but has provided valid information in the past." },
  { code: "E", label: "Unreliable", description: "Lacking in authenticity, trustworthiness, and competency; history of invalid information." },
  { code: "F", label: "Cannot Be Judged", description: "No basis exists for evaluating the reliability of the source." },
]

export const CREDIBILITY_RATINGS: CredibilityRating[] = [
  { code: "1", label: "Confirmed", description: "Confirmed by other independent sources; logical in itself; consistent with other information on the subject." },
  { code: "2", label: "Probably True", description: "Not confirmed; logical in itself; consistent with other information on the subject." },
  { code: "3", label: "Possibly True", description: "Not confirmed; reasonably logical in itself; agrees with some other information on the subject." },
  { code: "4", label: "Doubtful", description: "Not confirmed; possible but not logical; no other information on the subject." },
  { code: "5", label: "Improbable", description: "Not confirmed; not logical in itself; contradicted by other information on the subject." },
  { code: "6", label: "Cannot Be Judged", description: "No basis exists for evaluating the validity of the information." },
]

export function admiraltyCellKey(reliability: string, credibility: string): string {
  return `${reliability}${credibility}`
}
