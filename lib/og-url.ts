import { getCanonicalUrl } from './url'

/**
 * Build OG image URL for posts with proper parameter encoding
 * This helps avoid HTML encoding issues in metadata
 */
export function buildOgImageUrl(params: {
  title: string
  description?: string
  author?: string
  tags?: string[]
}): string {
  const baseUrl = getCanonicalUrl('/api/og/post')
  const searchParams = new URLSearchParams()
  
  searchParams.set('title', params.title)
  if (params.description) {
    searchParams.set('description', params.description)
  }
  if (params.author) {
    searchParams.set('author', params.author)
  }
  if (params.tags && params.tags.length > 0) {
    searchParams.set('tags', params.tags.join(','))
  }
  
  return `${baseUrl}?${searchParams.toString()}`
}

/**
 * Build homepage OG image URL
 */
export function buildHomeOgImageUrl(title?: string, description?: string): string {
  const baseUrl = getCanonicalUrl('/api/og')
  if (!title && !description) {
    return baseUrl
  }
  
  const searchParams = new URLSearchParams()
  if (title) searchParams.set('title', title)
  if (description) searchParams.set('description', description)
  
  return `${baseUrl}?${searchParams.toString()}`
}