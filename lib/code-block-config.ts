/**
 * Configuration for collapsible code blocks
 */
export interface CodeBlockConfig {
  // Languages that should be collapsible by default
  collapsibleLanguages: string[]
  // Languages that should be expanded by default
  expandedByDefault: string[]
  // Minimum number of lines before making a code block collapsible
  minLinesForCollapsible: number
  // Whether to show copy button
  showCopyButton: boolean
}

export const defaultCodeBlockConfig: CodeBlockConfig = {
  collapsibleLanguages: ['python', 'javascript', 'typescript', 'bash', 'sql', 'java', 'cpp', 'c', 'go', 'rust'],
  expandedByDefault: ['bash', 'sh', 'terminal'],
  minLinesForCollapsible: 5,
  showCopyButton: true,
}

/**
 * Check if a code block should be collapsible based on language and content
 */
export function shouldBeCollapsible(
  language?: string, 
  content?: string, 
  config: CodeBlockConfig = defaultCodeBlockConfig
): boolean {
  if (!language || !content) return false
  
  // Check if language is in collapsible list
  const isCollapsibleLanguage = config.collapsibleLanguages.includes(language.toLowerCase())
  
  // Check line count
  const lineCount = content.split('\n').length
  const hasEnoughLines = lineCount >= config.minLinesForCollapsible
  
  return isCollapsibleLanguage && hasEnoughLines
}

/**
 * Check if a code block should be expanded by default
 */
export function shouldBeExpandedByDefault(
  language?: string,
  config: CodeBlockConfig = defaultCodeBlockConfig
): boolean {
  if (!language) return false
  return config.expandedByDefault.includes(language.toLowerCase())
}
