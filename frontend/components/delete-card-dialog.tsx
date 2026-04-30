'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteGiftCard } from '@/lib/api-client'
import type { GiftCard } from '@/lib/gift-card-data'

interface DeleteCardDialogProps {
  card: GiftCard | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCardDeleted?: () => void
}

export function DeleteCardDialog({ card, open, onOpenChange, onCardDeleted }: DeleteCardDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!card) return

    setLoading(true)
    setError(null)
    try {
      await deleteGiftCard(card.id)
      onOpenChange(false)
      onCardDeleted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete card')
      setLoading(false)
    }
  }

  if (!card) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-border bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Gift Card?</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Are you sure you want to delete <span className="font-semibold text-foreground">{card.name}</span>? This action cannot be undone.
          </AlertDialogDescription>
          {error && (
            <div className="mt-3 rounded-lg border border-destructive/50 bg-destructive/10 p-2 text-sm text-destructive">
              {error}
            </div>
          )}
        </AlertDialogHeader>
        <div className="flex gap-3">
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
