/**
 * Banner utility functions for managing banner images
 */

export interface BannerConfig {
  title: string
  tags: string[]
  category: string
  type: 'post' | 'visualization'
  slug: string
}

/**
 * Generate banner file name based on slug
 */
export function getBannerFileName(slug: string, type: 'post' | 'visualization' = 'post'): string {
  const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
  return `${sanitizedSlug}-banner.svg`
}

/**
 * Get banner path for a given slug and type
 */
export function getBannerPath(slug: string, type: 'post' | 'visualization' = 'post'): string {
  const fileName = getBannerFileName(slug, type)
  return `/banners/${type}s/${fileName}`
}

/**
 * Generate dynamic banner URL
 */
export function generateBannerUrl(config: BannerConfig): string {
  const params = new URLSearchParams({
    title: config.title,
    tags: config.tags.join(','),
    category: config.category,
    type: config.type,
    slug: config.slug,
    width: '1200',
    height: '630',
  })
  return `/api/banner?${params.toString()}`
}

/**
 * Check if a static banner exists for a given slug
 */
export function getStaticBannerPath(slug: string, type: 'post' | 'visualization' = 'post'): string {
  // Check for common image formats
  const extensions = ['jpg', 'jpeg', 'png', 'webp', 'svg']
  const sanitizedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
  
  // Return the first format (you can implement actual file existence checking in a more complex setup)
  return `/banners/${type}s/${sanitizedSlug}-banner.jpg`
}

/**
 * Get banner URL with fallback to dynamic generation
 */
export function getBannerUrl(config: BannerConfig, preferStatic: boolean = true): string {
  if (preferStatic) {
    // In a real implementation, you'd check if the static file exists
    // For now, we'll assume you want dynamic generation
    return generateBannerUrl(config)
  }
  return generateBannerUrl(config)
}

/**
 * Banner presets for different categories
 */
export const BANNER_PRESETS = {
  cryptography: {
    gradientFrom: '#4F46E5',
    gradientTo: '#7C3AED',
    iconType: 'security',
  },
  'reverse-engineering': {
    gradientFrom: '#059669',
    gradientTo: '#0891B2',
    iconType: 'code',
  },
  'malware-analysis': {
    gradientFrom: '#DC2626',
    gradientTo: '#EA580C',
    iconType: 'shield',
  },
  tutorial: {
    gradientFrom: '#2563EB',
    gradientTo: '#7C3AED',
    iconType: 'book',
  },
  visualization: {
    gradientFrom: '#7C3AED',
    gradientTo: '#EC4899',
    iconType: 'chart',
  },
  default: {
    gradientFrom: '#4F46E5',
    gradientTo: '#7C3AED',
    iconType: 'blog',
  },
} as const

/**
 * Get color preset for a category
 */
export function getCategoryPreset(category: string) {
  const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-')
  return BANNER_PRESETS[normalizedCategory as keyof typeof BANNER_PRESETS] || BANNER_PRESETS.default
}
