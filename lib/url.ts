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
  return `${baseUrl}${path.startsWith('/') ? path : `${path}`}`
}

/**
 * Check if a URL is an internal link to the site
 */
export function isInternalUrl(url: string): boolean {
  if (!url) return false
  
  // Handle relative URLs
  if (url.startsWith('/')) return true
  
  // Handle absolute URLs
  try {
    const urlObj = new URL(url)
    const baseUrl = getBaseUrl()
    const baseUrlObj = new URL(baseUrl)
    return urlObj.hostname === baseUrlObj.hostname
  } catch {
    return false
  }
}

/**
 * Parse internal URL to get content type and identifier
 */
export function parseInternalUrl(url: string): {
  type: 'post' | 'note' | 'cheatsheet' | 'visualization' | 'other'
  id: string | null
  path: string
} | null {
  if (!isInternalUrl(url)) return null
  
  try {
    const urlObj = new URL(url, getBaseUrl())
    const path = urlObj.pathname
    
    // Match different content types
    const postMatch = path.match(/^\/posts\/([^\/]+)$/)
    if (postMatch) {
      return { type: 'post', id: postMatch[1], path }
    }
    
    const noteMatch = path.match(/^\/notes\/([^\/]+)$/)
    if (noteMatch) {
      return { type: 'note', id: noteMatch[1], path }
    }
    
    const cheatsheetMatch = path.match(/^\/cheatsheets\/([^\/]+)$/)
    if (cheatsheetMatch) {
      return { type: 'cheatsheet', id: cheatsheetMatch[1], path }
    }
    
    const visualizationMatch = path.match(/^\/visualizations\/([^\/]+)$/)
    if (visualizationMatch) {
      return { type: 'visualization', id: visualizationMatch[1], path }
    }
    
    return { type: 'other', id: null, path }
  } catch {
    return null
  }
}
