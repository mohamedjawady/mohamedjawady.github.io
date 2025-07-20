import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { StudyDeck, StudyCard } from './study-decks.types'

interface StudyDeckGeneratorConfig {
  noteId: string
  deckTitle?: string
  deckDescription?: string
  targetCardCount?: number
  includedSections?: string[]
  excludedSections?: string[]
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  cardTypes?: StudyCard['type'][]
}

export class StudyDeckGenerator {
  private notesDirectory = path.join(process.cwd(), 'content/notes')
  private decksDirectory = path.join(process.cwd(), 'content/study-decks')

  /**
   * Generate a study deck from a note file
   */
  async generateDeckFromNote(config: StudyDeckGeneratorConfig): Promise<StudyDeck | null> {
    try {
      const noteContent = this.readNoteFile(config.noteId)
      if (!noteContent) {
        throw new Error(`Note ${config.noteId} not found`)
      }

      const sections = this.parseNoteSections(noteContent.content)
      const cards = this.generateCardsFromSections(sections, config)
      
      const deck: StudyDeck = {
        id: this.generateDeckId(config.noteId),
        title: config.deckTitle || noteContent.data.title || 'Generated Study Deck',
        description: config.deckDescription || noteContent.data.description || 'Study cards generated from note content',
        sourceNote: config.noteId,
        category: noteContent.data.category || 'general',
        tags: noteContent.data.tags || [],
        difficulty: config.difficulty || noteContent.data.difficulty || 'intermediate',
        estimatedTime: this.calculateEstimatedTime(cards.length),
        totalCards: cards.length,
        createdDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        cards
      }

      return deck
    } catch (error) {
      console.error('Error generating study deck:', error)
      return null
    }
  }

  /**
   * Save a generated deck to file
   */
  async saveDeck(deck: StudyDeck): Promise<boolean> {
    try {
      const deckPath = path.join(this.decksDirectory, `${deck.id}.json`)
      fs.writeFileSync(deckPath, JSON.stringify(deck, null, 2))
      return true
    } catch (error) {
      console.error('Error saving study deck:', error)
      return false
    }
  }

  /**
   * Generate study deck templates for common question types
   */
  generateTemplateCards(content: string, title: string): StudyCard[] {
    const templates: Array<{
      type: StudyCard['type']
      category: string
      frontTemplate: string
      backTemplate: string
      difficulty: StudyCard['difficulty']
    }> = [
      {
        type: 'definition',
        category: 'fundamentals',
        frontTemplate: `What is ${title.toLowerCase()}?`,
        backTemplate: 'Define the concept and explain its key characteristics.',
        difficulty: 'beginner'
      },
      {
        type: 'list',
        category: 'components',
        frontTemplate: `What are the main components or elements of ${title.toLowerCase()}?`,
        backTemplate: 'List and briefly explain each component.',
        difficulty: 'intermediate'
      },
      {
        type: 'comparison',
        category: 'analysis',
        frontTemplate: `Compare different approaches or types within ${title.toLowerCase()}.`,
        backTemplate: 'Outline similarities, differences, and use cases.',
        difficulty: 'intermediate'
      },
      {
        type: 'scenario',
        category: 'application',
        frontTemplate: `Describe a real-world scenario where ${title.toLowerCase()} would be applied.`,
        backTemplate: 'Provide context, implementation steps, and expected outcomes.',
        difficulty: 'advanced'
      },
      {
        type: 'technical',
        category: 'implementation',
        frontTemplate: `What are the technical requirements for implementing ${title.toLowerCase()}?`,
        backTemplate: 'Detail technical specifications, tools, and considerations.',
        difficulty: 'advanced'
      }
    ]

    return templates.map((template, index) => ({
      id: `template-${index + 1}`,
      type: template.type,
      category: template.category,
      front: template.frontTemplate,
      back: template.backTemplate,
      tags: ['template', 'generated'],
      difficulty: template.difficulty
    }))
  }

  private readNoteFile(noteId: string): { data: any; content: string } | null {
    try {
      const filePath = path.join(this.notesDirectory, `${noteId}.md`)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      return matter(fileContents)
    } catch (error) {
      return null
    }
  }

  private parseNoteSections(content: string): Array<{ title: string; content: string; level: number }> {
    const lines = content.split('\n')
    const sections: Array<{ title: string; content: string; level: number }> = []
    let currentSection: { title: string; content: string; level: number } | null = null

    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/)
      
