import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
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
        {/* Background pattern similar to posts */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 20%, #10b98125 0%, transparent 40%), radial-gradient(circle at 80% 80%, #059f8015 0%, transparent 40%)',
          }}
        />
        
        {/* Main brand logo at top */}
        <div
          style={{
            display: 'flex',
            backgroundImage: 'linear-gradient(90deg, #10b981, #059f80)',
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

        {/* Notes Icon and Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontSize: 72,
            }}
          >
            📝
          </div>
          <div
            style={{
              display: 'flex',
              color: '#ffffff',
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            Learning Notes
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            display: 'flex',
            color: '#a3a3a3',
            fontSize: 32,
            lineHeight: 1.3,
            marginBottom: 40,
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          Personal Knowledge Base & Study Materials
        </div>

        {/* Category badges */}
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
          <div
            style={{
              display: 'flex',
              backgroundColor: '#10b98125',
              border: '2px solid #10b98150',
              color: '#10b981',
              padding: '12px 20px',
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            📚 Books
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: '#f59e0b25',
              border: '2px solid #f59e0b50',
              color: '#f59e0b',
              padding: '12px 20px',
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            🎓 Courses
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: '#ef444425',
              border: '2px solid #ef444450',
              color: '#ef4444',
              padding: '12px 20px',
              borderRadius: 8,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            📄 Articles
          </div>
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
          Cybersecurity Learning Journey • Knowledge Collection
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
