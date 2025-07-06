import { getAllPosts } from '@/lib/posts'
import { getAllVisualizations } from '@/lib/visualizations'
import { getCanonicalUrl } from '@/lib/url'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const visualizations = await getAllVisualizations()
  
  const postUrls = posts.map((post) => ({
    url: getCanonicalUrl(`/posts/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const visualizationUrls = visualizations.map((viz) => ({
    url: getCanonicalUrl(`/visualizations/${viz.id}`),
    lastModified: new Date(viz.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: getCanonicalUrl(''),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: getCanonicalUrl('/posts'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: getCanonicalUrl('/visualizations'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: getCanonicalUrl('/about'),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: getCanonicalUrl('/tags'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...postUrls,
    ...visualizationUrls,
  ]
}
