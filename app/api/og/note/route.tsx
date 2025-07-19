import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Get parameters from URL
    const title = searchParams.get('title') || 'Learning Note'
    const source = searchParams.get('source') || ''
    const type = searchParams.get('type') || 'article'
    const difficulty = searchParams.get('difficulty') || 'beginner'

    // Define colors based on difficulty
    const getDifficultyColors = (level: string) => {
      switch (level) {
        case 'advanced':
          return { primary: '#dc2626', secondary: '#fca5a5', bg: '#fef2f2' }
        case 'intermediate':
          return { primary: '#d97706', secondary: '#fcd34d', bg: '#fffbeb' }
        default: // beginner
          return { primary: '#059669', secondary: '#6ee7b7', bg: '#f0fdf4' }
      }
    }

    const colors = getDifficultyColors(difficulty)

    // Get type icon
    const getTypeDisplay = (noteType: string) => {
      switch (noteType) {
        case 'book': return '📚 Book'
        case 'course': return '🎓 Course'
        case 'video': return '🎥 Video'
        case 'podcast': return '🎧 Podcast'
        case 'article': return '📄 Article'
        case 'lecture': return '💻 Lecture'
        default: return '📄 Note'
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundImage: `linear-gradient(135deg, ${colors.bg} 0%, #ffffff 100%)`,
            padding: '80px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: colors.primary,
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '28px',
                  fontWeight: '600',
                }}
              >
                {getTypeDisplay(type)}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: colors.secondary,
                  color: colors.primary,
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '20px',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                }}
              >
                {difficulty}
              </div>
            </div>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#64748b',
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              0xhabib
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              width: '100%',
              flex: 1,
            }}
          >
            {/* Title */}
            <h1
              style={{
                fontSize: '56px',
                fontWeight: '800',
                lineHeight: '1.1',
                color: '#1e293b',
                margin: 0,
                maxWidth: '100%',
                wordWrap: 'break-word',
              }}
            >
              {title}
            </h1>

            {/* Source */}
            {source && (
              <div
                style={{
                  fontSize: '32px',
                  color: '#64748b',
                  fontWeight: '500',
                  margin: 0,
                }}
              >
                from {source}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginTop: '40px',
              paddingTop: '32px',
              borderTop: `3px solid ${colors.secondary}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: colors.primary,
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              📝 Learning Notes
            </div>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#64748b',
                fontSize: '20px',
              }}
            >
              Personal Knowledge Base
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
