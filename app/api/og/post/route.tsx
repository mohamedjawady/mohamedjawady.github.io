import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
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
          backgroundColor: '#0a0a0a',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 25% 25%, #22c55e20 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16a34a20 0%, transparent 50%)',
          }}
        />
        
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              backgroundImage: 'linear-gradient(90deg, #22c55e, #16a34a)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontSize: 36,
              fontWeight: 900,
            }}
          >
            0xHabib
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            color: '#ffffff',
            fontSize: title.length > 50 ? 48 : 56,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 20,
            maxWidth: '100%',
          }}
        >
          {title}
        </div>

        {/* Description */}
        {description && (
          <div
            style={{
              color: '#a3a3a3',
              fontSize: 24,
              lineHeight: 1.3,
              marginBottom: 30,
              maxWidth: '90%',
            }}
          >
            {description.length > 150 ? description.substring(0, 150) + '...' : description}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 30,
            }}
          >
            {tags.slice(0, 4).map((tag, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#16a34a20',
                  border: '1px solid #22c55e40',
                  color: '#22c55e',
                  padding: '8px 16px',
                  borderRadius: 6,
                  fontSize: 18,
                  fontWeight: 500,
                }}
              >
                #{tag.trim()}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              color: '#737373',
              fontSize: 20,
            }}
          >
            By {author}
          </div>
          <div
            style={{
              color: '#525252',
              fontSize: 18,
            }}
          >
            0xhabib.tech
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
