/**
 * Get the base URL for the current environment
 * Handles both www and non-www domains properly
 */
export function getBaseUrl(): string {
  // In production, use the www subdomain as it appears to be the canonical one
  if (process.env.NODE_ENV === 'production') {
    // Check if we have access to headers to determine the actual domain
    if (typeof window !== 'undefined') {
      // Client-side: use current domain
      return `${window.location.protocol}//${window.location.host}`
    }
    // Server-side: use the canonical www domain to avoid redirects
    return 'https://www.0xhabib.tech'
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
