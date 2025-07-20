import { NextRequest, NextResponse } from 'next/server'
import { getStudyDeckById } from '@/lib/study-decks'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deck = getStudyDeckById(params.id)
    
    if (!deck) {
      return NextResponse.json(
        { error: 'Study deck not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(deck)
  } catch (error) {
    console.error('Error fetching study deck:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
