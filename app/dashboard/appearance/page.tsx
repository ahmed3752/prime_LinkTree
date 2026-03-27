import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { AppearanceEditor } from './appearance-editor'

export default async function AppearancePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's profile to get the current theme settings
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/dashboard') // If no profile, force them to set one up on the main dashboard
  }

  // Fallback default theme structure
  const currentTheme = profile.theme || { preset: 'default', buttonStyle: 'solid' }

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-500">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Appearance</h2>
        <p className="text-sm text-muted-foreground">
          Customize the look and feel of your public profile page.
        </p>
      </div>

      <AppearanceEditor initialTheme={currentTheme} profileUrl={`/${profile.username}`} />
    </div>
  )
}
