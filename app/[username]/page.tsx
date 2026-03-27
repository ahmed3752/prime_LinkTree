import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ExternalLink } from 'lucide-react'
import { LinkIcon } from '@/components/link-icon'
import type { Metadata } from 'next'
import { ProfileTracker } from './tracker'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) return { title: 'User Not Found' }

  return {
    title: `${profile.full_name || username} (@${username}) | Prime Linktree`,
    description: profile.bio || `Check out ${profile.full_name || username}'s links on Prime Linktree.`,
    openGraph: {
      title: `${profile.full_name || username} (@${username})`,
      description: profile.bio || `Check out ${profile.full_name || username}'s links.`,
      images: profile.avatar_url ? [{ url: profile.avatar_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profile.full_name || username} (@${username})`,
      description: profile.bio || `Check out ${profile.full_name || username}'s links.`,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    }
  }
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const supabase = await createClient()

  // 1. Fetch the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) {
    notFound()
  }

  // 2. Fetch the user's active links
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  // Theme Handling
  const theme = profile.theme || { preset: 'default', buttonStyle: 'solid' }

  // Overarching container styling
  let containerClasses = 'min-h-screen '
  if (theme.preset === 'cyber') {
    containerClasses += 'bg-black text-white font-mono selection:bg-blue-500/30'
  } else if (theme.preset === 'emerald') {
    containerClasses += 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900 via-zinc-950 to-zinc-950 text-emerald-50'
  } else {
    containerClasses += 'bg-background text-foreground'
  }

  // Button styling mapping
  const getButtonStyles = () => {
    switch (theme.buttonStyle) {
      case 'outline':
        return 'bg-transparent text-foreground hover:bg-accent border-2 border-primary'
      case 'glass':
        return 'bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
      case 'solid':
      default:
        if (theme.preset === 'cyber') return 'bg-zinc-900 text-blue-400 hover:bg-blue-900/40 hover:text-blue-300 border border-zinc-800'
        return 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground border-border border-2'
    }
  }

  const btnStyles = getButtonStyles()

  return (
    <div className={containerClasses}>
      <ProfileTracker userId={profile.id} />
      
      <div className="flex flex-col items-center py-16 px-4 max-w-2xl mx-auto w-full space-y-8 animate-in fade-in duration-500">
        {/* Profile Header */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <Avatar className="h-24 w-24 border-4 border-transparent ring-4 ring-primary/10 transition-transform hover:scale-105 duration-300 shadow-xl">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || username} className="object-cover" />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {(profile.full_name || username).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {profile.full_name || `@${username}`}
            </h1>
            {profile.full_name && (
              <p className="text-sm font-medium opacity-70">@{username}</p>
            )}
          </div>
          
          {profile.bio && (
            <p className="text-sm max-w-sm text-balance leading-relaxed opacity-90">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links List */}
        <div className="w-full flex flex-col gap-4">
          {links && links.length > 0 ? (
            links.map((link, idx) => {
              if (link.type === 'header') {
                return (
                  <h2 
                    key={link.id} 
                    className="text-lg font-bold mt-8 mb-2 opacity-90 tracking-tight text-center animate-in fade-in slide-in-from-bottom-4"
                    style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
                  >
                    {link.title}
                  </h2>
                )
              }

              return (
                <Button
                  key={link.id}
                  asChild
                  variant="outline"
                  size="lg"
                  style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both', minHeight: '3.5rem', height: 'auto' }}
                  className={`w-full py-3 px-1 text-base transition-all hover:scale-[1.02] active:scale-[0.98] rounded-2xl group animate-in fade-in slide-in-from-bottom-4 ${btnStyles}`}
                >
                  <a href={`/api/click/${link.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full px-5">
                    <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                      <div className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                        <LinkIcon url={link.url} className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col items-start min-w-0 flex-1 text-left">
                        <span className="font-semibold">{link.title}</span>
                        {link.subtitle && (
                          <span className="text-xs opacity-70 mt-0.5 leading-snug break-words">
                            {link.subtitle}
                          </span>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 flex-shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </a>
                </Button>
              )
            })
          ) : (
            <div className="text-center py-12 opacity-60 text-sm">
              This profile hasn&apos;t added any links yet.
            </div>
          )}
        </div>

        {/* Footer / Branding */}
        <footer className="pt-12 pb-4">
          <a 
            href="/" 
            className="text-xs font-semibold tracking-widest uppercase opacity-20 hover:opacity-100 transition-opacity flex items-center gap-2"
          >
            Built with Prime Linktree
          </a>
        </footer>
      </div>
    </div>
  )
}
