import { getAllStudyDecks, getStudyDeckById } from '@/lib/study-decks'
import { notFound } from 'next/navigation'
import { StudySessionClient } from './study/study-session-client'

export async function generateStaticParams() {
  const decks = getAllStudyDecks()
  return decks.map(deck => ({ id: deck.id }))
}

export default async function StudyDeckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deck = getStudyDeckById(id)
  if (!deck) notFound()
  return <StudySessionClient deck={deck} deckId={id} />
}
