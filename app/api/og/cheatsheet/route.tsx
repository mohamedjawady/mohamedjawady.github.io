import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Get parameters from URL
  const title = searchParams.get('title') || '0xHabib Cheatsheets'
  const description = searchParams.get('description') || 'Quick Reference Guide'
  const author = searchParams.get('author') || '0xHabib'
  const category = searchParams.get('category') || 'general'
  const difficulty = searchParams.get('difficulty') || 'intermediate'
  const tags = searchParams.get('tags')?.split(',') || []

  // Determine difficulty colors
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return { bg: '#22c55e25', border: '#22c55e50', color: '#22c55e' }
      case 'intermediate':
        return { bg: '#f59e0b25', border: '#f59e0b50', color: '#f59e0b' }
      case 'advanced':
        return { bg: '#ef444425', border: '#ef444450', color: '#ef4444' }
      default:
        return { bg: '#6366f125', border: '#6366f150', color: '#6366f1' }
    }
  }

  const difficultyColors = getDifficultyColor(difficulty)

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          fontSize: 60,
          fontWeight: 700,
          position: 'relative',
          padding: '80px',
        }}
      >
        {/* Background pattern with cheatsheet theme */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 20%, #6366f115 0%, transparent 40%), radial-gradient(circle at 80% 80%, #f59e0b15 0%, transparent 40%), radial-gradient(circle at 50% 50%, #22c55e10 0%, transparent 30%)',
          }}
        />
        
        {/* Main brand logo at top */}
        <div
          style={{
            display: 'flex',
            backgroundImage: 'linear-gradient(90deg, #6366f1, #f59e0b)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: 48,
            fontWeight: 900,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          0xHabib
        </div>

        {/* Cheatsheet badge */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#6366f125',
            border: '2px solid #6366f150',
            color: '#6366f1',
            padding: '8px 16px',
            borderRadius: 6,
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 24,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Quick Reference
        </div>

        {/* Cheatsheet Title - Center stage */}
        <div
          style={{
            display: 'flex',
            color: '#ffffff',
            fontSize: title.length > 60 ? 42 : title.length > 40 ? 48 : 56,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 24,
            textAlign: 'center',
            maxWidth: '90%',
          }}
        >
          {title}
        </div>

        {/* Description */}
        {description && (
          <div
            style={{
              display: 'flex',
              color: '#a3a3a3',
              fontSize: 28,
              lineHeight: 1.3,
              marginBottom: 32,
              textAlign: 'center',
              maxWidth: '80%',
            }}
          >
            {description.length > 120 ? description.substring(0, 120) + '...' : description}
          </div>
        )}

        {/* Difficulty, Category, and Tags */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 40,
            justifyContent: 'center',
            maxWidth: '80%',
            alignItems: 'center',
          }}
        >
          {/* Difficulty badge */}
          <div
            style={{
              display: 'flex',
              backgroundColor: difficultyColors.bg,
              border: `2px solid ${difficultyColors.border}`,
              color: difficultyColors.color,
              padding: '12px 20px',
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {difficulty} Level
          </div>

          {/* Category badge */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#8b5cf625',
              border: '2px solid #8b5cf650',
              color: '#8b5cf6',
              padding: '12px 20px',
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {category}
          </div>

          {/* Tags */}
          {tags.slice(0, 2).map((tag, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                backgroundColor: '#16a34a25',
                border: '2px solid #22c55e50',
                color: '#22c55e',
                padding: '12px 20px',
                borderRadius: 8,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              #{tag.trim()}
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            display: 'flex',
            color: '#525252',
            fontSize: 24,
            textAlign: 'center',
            marginTop: 'auto',
          }}
        >
          Quick Reference Guide • {author}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
