import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  try {
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
            backgroundImage: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #ffffff 100%)',
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
              marginBottom: '60px',
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
                  fontSize: '48px',
                }}
              >
                📝
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#059669',
                  fontSize: '32px',
                  fontWeight: '700',
                }}
              >
                Learning Notes
              </div>
            </div>
            
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#64748b',
                fontSize: '28px',
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
              alignItems: 'center',
              textAlign: 'center',
              gap: '32px',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            {/* Title */}
            <h1
              style={{
                fontSize: '72px',
                fontWeight: '900',
                lineHeight: '1.1',
                color: '#1e293b',
                margin: 0,
                textAlign: 'center',
              }}
            >
              Personal Knowledge
              <br />
              Collection
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: '32px',
                color: '#64748b',
                fontWeight: '500',
                margin: 0,
                textAlign: 'center',
                maxWidth: '800px',
                lineHeight: '1.3',
              }}
            >
              Notes from books, courses, videos, and other learning materials
            </p>

            {/* Content Types */}
            <div
              style={{
                display: 'flex',
                gap: '32px',
                marginTop: '40px',
              }}
            >
              {[
                { icon: '📚', label: 'Books' },
                { icon: '🎓', label: 'Courses' },
                { icon: '🎥', label: 'Videos' },
                { icon: '🎧', label: 'Podcasts' },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'white',
                    padding: '24px',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: '2px solid #d1fae5',
                  }}
                >
                  <div style={{ fontSize: '40px' }}>{item.icon}</div>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#059669',
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginTop: '40px',
              paddingTop: '32px',
              borderTop: '3px solid #6ee7b7',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#059669',
                fontSize: '24px',
                fontWeight: '600',
              }}
            >
              Organized • Searchable • Actionable
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
