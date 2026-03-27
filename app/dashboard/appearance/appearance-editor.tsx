'use client'

import { useState, useTransition } from 'react'
import { updateTheme } from '../actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Palette } from 'lucide-react'

type ThemeData = {
  preset: string
  buttonStyle: string
}

export function AppearanceEditor({ initialTheme, profileUrl }: { initialTheme: ThemeData, profileUrl: string }) {
  const [isPending, startTransition] = useTransition()
  const [theme, setTheme] = useState<ThemeData>(initialTheme)

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateTheme(theme)
        toast.success('Appearance updated!')
      } catch (error: any) {
        toast.error(error.message || 'Failed to update appearance')
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Theme</CardTitle>
          <CardDescription>Choose an overarching color palette.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={theme.preset} 
            onValueChange={(val) => setTheme({ ...theme, preset: val })}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {/* Default */}
            <Label 
              htmlFor="preset-default"
              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all duration-200`}
            >
              <RadioGroupItem value="default" id="preset-default" className="sr-only" />
              <div className="w-full h-24 rounded-md bg-zinc-100 flex flex-col items-center justify-center p-2 space-y-2 relative overflow-hidden border">
                <div className="h-6 w-1/2 bg-black rounded-full" />
                <div className="h-6 w-3/4 bg-white/80 rounded-full" />
                <div className="h-6 w-2/3 bg-white/80 rounded-full" />
              </div>
              <span className="mt-4 font-semibold">Minimalist Light</span>
            </Label>

            {/* Cyber Dark */}
            <Label 
              htmlFor="preset-cyber"
              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all duration-200`}
            >
              <RadioGroupItem value="cyber" id="preset-cyber" className="sr-only" />
              <div className="w-full h-24 rounded-md bg-zinc-950 flex flex-col items-center justify-center p-2 space-y-2 border border-zinc-800">
                <div className="h-6 w-1/2 bg-blue-500 rounded-full" />
                <div className="h-6 w-3/4 bg-zinc-900 rounded-full" />
                <div className="h-6 w-2/3 bg-zinc-900 rounded-full" />
              </div>
              <span className="mt-4 font-semibold text-blue-500">Cyber Dark</span>
            </Label>

            {/* Emerald Glass */}
            <Label 
              htmlFor="preset-emerald"
              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary transition-all duration-200`}
            >
              <RadioGroupItem value="emerald" id="preset-emerald" className="sr-only" />
              <div className="w-full h-24 rounded-md bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900 via-zinc-950 to-zinc-950 flex flex-col items-center justify-center p-2 space-y-2 border border-emerald-900/50">
                <div className="h-6 w-1/2 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-full" />
                <div className="h-6 w-3/4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full" />
              </div>
              <span className="mt-4 font-semibold text-emerald-500">Emerald Glass</span>
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Button Style</CardTitle>
          <CardDescription>How should your link buttons look?</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={theme.buttonStyle} 
            onValueChange={(val) => setTheme({ ...theme, buttonStyle: val })}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value="solid" id="style-solid" />
              <Label htmlFor="style-solid" className="font-normal">Solid Background</Label>
            </div>
            <div className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value="outline" id="style-outline" />
              <Label htmlFor="style-outline" className="font-normal">Outline Only</Label>
            </div>
            <div className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value="glass" id="style-glass" />
              <Label htmlFor="style-glass" className="font-normal">Glassmorphism (Frosted Glass)</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <a href={profileUrl} target="_blank" rel="noopener noreferrer">
            Preview Profile
          </a>
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Palette className="mr-2 h-4 w-4" />}
          Save Appearance
        </Button>
      </div>
    </div>
  )
}
