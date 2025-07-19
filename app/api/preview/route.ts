import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/posts'
import { getNoteById } from '@/lib/notes'
import { getCheatsheetById } from '@/lib/cheatsheets'
import { getVisualizationById } from '@/lib/visualizations'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const type = searchParams.get('type')
  const id = searchParams.get('id')

  if (!type || !id) {
    return NextResponse.json({ error: 'Missing type or id parameter' }, { status: 400 })
  }

  try {
    let content = null

    switch (type) {
      case 'post':
        content = await getPostBySlug(id)
        if (content) {
          return NextResponse.json({
            title: content.title,
            description: content.description,
            type: 'post',
            metadata: {
              author: content.author,
              date: content.date,
              tags: content.tags,
              readingTime: content.readingTime,
              visibility: content.visibility
            }
          })
        }
        break

      case 'note':
        content = getNoteById(id)
        if (content) {
          return NextResponse.json({
            title: content.title,
            description: content.description,
            type: content.type,
            metadata: {
              author: content.author,
              date: content.publishedDate,
              tags: content.tags,
              category: content.category,
              difficulty: content.difficulty,
              status: content.status,
              source: content.source
            }
          })
        }
        break

      case 'cheatsheet':
        content = await getCheatsheetById(id)
        if (content) {
          return NextResponse.json({
            title: content.title,
            description: content.description,
            type: 'cheatsheet',
            metadata: {
              author: content.author,
              date: content.date,
              tags: content.tags,
              category: content.category,
              difficulty: content.difficulty,
              visibility: content.visibility
            }
          })
        }
        break

      case 'visualization':
        content = await getVisualizationById(id)
        if (content) {
          return NextResponse.json({
            title: content.title,
            description: content.description,
            type: 'visualization',
            metadata: {
              author: content.author,
              date: content.date,
              tags: content.tags,
              relatedPost: content.relatedPost,
              visibility: content.visibility
            }
          })
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

  } catch (error) {
    console.error('Error fetching content preview:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }

  return NextResponse.json({ error: 'Content not found' }, { status: 404 })
}
