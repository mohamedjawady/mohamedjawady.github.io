import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  
  // Get parameters from URL
  const title = searchParams.get('title') || '0xHabib Blog'
  const description = searchParams.get('description') || 'Cybersecurity Learning Journey'
  const author = searchParams.get('author') || '0xHabib'
  const tags = searchParams.get('tags')?.split(',') || []

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
        {/* Background pattern similar to homepage */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 20%, #22c55e15 0%, transparent 40%), radial-gradient(circle at 80% 80%, #16a34a15 0%, transparent 40%)',
          }}
        />
        
        {/* Main brand logo at top */}
        <div
          style={{
            display: 'flex',
            backgroundImage: 'linear-gradient(90deg, #22c55e, #16a34a)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: 48,
            fontWeight: 900,
            marginBottom: 40,
            textAlign: 'center',
          }}
        >
          0xHabib
        </div>

        {/* Post Title - Center stage */}
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

        {/* Tags in a centered layout */}
        {tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              marginBottom: 40,
              justifyContent: 'center',
              maxWidth: '80%',
            }}
          >
            {tags.slice(0, 3).map((tag, index) => (
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
        )}

        {/* Bottom tagline similar to homepage */}
        <div
          style={{
            display: 'flex',
            color: '#525252',
            fontSize: 24,
            textAlign: 'center',
            marginTop: 'auto',
          }}
        >
          Cybersecurity Learning Journey • {author}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
