import { mdxComponents } from "@/components/mdx-components"
import { HillCipher } from "@/components/visualizations/hill-cipher"

export function useMDXComponents(components: any): any {
  return {
    ...mdxComponents,
    // Make sure HillCipher is available
    HillCipher: () => <HillCipher />,
    ...components,
  }
}
