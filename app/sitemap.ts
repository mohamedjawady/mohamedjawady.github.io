import { getAllPosts } from '@/lib/posts'
import { getAllVisualizations } from '@/lib/visualizations'
import { getAllCheatsheets } from '@/lib/cheatsheets'
import { getAllNotes } from '@/lib/notes'
import { getAllStudyDecks } from '@/lib/study-decks'
import { getCanonicalUrl } from '@/lib/url'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const visualizations = await getAllVisualizations()
  const cheatsheets = await getAllCheatsheets()
  const notes = getAllNotes()
  const studyDecks = getAllStudyDecks()
  
  // Filter out draft posts, visualizations, cheatsheets, and notes from sitemap
  const publishedPosts = posts.filter(post => post.visibility === 'public')
  const publishedVisualizations = visualizations.filter(viz => viz.visibility === 'public')
  const publishedCheatsheets = cheatsheets.filter(sheet => sheet.visibility === 'public')
  const publishedNotes = notes.filter(note => note.visible)
  // All study decks are considered published (no visibility filter needed based on current schema)
  const publishedStudyDecks = studyDecks
  
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

  const cheatsheetUrls = publishedCheatsheets.map((sheet) => ({
    url: getCanonicalUrl(`/cheatsheets/${sheet.id}`),
    lastModified: new Date(sheet.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const noteUrls = publishedNotes.map((note) => ({
    url: getCanonicalUrl(`/notes/${note.id}`),
    lastModified: note.publishedDate ? new Date(note.publishedDate) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const studyDeckUrls = publishedStudyDecks.map((deck) => ({
    url: getCanonicalUrl(`/study-decks/${deck.id}`),
    lastModified: new Date(deck.lastUpdated),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
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
      url: getCanonicalUrl('/cheatsheets'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: getCanonicalUrl('/notes'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: getCanonicalUrl('/study-decks'),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
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
    ...cheatsheetUrls,
    ...noteUrls,
    ...studyDeckUrls,
  ]
}
