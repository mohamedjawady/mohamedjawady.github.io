import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
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
        }}
      >
        <div
          style={{
            backgroundImage: 'linear-gradient(90deg, #22c55e, #16a34a)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: 80,
            fontWeight: 900,
            marginBottom: 20,
          }}
        >
          0xHabib
        </div>
        <div
          style={{
            color: '#a3a3a3',
            fontSize: 32,
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.2,
          }}
        >
          Cybersecurity Learning Journey
        </div>
        <div
          style={{
            color: '#525252',
            fontSize: 24,
            marginTop: 20,
            textAlign: 'center',
          }}
        >
          Documenting what I break, build, and learn in security
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}
