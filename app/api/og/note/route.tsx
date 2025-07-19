import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Get parameters from URL
  const title = searchParams.get('title') || 'Learning Note'
  const description = searchParams.get('description') || 'Personal Knowledge Base'
  const author = searchParams.get('author') || '0xHabib'
  const source = searchParams.get('source') || ''
  const type = searchParams.get('type') || 'reading'
  const difficulty = searchParams.get('difficulty') || 'beginner'
  const tags = searchParams.get('tags')?.split(',') || []

  // Define colors based on difficulty - using darker theme like posts
  const getDifficultyColors = (level: string) => {
    switch (level) {
      case 'advanced':
        return { primary: '#ef4444', bg: '#ef444425', border: '#ef444450' }
      case 'intermediate':
        return { primary: '#f59e0b', bg: '#f59e0b25', border: '#f59e0b50' }
      default: // beginner
        return { primary: '#10b981', bg: '#10b98125', border: '#10b98150' }
    }
  }

  const colors = getDifficultyColors(difficulty)

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
          padding: '60px',
        }}
      >
        {/* Background pattern similar to posts */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 20% 20%, ${colors.bg} 0%, transparent 40%), radial-gradient(circle at 80% 80%, ${colors.bg} 0%, transparent 40%)`,
          }}
        />
        
        {/* Main brand logo at top */}
        <div
          style={{
            display: 'flex',
            backgroundImage: `linear-gradient(90deg, ${colors.primary}, ${colors.primary}dd)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: 40,
            fontWeight: 900,
            marginBottom: 30,
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          0xHabib Notes
        </div>

        {/* Type and Difficulty badges */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            marginBottom: 24,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              backgroundColor: colors.bg,
              border: `2px solid ${colors.border}`,
              color: colors.primary,
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            📝 {type}
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: colors.bg,
              border: `2px solid ${colors.border}`,
              color: colors.primary,
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 18,
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {difficulty}
          </div>
        </div>

        {/* Note Title - Center stage */}
        <div
          style={{
            display: 'flex',
            color: '#ffffff',
            fontSize: title.length > 60 ? 36 : title.length > 40 ? 42 : 48,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 20,
            textAlign: 'center',
            maxWidth: '90%',
          }}
        >
          {title}
        </div>

        {/* Source */}
        {source && (
          <div
            style={{
              display: 'flex',
              color: colors.primary,
              fontSize: 20,
              lineHeight: 1.3,
              marginBottom: 16,
              textAlign: 'center',
              maxWidth: '80%',
            }}
          >
            📚 {source}
          </div>
        )}

        {/* Description */}
        {description && description !== 'Personal Knowledge Base' && (
          <div
            style={{
              display: 'flex',
              color: '#a3a3a3',
              fontSize: 22,
              lineHeight: 1.3,
              marginBottom: 24,
              textAlign: 'center',
              maxWidth: '80%',
            }}
          >
            {description.length > 100 ? description.substring(0, 100) + '...' : description}
          </div>
        )}

        {/* Tags in a centered layout */}
        {tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 24,
              justifyContent: 'center',
              maxWidth: '80%',
            }}
          >
            {tags.slice(0, 3).map((tag, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  backgroundColor: colors.bg,
                  border: `2px solid ${colors.border}`,
                  color: colors.primary,
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                #{tag.trim()}
              </div>
            ))}
          </div>
        )}

        {/* Bottom tagline */}
        <div
          style={{
            display: 'flex',
            color: '#525252',
            fontSize: 20,
            textAlign: 'center',
            marginTop: 'auto',
          }}
        >
          Personal Knowledge Base • {author}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