      if (headerMatch) {
        // Save previous section
        if (currentSection) {
          sections.push(currentSection)
        }
        
        // Start new section
        currentSection = {
          title: headerMatch[2],
          content: '',
          level: headerMatch[1].length
        }
      } else if (currentSection) {
        currentSection.content += line + '\n'
      }
    }

    // Add final section
    if (currentSection) {
      sections.push(currentSection)
    }

    return sections
  }

  private generateCardsFromSections(
    sections: Array<{ title: string; content: string; level: number }>,
    config: StudyDeckGeneratorConfig
  ): StudyCard[] {
    const cards: StudyCard[] = []
    let cardId = 1

    for (const section of sections) {
      // Skip sections based on config
      if (config.includedSections && !config.includedSections.includes(section.title)) {
        continue
      }
      if (config.excludedSections && config.excludedSections.includes(section.title)) {
        continue
      }

      // Generate definition card for major sections
      if (section.level <= 2 && section.content.trim().length > 50) {
        cards.push({
          id: `${config.noteId}-${cardId.toString().padStart(3, '0')}`,
          type: 'definition',
          category: this.categorizeSection(section.title),
          front: `What is ${section.title}?`,
          back: this.extractDefinition(section.content),
          tags: this.extractTags(section.title, section.content),
          difficulty: config.difficulty || 'intermediate'
        })
        cardId++
      }

      // Generate list cards for sections with bullet points
      const listItems = this.extractListItems(section.content)
      if (listItems.length >= 3) {
        cards.push({
          id: `${config.noteId}-${cardId.toString().padStart(3, '0')}`,
          type: 'list',
          category: this.categorizeSection(section.title),
          front: `What are the key points about ${section.title}?`,
          back: listItems.join('\n'),
          tags: this.extractTags(section.title, section.content),
          difficulty: config.difficulty || 'intermediate'
        })
        cardId++
      }

      // Stop if we've reached target card count
      if (config.targetCardCount && cards.length >= config.targetCardCount) {
        break
      }
    }

    return cards
  }

  private categorizeSection(title: string): string {
    const titleLower = title.toLowerCase()
    
    if (titleLower.includes('fundamental') || titleLower.includes('basic') || titleLower.includes('introduction')) {
      return 'fundamentals'
    }
    if (titleLower.includes('process') || titleLower.includes('workflow') || titleLower.includes('procedure')) {
      return 'process'
    }
    if (titleLower.includes('tool') || titleLower.includes('technology') || titleLower.includes('software')) {
      return 'tools'
    }
    if (titleLower.includes('implementation') || titleLower.includes('technical') || titleLower.includes('setup')) {
      return 'implementation'
    }
    if (titleLower.includes('best practice') || titleLower.includes('recommendation') || titleLower.includes('guideline')) {
      return 'best-practices'
    }
    
    return 'general'
  }

  private extractDefinition(content: string): string {
    // Extract first paragraph or first few sentences
    const paragraphs = content.trim().split('\n\n')
    const firstParagraph = paragraphs[0]?.trim()
    
    if (firstParagraph && firstParagraph.length > 20) {
      return firstParagraph.length > 300 
        ? firstParagraph.substring(0, 300) + '...'
        : firstParagraph
    }
    
    return 'Definition not available - please review the source material.'
  }

  private extractListItems(content: string): string[] {
    const lines = content.split('\n')
    const listItems: string[] = []
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
        listItems.push(trimmed)
      }
      // Also check for numbered lists
      if (/^\d+\.\s/.test(trimmed)) {
        listItems.push(trimmed)
      }
    }
    
    return listItems
  }

  private extractTags(title: string, content: string): string[] {
    const tags: string[] = []
    
    // Add tags based on title
    const titleWords = title.toLowerCase().split(/\s+/)
    tags.push(...titleWords.filter(word => word.length > 3))
    
    // Add common cybersecurity terms found in content
    const commonTerms = [
      'security', 'monitoring', 'detection', 'response', 'threat', 'vulnerability',
      'incident', 'analysis', 'intelligence', 'framework', 'process', 'tool',
      'network', 'endpoint', 'siem', 'soc', 'nsm', 'csm'
    ]
    
    const contentLower = content.toLowerCase()
    for (const term of commonTerms) {
      if (contentLower.includes(term) && !tags.includes(term)) {
        tags.push(term)
      }
    }
    
    return tags.slice(0, 6) // Limit to 6 tags
  }

  private generateDeckId(noteId: string): string {
    return `${noteId}-deck`
  }

  private calculateEstimatedTime(cardCount: number): string {
    // Estimate 1.5-2 minutes per card
    const minMinutes = Math.ceil(cardCount * 1.5)
    const maxMinutes = Math.ceil(cardCount * 2)
    return `${minMinutes}-${maxMinutes} minutes`
  }
}

// Helper function to create a study deck generator instance
export function createStudyDeckGenerator(): StudyDeckGenerator {
  return new StudyDeckGenerator()
}

// Quick generator function for common use cases
export async function generateQuickDeck(
  noteId: string,
  options: Partial<StudyDeckGeneratorConfig> = {}
): Promise<StudyDeck | null> {
  const generator = createStudyDeckGenerator()
  const config: StudyDeckGeneratorConfig = {
    noteId,
    targetCardCount: 20,
    difficulty: 'intermediate',
    ...options
  }
  
  const deck = await generator.generateDeckFromNote(config)
  if (deck) {
    await generator.saveDeck(deck)
  }
  
  return deck
}
