'use client'

import { useState, useTransition } from 'react'
import { addLink, deleteLink, toggleLinkVisibility, updateLinksOrder, editLink } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Trash2, Plus, GripVertical, Eye, EyeOff, Edit, Check, X, Heading } from 'lucide-react'
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from '@dnd-kit/core'
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy, 
  useSortable 
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface LinkItem {
  id: string
  title: string
  url: string | null
  is_active: boolean
  order_index?: number
  type?: string
  subtitle?: string | null
}

function SortableItem({ link, loading, handleDelete, handleToggle }: { 
  link: LinkItem, 
  loading: string | null, 
  handleDelete: (id: string) => void,
  handleToggle: (id: string, status: boolean) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id })
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  const isHeader = link.type === 'header'

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await editLink(link.id, formData)
        toast.success(isHeader ? 'Header updated!' : 'Link updated!')
        setIsEditing(false)
      } catch (error: any) {
        toast.error(error.message || 'Error updating')
      }
    })
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`group transition-colors relative ${!link.is_active ? 'opacity-60 bg-muted/20' : ''} ${isHeader ? 'border-primary/50' : ''}`}
    >
      <CardContent className="p-4 flex items-center gap-4">
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground transition-colors group-hover:text-muted-foreground/60 w-6 h-6 flex items-center justify-center -ml-2"
        >
          <GripVertical className="h-5 w-5" />
        </div>
        
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="flex-1 flex flex-col sm:flex-row gap-3">
            <input type="hidden" name="type" value={link.type || 'link'} />
            <div className="flex-1 space-y-2">
              <Input name="title" defaultValue={link.title} placeholder={isHeader ? "Header Text" : "Title"} required />
              {!isHeader && (
                <>
                  <Input name="subtitle" defaultValue={link.subtitle || ''} placeholder="Subtitle (optional)" />
                  <Input name="url" defaultValue={link.url || ''} placeholder="URL" required />
                </>
              )}
            </div>
            <div className="flex sm:flex-col items-center justify-center gap-2">
              <Button type="submit" size="sm" variant="default" disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              </Button>
              <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex-1 min-w-0 flex items-center gap-2">
              {isHeader ? (
                <>
                  <Heading className="h-4 w-4 text-primary" />
                  <p className="font-bold text-base truncate">{link.title}</p>
                </>
              ) : (
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{link.title}</p>
                  {link.subtitle && <p className="text-xs text-muted-foreground truncate font-medium">{link.subtitle}</p>}
                  <p className="text-xs text-muted-foreground truncate opacity-70">{link.url}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setIsEditing(true)}
                disabled={loading === link.id}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => handleToggle(link.id, link.is_active)}
                disabled={loading === `toggle-${link.id}`}
              >
                {link.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(link.id)}
                disabled={loading === link.id}
              >
                {loading === link.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function LinkList({ links }: { links: LinkItem[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [addType, setAddType] = useState<'link' | 'header'>('link')
  const [orderedLinks, setOrderedLinks] = useState<LinkItem[]>(links)

  // Sync state when props change
  if (links.length !== orderedLinks.length || links.some((l, i) => l.id !== orderedLinks[i]?.id || l.title !== orderedLinks[i]?.title || l.url !== orderedLinks[i]?.url || l.is_active !== orderedLinks[i]?.is_active || l.type !== orderedLinks[i]?.type)) {
    setOrderedLinks(links)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  async function handleAddSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading('add')
    const form = event.currentTarget
    const formData = new FormData(form)
    try {
      await addLink(formData)
      toast.success(addType === 'header' ? 'Header added!' : 'Link added!')
      setIsAdding(false)
      form.reset()
    } catch (error: any) {
      toast.error(error.message || 'Error adding item')
    } finally {
      setLoading(null)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this element?')) return
    setLoading(id)
    try {
      await deleteLink(id)
      toast.success('Deleted')
    } catch (error: any) {
      toast.error(error.message || 'Error deleting')
    } finally {
      setLoading(null)
    }
  }

  async function handleToggle(id: string, currentStatus: boolean) {
    setLoading(`toggle-${id}`)
    try {
      await toggleLinkVisibility(id, currentStatus)
      toast.success(currentStatus ? 'Hidden' : 'Visible')
    } catch (error: any) {
      toast.error(error.message || 'Error toggling')
    } finally {
      setLoading(null)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = orderedLinks.findIndex(l => l.id === active.id)
    const newIndex = orderedLinks.findIndex(l => l.id === over.id)

    const newOrder = arrayMove(orderedLinks, oldIndex, newIndex)
    setOrderedLinks(newOrder)

    // Save to server
    const payload = newOrder.map((link, index) => ({ id: link.id, order_index: index }))
    try {
      await updateLinksOrder(payload)
      toast.success('Reordered')
    } catch (error) {
      toast.error('Failed to save order')
      setOrderedLinks(links) // Revert
    }
  }

  return (
    <div className="space-y-6">
      {!isAdding ? (
        <div className="flex gap-2">
          <Button onClick={() => { setIsAdding(true); setAddType('link') }} className="flex-1 h-12 border-dashed" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Link
          </Button>
          <Button onClick={() => { setIsAdding(true); setAddType('header') }} className="flex-1 h-12 border-dashed" variant="outline">
            <Heading className="mr-2 h-4 w-4" />
            Add Header
          </Button>
        </div>
      ) : (
        <Card className="border-primary/50 bg-primary/5 transition-all animate-in fade-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleAddSubmit}>
            <input type="hidden" name="type" value={addType} />
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {addType === 'header' ? <><Heading className="h-4 w-4"/> Add New Header</> : <><Plus className="h-4 w-4"/> Add New Link</>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Input name="title" placeholder={addType === 'header' ? "Header Text (e.g. My Socials)" : "Title (e.g. My Website)"} required disabled={loading === 'add'} />
              </div>
              {addType === 'link' && (
                <>
                  <div className="space-y-1">
                    <Input name="subtitle" placeholder="Subtitle (optional, e.g. Check out my latest post!)" disabled={loading === 'add'} />
                  </div>
                  <div className="space-y-1">
                    <Input name="url" placeholder="URL (e.g. example.com)" required disabled={loading === 'add'} />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} disabled={loading === 'add'}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading === 'add'}>
                {loading === 'add' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {addType === 'header' ? 'Add Header' : 'Add Link'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      <div className="space-y-3">
        {orderedLinks.length === 0 && !isAdding && (
          <div className="text-center py-12 border rounded-xl bg-muted/30">
            <p className="text-muted-foreground text-sm">No items yet. Add your first link or header!</p>
          </div>
        )}
        
        <DndContext id="dashboard-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={orderedLinks} strategy={verticalListSortingStrategy}>
            {orderedLinks.map((link) => (
              <SortableItem 
                key={link.id} 
                link={link} 
                loading={loading} 
                handleDelete={handleDelete} 
                handleToggle={handleToggle} 
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}
