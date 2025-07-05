/**
 * Get the base URL for the current environment
 * Handles both www and non-www domains properly
 */
export function getBaseUrl(): string {
  // In production, always use the canonical domain
  if (process.env.NODE_ENV === 'production') {
    return 'https://0xhabib.tech'
  }
  
  // In development, use localhost
  return 'http://localhost:3000'
}

/**
 * Get the canonical URL for a given path
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = getBaseUrl()
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}
