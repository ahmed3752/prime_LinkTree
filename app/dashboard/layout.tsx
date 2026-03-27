import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, LogOut, LayoutDashboard, Palette } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '../login/actions'
import { ReactNode } from 'react'
import { DashboardNav } from './nav'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-4 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your links and profile.</p>
        </div>
        <div className="flex items-center gap-2">
          {profile && (
            <Button variant="outline" asChild size="sm" className="hidden sm:flex">
              <Link href={`/${profile.username}`} target="_blank">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Page
              </Link>
            </Button>
          )}
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </header>

      <DashboardNav />

      <main>{children}</main>
    </div>
  )
}
