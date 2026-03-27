import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-12">
      <div className="space-y-6 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Sparkles className="h-3 w-3" />
          The future of link-in-bio
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
          Everything you are. <br />
          <span className="text-muted-foreground">In one simple link.</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Join 10+ people who use Prime Linktree to share their content, 
          socials, and projects in a beautiful way.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
        <Button asChild size="lg" className="h-14 px-8 text-base rounded-full shadow-lg hover:shadow-primary/20 transition-all">
          <Link href="/login">
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base rounded-full">
          <Link href="/login">
            Login
          </Link>
        </Button>
      </div>

      <div className="pt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl w-full animate-in fade-in duration-1000 delay-500 fill-mode-both">
        {[
          { title: "Beautifully Rounded", desc: "Built with the Maia design system for a friendly, modern look." },
          { title: "Blazing Fast", desc: "Powered by Next.js 16 and Supabase for instant loading." },
          { title: "Easy Management", desc: "Drag, drop, and toggle links in seconds from your dashboard." }
        ].map((feature, i) => (
          <div key={i} className="p-6 rounded-2xl border bg-card/50 text-left space-y-2">
            <h3 className="font-bold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
