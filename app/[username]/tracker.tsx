'use client'

import { useEffect, useRef } from 'react'
import { trackProfileView } from '../analytics/actions'

export function ProfileTracker({ userId }: { userId: string }) {
  const tracked = useRef(false)

  useEffect(() => {
    if (!tracked.current) {
      tracked.current = true
      // We don't await because it's fire-and-forget
      trackProfileView(userId).catch(console.error)
    }
  }, [userId])

  return null // Render nothing, this is purely an invisible behavior wrapper
}
