import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'radial-gradient(ellipse at top, #10b981, #09090b)',
          border: '1px solid rgba(255,255,255,0.2)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '50%',
          fontWeight: '900',
        }}
      >
        P
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}
