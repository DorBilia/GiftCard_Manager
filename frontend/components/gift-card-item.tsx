'use client'

import { CreditCard, Calendar, AlertCircle } from 'lucide-react'
import type { GiftCard } from '@/lib/gift-card-data'
import { cn } from '@/lib/utils'

interface GiftCardItemProps {
  card: GiftCard
  onClick: () => void
  variant?: 'active' | 'history'
}

export function GiftCardItem({ card, onClick, variant = 'active' }: GiftCardItemProps) {
  const isExpiringSoon = () => {
    const expDate = new Date(card.expirationDate)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getHistoryReasonLabel = (reason?: 'expired' | 'empty') => {
    switch (reason) {
      case 'expired':
        return 'Expired'
      case 'empty':
        return 'Balance Used'
      default:
        return 'Archived'
    }
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative w-full rounded-xl border border-border bg-card p-6 text-left transition-all duration-200',
        'hover:border-primary/50 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
      )}
    >
      {/* Card Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-card-foreground">{card.name}</h3>
        </div>
        {variant === 'active' && isExpiringSoon() && (
          <div className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-xs font-medium text-warning">
            <AlertCircle className="h-3 w-3" />
            Expiring Soon
          </div>
        )}
      </div>

      {/* Card Content */}
      {variant === 'active' ? (
        <>
          {/* Balance */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Balance</p>
            <p className="text-3xl font-bold text-card-foreground">
              {formatCurrency(card.balance)}
            </p>
            {card.balance < card.originalBalance && (
              <p className="text-sm text-muted-foreground">
                of {formatCurrency(card.originalBalance)}
              </p>
            )}
          </div>

          {/* Expiration Date */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Expires {formatDate(card.expirationDate)}</span>
          </div>
        </>
      ) : (
        <>
          {/* History Reason */}
          <div className="mt-2">
            <div className={cn(
              'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium',
              card.historyReason === 'expired' 
                ? 'bg-destructive/10 text-destructive' 
                : 'bg-muted text-muted-foreground'
            )}>
              <AlertCircle className="h-4 w-4" />
              {getHistoryReasonLabel(card.historyReason)}
            </div>
          </div>
        </>
      )}

      {/* Hover indicator */}
      <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-xl bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  )
}
