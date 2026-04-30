'use client'

import { useState } from 'react'
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
import { createGiftCard } from '@/lib/api-client'
import { format } from 'date-fns'

interface AddCardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCardAdded?: () => void
}

export function AddCardModal({ open, onOpenChange, onCardAdded }: AddCardModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const [formData, setFormData] = useState({
    name: '',
    card_number: '',
    balance: '',
    details: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name || !formData.card_number || !formData.balance || !selectedDate) {
      setError('Please fill in all required fields')
      return
    }

    const balance = parseFloat(formData.balance)
    if (isNaN(balance) || balance <= 0) {
      setError('Balance must be a valid positive number')
      return
    }

    setLoading(true)
    try {
      await createGiftCard({
        name: formData.name,
        card_number: formData.card_number,
        balance,
        expr_date: format(selectedDate, 'yyyy-MM-dd'),
        details: formData.details || undefined,
      })
      
      // Reset form
      setFormData({ name: '', card_number: '', balance: '', details: '' })
      setSelectedDate(undefined)
      onOpenChange(false)
      
      // Trigger refresh
      onCardAdded?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create card')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Gift Card</DialogTitle>
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {/* Balance */}
          <div className="space-y-2">
            <Label htmlFor="balance">Initial Balance *</Label>
            <Input
              id="balance"
              name="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.balance}
              onChange={handleInputChange}
              disabled={loading}
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
                  disabled={loading}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto border-border bg-card p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Card Details */}
          <div className="space-y-2">
            <Label htmlFor="details">Card Details (Optional)</Label>
            <textarea
              id="details"
              name="details"
              placeholder="Any additional information about this card"
              value={formData.details}
              onChange={handleInputChange}
              disabled={loading}
              rows={3}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            />
          </div>

          {/* Actions */}
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
              {loading ? 'Adding...' : 'Add Card'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
