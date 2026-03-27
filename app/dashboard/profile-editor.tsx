'use client'

import { useState } from 'react'
import { updateProfile } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, AtSign, Image as ImageIcon } from 'lucide-react'

export function ProfileEditor({ 
  userId, 
  initialProfile = null 
}: { 
  userId: string, 
  initialProfile?: { username: string, full_name: string | null, bio: string | null } | null 
}) {
  const [loading, setLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    try {
      await updateProfile(formData)
      toast.success('Your profile has been saved.')
    } catch (error: any) {
      toast.error(error.message || 'An error occurred setting up your profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
    }
  }

  return (
    <Card className="w-full max-w-lg border dark:bg-card/50 shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">
          {initialProfile ? 'Edit Profile' : 'Complete your profile'}
        </CardTitle>
        <CardDescription>
          {initialProfile 
            ? 'Update your personal info and avatar.' 
            : 'Choose a unique username and tell us a bit about yourself.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="avatar" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Profile Avatar
            </Label>
            <div className="flex items-center gap-4">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Avatar preview" className="h-16 w-16 rounded-full object-cover border-2 shadow-sm" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-muted border-2 border-dashed flex items-center justify-center text-muted-foreground shadow-sm">
                  <ImageIcon className="h-6 w-6 opacity-50" />
                </div>
              )}
              <div className="flex-1">
                <Input 
                  id="avatar" 
                  name="avatar" 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  disabled={loading}
                  onChange={handleAvatarChange}
                  className="cursor-pointer file:cursor-pointer file:bg-primary/10 file:text-primary file:border-0 file:rounded-md file:px-2 file:py-1 hover:file:bg-primary/20 transition-all font-medium text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1.5">Max 5MB. Jpeg, Png, Webp.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground select-none">
                <AtSign className="h-4 w-4" />
              </span>
              <Input 
                id="username" 
                name="username" 
                placeholder="my_awesome_profile" 
                defaultValue={initialProfile?.username || ''}
                readOnly={!!initialProfile}
                required 
                disabled={loading}
                className={`pl-9 ${initialProfile ? 'opacity-50 cursor-not-allowed hidden' : ''}`}
              />
              {/* If editing, show the username as text to prevent accidental changes, but allow it for Setup Profile */}
              {initialProfile && (
                <div className="pl-9 py-2 text-sm font-medium border rounded-md bg-muted/30">
                  {initialProfile.username}
                </div>
              )}
            </div>
            {!initialProfile && (
              <p className="text-xs text-muted-foreground">This will be your link: prime-tree.com/yourname</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input 
              id="fullName" 
              name="fullName" 
              defaultValue={initialProfile?.full_name || ''}
              placeholder="John Doe" 
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Input 
              id="bio" 
              name="bio" 
              defaultValue={initialProfile?.bio || ''}
              placeholder="A few words about you..." 
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full h-12 rounded-full font-medium" type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save & Continue
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
