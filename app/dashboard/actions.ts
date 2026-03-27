'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const username = (formData.get('username') as string).toLowerCase()
  const fullName = formData.get('fullName') as string
  const bio = formData.get('bio') as string
  const avatarFile = formData.get('avatar') as File | null

  // Simple validation
  if (!/^[a-z0-9_]{3,20}$/.test(username)) {
    throw new Error('Username must be 3-20 characters and only contain letters, numbers, and underscores.')
  }

  let fullAvatarUrl = undefined

  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split('.').pop() || 'png'
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile, { upsert: true })

    if (uploadError) throw new Error(`Avatar upload failed: ${uploadError.message}. Make sure RLS is allowing INSERTs.`)
    
    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    fullAvatarUrl = publicUrlData.publicUrl
  }

  const updatePayload: any = {
    id: user.id,
    username,
    full_name: fullName,
    bio,
  }
  
  if (fullAvatarUrl) {
    updatePayload.avatar_url = fullAvatarUrl
  }

  const { error } = await supabase
    .from('profiles')
    .upsert(updatePayload)

  if (error) {
    if (error.code === '23505') throw new Error('Username already taken.')
    throw new Error(error.message)
  }

  revalidatePath('/dashboard')
  revalidatePath(`/${username}`)
}

export async function addLink(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const url = formData.get('url') as string
  const subtitle = formData.get('subtitle') as string || ''
  const type = formData.get('type') as string || 'link'

  if (!title) throw new Error('Title is required')
  if (type === 'link' && !url) throw new Error('URL is required for links')

  // Basic URL formatting
  let formattedUrl = url
  if (type === 'link' && url && !url.startsWith('http')) {
    formattedUrl = `https://${url}`
  }

  // Get the current max order_index
  const { data: maxLink } = await supabase
    .from('links')
    .select('order_index')
    .eq('user_id', user.id)
    .order('order_index', { ascending: false })
    .limit(1)
    .single()

  const nextOrderIndex = maxLink?.order_index !== undefined ? maxLink.order_index + 1 : 0

  const { error } = await supabase
    .from('links')
    .insert({
      user_id: user.id,
      title,
      subtitle: type === 'link' ? subtitle : null,
      url: type === 'link' ? formattedUrl : '',
      type,
      order_index: nextOrderIndex,
    })

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
}

export async function deleteLink(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
}

export async function toggleLinkVisibility(id: string, currentStatus: boolean) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('links')
    .update({ is_active: !currentStatus })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
}

export async function editLink(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const title = formData.get('title') as string
  const url = formData.get('url') as string
  const subtitle = formData.get('subtitle') as string || ''
  const type = formData.get('type') as string || 'link'

  if (!title) throw new Error('Title is required')
  if (type === 'link' && !url) throw new Error('URL is required for links')

  let formattedUrl = url
  if (type === 'link' && url && !url.startsWith('http')) {
    formattedUrl = `https://${url}`
  }

  const payload: any = { title }
  if (type === 'link') {
    payload.url = formattedUrl
    payload.subtitle = subtitle
  } else {
    payload.url = ''
    payload.subtitle = null
  }

  const { error } = await supabase
    .from('links')
    .update(payload)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
}

export async function updateLinksOrder(items: { id: string; order_index: number }[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  for (const item of items) {
    await supabase
      .from('links')
      .update({ order_index: item.order_index })
      .eq('id', item.id)
      .eq('user_id', user.id)
  }

  revalidatePath('/dashboard')
}

export async function updateTheme(themeData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('profiles')
    .update({ theme: themeData })
    .eq('id', user.id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard/appearance')
  // Revalidate the public profile as well
  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
  if (profile) revalidatePath(`/${profile.username}`)
}
