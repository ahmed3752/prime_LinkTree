'use server'

import { createClient } from '@/utils/supabase/server'

export async function trackProfileView(userId: string) {
  // We don't check auth here because ANYONE on the internet can view a profile
  const supabase = await createClient()
  
  // We use a "fire and forget" pattern. If it fails, we don't crash the user's page.
  await supabase.from('analytics').insert({
    user_id: userId,
    event_type: 'view'
  })
}
