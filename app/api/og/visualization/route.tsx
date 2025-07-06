import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Get parameters from URL
  const title = searchParams.get('title') || '0xHabib Visualizations'
  const description = searchParams.get('description') || 'Interactive Visualizations'
  const author = searchParams.get('author') || '0xHabib'
  const category = searchParams.get('category') || 'Visualization'
  const relatedPost = searchParams.get('relatedPost') || null
  const tags = searchParams.get('tags')?.split(',') || []

  // Determine if this is post-related or orphan
  const visualizationType = relatedPost ? 'post related' : 'orphan visualization'
  
  const getTypeColor = (type: string) => {
    if (type === 'post related') {
      return { bg: '#3b82f625', border: '#3b82f650', color: '#3b82f6' }
    } else {
      return { bg: '#8b5cf625', border: '#8b5cf650', color: '#8b5cf6' }
    }
  }

  const typeColors = getTypeColor(visualizationType)

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
        {/* Background pattern with visualization theme */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 20%, #22c55e15 0%, transparent 40%), radial-gradient(circle at 80% 80%, #8b5cf615 0%, transparent 40%), radial-gradient(circle at 50% 50%, #f59e0b10 0%, transparent 30%)',
          }}
        />
        
        {/* Main brand logo at top */}
        <div
          style={{
            display: 'flex',
            backgroundImage: 'linear-gradient(90deg, #22c55e, #8b5cf6)',
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

        {/* Category badge */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#8b5cf625',
            border: '2px solid #8b5cf650',
            color: '#8b5cf6',
            padding: '8px 16px',
            borderRadius: 6,
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 24,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {category} • Interactive Visualization
        </div>

        {/* Visualization Title - Center stage */}
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

        {/* Type and Tags */}
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
          {/* Type badge */}
          <div
            style={{
              display: 'flex',
              backgroundColor: typeColors.bg,
              border: `2px solid ${typeColors.border}`,
              color: typeColors.color,
              padding: '12px 20px',
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {visualizationType}
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
          Interactive Learning • {author}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
