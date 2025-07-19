import { mdxComponents } from "@/components/mdx-components"

export function useMDXComponents(components: any): any {
  return {
    ...mdxComponents,
    ...components,
  }
}
