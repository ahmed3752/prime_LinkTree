import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch the exact link to get the target URL and user_id
  const { data: link, error } = await supabase
    .from('links')
    .select('user_id, url')
    .eq('id', id)
    .single()

  // If the link doesn't exist, simply route back to home or a 404
  if (error || !link || !link.url) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 2. Log the click asynchronously (fire and forget)
  // Note: Vercel might kill the function instantly upon redirect.
  // Wait for the insert to guarantee the log, it takes ~50ms
  await supabase.from('analytics').insert({
    user_id: link.user_id,
    link_id: id,
    event_type: 'click'
  })

  // 3. Perform a 302 Redirect to the final destination
  return NextResponse.redirect(link.url, 302)
}
