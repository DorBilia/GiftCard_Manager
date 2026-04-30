'use client'

import { useState, useEffect } from 'react'
import { Calendar, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { updateGiftCard, fetchCardDetail } from '@/lib/api-client'
import { format } from 'date-fns'
import type { GiftCard } from '@/lib/gift-card-data'

interface EditCardModalProps {
  card: GiftCard | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCardUpdated?: () => void
}

export function EditCardModal({ card, open, onOpenChange, onCardUpdated }: EditCardModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const [formData, setFormData] = useState({
    name: '',
    card_number: '',
    balance: '',
    details: '',
  })

  useEffect(() => {
    let mounted = true
    if (!card || !open) return

    setError(null)

    const populate = async () => {
      // initial populate from available card data
      setFormData({
        name: card.name,
        card_number: card.cardNumber ?? '',
        balance: card.balance.toString(),
        details: card.cardDetails ?? '',
      })
      setSelectedDate(card.expirationDate ? new Date(card.expirationDate) : undefined)

      // If card number missing in the overview, fetch full details
      if (!card.cardNumber) {
        setLoadingDetails(true)
        try {
          const detail = await fetchCardDetail(card.id)
          if (!mounted) return
          setFormData({
            name: detail.name,
            card_number: detail.card_number,
            balance: detail.balance.toString(),
            details: detail.details ?? '',
          })
          setSelectedDate(new Date(detail.expr_date))
        } catch (e) {
          console.error('Failed to fetch card details for edit:', e)
        } finally {
          if (mounted) setLoadingDetails(false)
        }
      }
    }

    populate()

    return () => {
      mounted = false
    }
  }, [card, open])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!card) return

    if (!formData.name || !formData.card_number || !formData.balance || !selectedDate) {
      setError('Please fill in all required fields')
      return
    }

    const balance = parseFloat(formData.balance)
    if (isNaN(balance) || balance < 0) {
      setError('Balance must be a valid non-negative number')
      return
    }

    setLoading(true)
    try {
      await updateGiftCard(card.id, {
        id: card.id,
        name: formData.name,
        card_number: formData.card_number,
        balance,
        expr_date: format(selectedDate, 'yyyy-MM-dd'),
        details: formData.details || null,
      })

      onOpenChange(false)
      onCardUpdated?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update card')
    } finally {
      setLoading(false)
    }
  }

  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Gift Card</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Card Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Card Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Amazon, Starbucks"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading || loadingDetails}
            />
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="card_number">Card Number *</Label>
            <Input
              id="card_number"
              name="card_number"
              placeholder="e.g., 4532-8901-2345-6789"
              value={formData.card_number}
              onChange={handleInputChange}
              disabled={loading || loadingDetails}
            />
          </div>

          {/* Balance */}
          <div className="space-y-2">
            <Label htmlFor="balance">Current Balance *</Label>
            <Input
              id="balance"
              name="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.balance}
              onChange={handleInputChange}
              disabled={loading || loadingDetails}
            />
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <Label>Expiration Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  disabled={loading || loadingDetails}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <textarea
              id="details"
              name="details"
              placeholder="Any additional notes about this gift card..."
              value={formData.details}
              onChange={handleInputChange}
              disabled={loading || loadingDetails}
              className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
