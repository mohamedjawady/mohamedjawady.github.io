import { getPublicPosts } from '@/lib/posts'
import { getVisibleNotes } from '@/lib/notes'
import { getVisibleCheatsheets } from '@/lib/cheatsheets'
import { getVisibleVisualizations } from '@/lib/visualizations'
import { getAllStudyDecks } from '@/lib/study-decks'

export const dynamic = 'force-static'

// Prebuilt at build time so the LinkPreview hover card has something to read
// without a server: this site is a static export (no API routes survive it),
// but a route handler with no dynamic segments is itself prerendered into a
// plain JSON file here, the same way feed.xml and sitemap.xml are.
export async function GET() {
  const index: Record<string, unknown> = {}

  for (const post of await getPublicPosts()) {
    index[`post:${post.slug}`] = {
      title: post.title,
      description: post.description,
      type: 'post',
      metadata: { author: post.author, date: post.date, tags: post.tags, readingTime: post.readingTime },
    }
  }

  for (const note of getVisibleNotes()) {
    index[`note:${note.id}`] = {
      title: note.title,
      description: note.description,
      type: 'note',
      metadata: { author: note.author, date: note.publishedDate, tags: note.tags, difficulty: note.difficulty, category: note.category },
    }
  }

  for (const sheet of await getVisibleCheatsheets()) {
    index[`cheatsheet:${sheet.id}`] = {
      title: sheet.title,
      description: sheet.description,
      type: 'cheatsheet',
      metadata: { author: sheet.author, date: sheet.date, tags: sheet.tags, difficulty: sheet.difficulty, category: sheet.category },
    }
  }

  for (const viz of await getVisibleVisualizations()) {
    index[`visualization:${viz.id}`] = {
      title: viz.title,
      description: viz.description,
      type: 'visualization',
      metadata: { author: viz.author, date: viz.date, tags: viz.tags },
    }
  }

  for (const deck of getAllStudyDecks()) {
    index[`study-deck:${deck.id}`] = {
      title: deck.title,
      description: deck.description,
      type: 'study-deck',
      metadata: { tags: deck.tags, difficulty: deck.difficulty, category: deck.category },
    }
  }

  return Response.json(index)
}
