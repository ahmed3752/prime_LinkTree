import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileEditor } from './profile-editor'
import { LinkList } from './link-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Activity } from 'lucide-react'
import { AnalyticsChart } from './analytics-chart'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // If no profile exists, the user needs to set up their username
  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <ProfileEditor userId={user.id} />
      </div>
    )
  }

  // Fetch the user's links
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .order('order_index', { ascending: true })

  // Fetch analytics for chart (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: rawEvents } = await supabase
    .from('analytics')
    .select('event_type, created_at')
    .eq('user_id', user.id)
    .gte('created_at', sevenDaysAgo.toISOString())

  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    
    const ISODate = d.toISOString().split('T')[0] // 'YYYY-MM-DD'
    const displayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return { ISODate, displayDate }
  })

  const chartData = last7Days.map(({ ISODate, displayDate }) => {
    return {
      displayDate,
      views: rawEvents?.filter((e: any) => e.event_type === 'view' && e.created_at.startsWith(ISODate)).length || 0,
      clicks: rawEvents?.filter((e: any) => e.event_type === 'click' && e.created_at.startsWith(ISODate)).length || 0,
    }
  })

  // Quick Stats
  const totalViews = rawEvents?.filter(e => e.event_type === 'view').length || 0
  const totalClicks = rawEvents?.filter(e => e.event_type === 'click').length || 0

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_350px]">
      <div className="space-y-8 animate-in fade-in duration-500">
        
        {/* Analytics Section */}
        <section className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 flex flex-col justify-center gap-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  Total Views (7d)
                </span>
                <span className="text-3xl font-bold">{totalViews}</span>
              </CardContent>
            </Card>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 flex flex-col justify-center gap-1">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  Total Clicks (7d)
                </span>
                <span className="text-3xl font-bold">{totalClicks}</span>
              </CardContent>
            </Card>
          </div>
          <AnalyticsChart data={chartData} />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Your Links</h2>
          <LinkList links={links || []} />
        </section>
      </div>

      <aside className="space-y-6">
        <Card>
          <CardHeader className="pb-3 border-b border-border/50">
            <div className="flex items-center gap-3">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="Avatar" className="h-12 w-12 rounded-full object-cover shadow-sm border border-border" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted border">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
              <div>
                <CardTitle className="text-lg">@{profile.username}</CardTitle>
                <CardDescription>{profile.full_name || 'No name set'}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <ProfileEditor 
          userId={user.id} 
          initialProfile={{
            username: profile.username,
            full_name: profile.full_name,
            bio: profile.bio
          }} 
        />
      </aside>
    </div>
  )
}
