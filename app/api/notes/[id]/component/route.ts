import { NextRequest, NextResponse } from 'next/server'
import { loadNoteComponent } from '@/lib/notes'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Note ID is required' }, { status: 400 })
    }

    const component = await loadNoteComponent(id)
    
    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error loading component:', error)
    return NextResponse.json({ error: 'Failed to load component' }, { status: 500 })
  }
}
