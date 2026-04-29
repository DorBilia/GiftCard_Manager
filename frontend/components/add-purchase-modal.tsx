'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
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
import { createPurchase } from '@/lib/api-client'
import { format } from 'date-fns'

interface AddPurchaseModalProps {
  cardId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onPurchaseAdded?: () => void
}

export function AddPurchaseModal({ cardId, open, onOpenChange, onPurchaseAdded }: AddPurchaseModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const [formData, setFormData] = useState({
    amount: '',
    store: '',
    details: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.amount || !selectedDate) {
      setError('Please fill in amount and date')
      return
    }

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be a valid positive number')
      return
    }

    setLoading(true)
    try {
      await createPurchase(cardId, {
        card_id: cardId,
        amount,
        date: format(selectedDate, 'yyyy-MM-dd'),
        store: formData.store || undefined,
        details: formData.details || undefined,
      })
      
      // Reset form
      setFormData({ amount: '', store: '', details: '' })
      setSelectedDate(new Date())
      onOpenChange(false)
      
      // Trigger refresh
      onPurchaseAdded?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create purchase')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-card sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Purchase</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          {/* Store */}
          <div className="space-y-2">
            <Label htmlFor="store">Store (Optional)</Label>
            <Input
              id="store"
              name="store"
              placeholder="e.g., Amazon.com, Local Store"
              value={formData.store}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          {/* Purchase Date */}
          <div className="space-y-2">
            <Label>Purchase Date *</Label>
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
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description/Details */}
          <div className="space-y-2">
            <Label htmlFor="details">Description (Optional)</Label>
            <textarea
              id="details"
              name="details"
              placeholder="What did you purchase?"
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
              {loading ? 'Adding...' : 'Add Purchase'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
