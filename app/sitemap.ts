import { getAllPosts } from '@/lib/posts'
import { getAllVisualizations } from '@/lib/visualizations'
import { getCanonicalUrl } from '@/lib/url'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const visualizations = await getAllVisualizations()
  
  // Filter out draft posts and visualizations from sitemap
  const publishedPosts = posts.filter(post => post.visibility === 'public')
  const publishedVisualizations = visualizations.filter(viz => viz.visibility === 'public')
  
  const postUrls = publishedPosts.map((post) => ({
    url: getCanonicalUrl(`/posts/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))

  const visualizationUrls = publishedVisualizations.map((viz) => ({
    url: getCanonicalUrl(`/visualizations/${viz.id}`),
    lastModified: new Date(viz.date),
    changeFrequency: 'daily' as const,
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
      changeFrequency: 'daily',
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
    {
      url: getCanonicalUrl('/feed.xml'),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.3,
    },
    ...postUrls,
    ...visualizationUrls,
  ]
}
