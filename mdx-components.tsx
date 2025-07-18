import { mdxComponents } from "@/components/mdx-components"
import { HillCipher } from "@/components/visualizations/hill-cipher"
import { LawOfLargeNumbers } from "@/components/visualizations/law-of-large-numbers"
import { MalwareDetectionMechanisms } from "@/components/visualizations/malware-detection-mechanisms"
import { CollapsibleCode } from "@/components/ui/collapsible-code"

export function useMDXComponents(components: any): any {
  return {
    ...mdxComponents,
    // Make sure components are available - these will override mdxComponents
    HillCipher: () => <HillCipher />,
    LawOfLargeNumbers: () => <LawOfLargeNumbers />,
    MalwareDetectionMechanisms: () => <MalwareDetectionMechanisms />,
    CollapsibleCode,
    ...components,
  }
}
