'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-4 border-b pb-4 mb-6">
      <Link 
        href="/dashboard"
        className={cn(
          "flex items-center text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md",
          pathname === '/dashboard' 
            ? "bg-secondary text-secondary-foreground" 
            : "text-muted-foreground"
        )}
      >
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Links
      </Link>
      <Link 
        href="/dashboard/appearance"
        className={cn(
          "flex items-center text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md",
          pathname?.includes('/dashboard/appearance') 
            ? "bg-secondary text-secondary-foreground" 
            : "text-muted-foreground"
        )}
      >
        <Palette className="mr-2 h-4 w-4" />
        Appearance
      </Link>
    </nav>
  )
}
