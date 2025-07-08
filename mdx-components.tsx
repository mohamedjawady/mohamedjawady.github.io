import { mdxComponents } from "@/components/mdx-components"
import { HillCipher } from "@/components/visualizations/hill-cipher"
import { LawOfLargeNumbers } from "@/components/visualizations/law-of-large-numbers"

export function useMDXComponents(components: any): any {
  return {
    ...mdxComponents,
    // Make sure components are available
    HillCipher: () => <HillCipher />,
    LawOfLargeNumbers: () => <LawOfLargeNumbers />,
    ...components,
  }
}
